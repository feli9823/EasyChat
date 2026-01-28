import { searchWeb, crawlSite , extractContent } from "./tavilyService.js";
export class ChatService {
    constructor({ openai, prompt, store, model, maxTokens }) {
        this.openai = openai;
        this.prompt = prompt;
        this.store = store;
        this.model = model;
        this.maxTokens = maxTokens;
    }

    async chat({ id, nombre, mensaje }) {
        this.store.cleanupExpired();
        this.store.appendUserMessage(id, mensaje);

        const messages = [
            {
                role: "system",
                content: `${this.prompt.getInitialPrompt()}\n\nEl nombre del usuario es: ${nombre}.`,
            },
            ...this.store.getMessages(id).map(m => ({
                role: m.role,
                content: m.content,
            })),
        ];

        const completion = await this.openai.chat.completions.create({
            model: this.model,
            messages,
            max_tokens: this.maxTokens,
            tool_choice: "auto",
            tools: [
                {
                    type: "function",
                    function: {
                        name: "tavily_search",
                        description: "Use this function to search for information using Tavily.",
                        parameters: {
                            type: "object",
                            properties: {
                                query: { type: "string", description: "The search query" },
                                maxResults: { type: "integer", default: 5 },
                            },
                            required: ["query"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "tavily_crawl",
                        description: "Use this function to crawl a website using Tavily.",
                        parameters: {
                            type: "object",
                            properties: {
                                url: { type: "string", description: "The URL of the website to crawl" },
                                instructions: { type: "string", description: "Instructions for crawling the website" },
                            },
                            required: ["url", "instructions"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "tavily_extract",
                        description: "Use this function to extract content from URLs using Tavily.",
                        parameters: {
                            type: "object",
                            properties: {
                                urls: { type: "array", items: { type: "string" }, description: "The list of URLs to extract content from" },
                            },
                            required: ["urls"],
                        },
                    },
                },
            ],
        });

        const assistantMessage = completion?.choices?.[0]?.message;
        const toolCall = assistantMessage?.tool_calls?.[0];

        if (toolCall) {
            let tavilyResult;
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments || "{}");

            
            if (toolName === "tavily_search") {
                tavilyResult = await searchWeb(toolArgs.query, { maxResults: toolArgs.maxResults });
            } else if (toolName === "tavily_crawl") {
                tavilyResult = await crawlSite(toolArgs.url, toolArgs.instructions);
            } else if (toolName === "tavily_extract") {
                tavilyResult = await extractContent(toolArgs.urls);
            }

            const followupMessages = [
                ...messages,
                assistantMessage,
                {
                    role: "tool",
                    name: toolName,
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(tavilyResult),
                },
            ];

            const followupCompletion = await this.openai.chat.completions.create({
                model: this.model,
                messages: followupMessages,
                max_tokens: this.maxTokens,
            });

            const respuestaBot = followupCompletion?.choices?.[0]?.message?.content ?? "";
            this.store.appendAssistantMessage(id, respuestaBot);
            return respuestaBot;
        }
    
        const respuestaBot = assistantMessage?.content ?? "";
        this.store.appendAssistantMessage(id, respuestaBot);
        return respuestaBot;
    }
}

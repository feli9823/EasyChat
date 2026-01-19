
export class ChatService {
    constructor({ openai, prompt, store, model, maxTokens }) {
        this.openai = openai;
        this.prompt = prompt;
        this.store = store;
        this.model = model;
        this.maxTokens = maxTokens;
        
    }

    async chat({ id, nombre, mensaje }) {
        // Best-effort cleanup to avoid unbounded user map growth.
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
        });

        const respuestaBot = completion?.choices?.[0]?.message?.content ?? "";
        this.store.appendAssistantMessage(id, respuestaBot);
        return respuestaBot;
    }


}

import OpenAI from "openai";

export function createOpenAIClient({ apiKey }) {
    if (!apiKey) {
        // Keep server running (useful for local dev), but fail only on /chat usage.
        console.warn("OPENAI_API_KEY no está configurada. /chat fallará.");

        return {
            chat: {
                completions: {
                    create: async () => {
                        const err = new Error("OPENAI_API_KEY no está configurada");
                        err.status = 500;
                        throw err;
                    },
                },
            },
        };
    }
    return new OpenAI({ apiKey });
}

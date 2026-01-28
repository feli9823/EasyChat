import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();
const tavilyApiKey = process.env.TAVILY_API_KEY;

if (!tavilyApiKey) {
    throw new Error("TAVILY_API_KEY environment variable is not set");
}

const client = tavily({ apiKey: tavilyApiKey });

export async function searchWeb(query, options = {}) {
    return client.search(query, {
        maxResults: 5,
        searchDepth: "advanced",
        includeAnswer: true,
        ...options,
    });
}

export async function extractContent(urls, options = {}) {
    return client.extract(urls, {
        extractDepth: "advanced",
        ...options,
    });
}

export async function crawlSite(url, instructions, options = {}) {
    return client.crawl(url, {
        instructions,
        extractDepth: "advanced",
        ...options,
    });
}

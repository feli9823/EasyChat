import cors from "cors";

function normalizeOrigin(origin) {
    return typeof origin === "string" ? origin.trim().replace(/\/$/, "") : origin;
}

export function createCorsMiddleware({ origins }) {
    const allowlist = Array.isArray(origins) && origins.length
        ? origins.map(normalizeOrigin)
        : [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ];


    return cors({
        origin: (origin, callback) => {
            // Server-to-server / curl requests often have no Origin.
            if (!origin) return callback(null, true);
            const normalized = normalizeOrigin(origin);
            const allowed = allowlist.includes(normalized);
            return callback(null, allowed);
        },
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Accept", "Authorization"],
        credentials: true,
    });
}

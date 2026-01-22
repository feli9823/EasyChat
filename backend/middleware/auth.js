import jwt from "jsonwebtoken";
import { getEnv } from "../config/env.js";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token de autenticación faltante" });
    }

    // We need to access the secret directly or via env config
    // Assuming getEnv() provides process.env vars comfortably if updated or we just use process.env here
    const secret = process.env.EASYCHAT_SECRET; 

    if (!secret) {
        console.error("EASYCHAT_SECRET no configurado en servidor");
        return res.status(500).json({ error: "Error de configuración del servidor" });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
        req.user = user;
        next();
    });
}

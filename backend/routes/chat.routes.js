import { Router } from "express";
import { validateChatRequest, validateDeleteRequest } from "../middleware/validators.js";

import { authenticateToken } from "../middleware/auth.js";

export function createChatRouter({ controller, chatLimiter, deleteLimiter }) {
    const router = Router();

    router.get("/saludo", controller.saludo);
    router.post("/chat", authenticateToken, chatLimiter, validateChatRequest, controller.chat);
    router.post("/eliminarMemoria", authenticateToken, deleteLimiter, validateDeleteRequest, controller.eliminarMemoria);

    return router;
}

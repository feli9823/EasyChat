const MAX_NAME_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 1500;
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

import { InputUser } from "../validation/inputUser.js";

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function validateChatBody(body) {
    // Only validate message
    const { mensaje } = body;

    if (!isNonEmptyString(mensaje)) {
        return { ok: false, error: "Falta o es inválido: mensaje" };
    }
    if (mensaje.length > MAX_MESSAGE_LENGTH) {
        return { ok: false, error: `mensaje demasiado largo (máximo ${MAX_MESSAGE_LENGTH})` };
    }

    return { ok: true, value: { mensaje } };
}

function validateDeleteBody(body) {
    // No body needed for delete, ID comes from token
    return { ok: true, value: {} };
}

export function validateChatRequest(req, res, next) {
    const parsed = validateChatBody(req.body);
    if (!parsed.ok) {
        return res.status(400).json({ error: parsed.error });
    }
    req.chatInput = parsed.value;
    next();
}

export function validateDeleteRequest(req, res, next) {
    const parsed = validateDeleteBody(req.body);
    if (!parsed.ok) {
        return res.status(400).json({ error: parsed.error });
    }
    req.deleteInput = parsed.value;
    next();
}

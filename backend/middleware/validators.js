const MAX_NAME_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 1500;
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

import { InputUser } from "../validation/inputUser.js";

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function validateChatBody(body) {
    const normalized = InputUser.fromChatBody(body);
    if (!normalized.ok) return normalized;

    const { id, nombre, mensaje } = normalized.value;

    if (!isNonEmptyString(id)) {
        return { ok: false, error: "Falta o es inválido: id" };
    }
    if (!ID_PATTERN.test(id)) {
        return { ok: false, error: "id inválido (solo letras, números, '_' y '-' y máximo 64)" };
    }

    if (!isNonEmptyString(nombre)) {
        return { ok: false, error: "Falta o es inválido: nombre" };
    }
    if (nombre.length > MAX_NAME_LENGTH) {
        return { ok: false, error: `nombre demasiado largo (máximo ${MAX_NAME_LENGTH})` };
    }

    if (!isNonEmptyString(mensaje)) {
        return { ok: false, error: "Falta o es inválido: mensaje" };
    }
    if (mensaje.length > MAX_MESSAGE_LENGTH) {
        return { ok: false, error: `mensaje demasiado largo (máximo ${MAX_MESSAGE_LENGTH})` };
    }

    return { ok: true, value: { id, nombre, mensaje } };
}

function validateDeleteBody(body) {
    const normalized = InputUser.fromDeleteBody(body);
    if (!normalized.ok) return normalized;

    const { id } = normalized.value;
    if (!isNonEmptyString(id)) {
        return { ok: false, error: "Falta o es inválido: id" };
    }
    if (!ID_PATTERN.test(id)) {
        return { ok: false, error: "id inválido (solo letras, números, '_' y '-' y máximo 64)" };
    }
    return { ok: true, value: { id } };
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

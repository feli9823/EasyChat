export class InputUser {
	static _toTrimmedString(value) {
		if (value === null || value === undefined) return "";
		return String(value).trim();
	}

	static _cleanText(value) {
		// Normalize to a safe, readable string for OpenAI prompts.
		const text = InputUser._toTrimmedString(value);
		// Remove ASCII control chars except common whitespace (tab/newline).
		const withoutControls = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
		// Collapse excessive spaces (keep newlines).
		return withoutControls.replace(/[ \t]{2,}/g, " ");
	}

	static fromChatBody(body) {
		if (!body || typeof body !== "object") {
			return { ok: false, error: "Body inválido (se esperaba JSON)" };
		}

		const id = InputUser._toTrimmedString(body.id);
		const nombre = InputUser._cleanText(body.nombre);
		const mensaje = InputUser._cleanText(body.mensaje);

		return { ok: true, value: { id, nombre, mensaje } };
	}

	static fromDeleteBody(body) {
		if (!body || typeof body !== "object") {
			return { ok: false, error: "Body inválido (se esperaba JSON)" };
		}

		const id = InputUser._toTrimmedString(body.id);
		return { ok: true, value: { id } };
	}
}
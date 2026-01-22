export function createChatController({ chatService, store }) {
    return {
        saludo: (req, res) => {
            res.json({
                saludo: "Hola, soy EVA, tu asistente de inteligencia artificial. ¿En qué puedo ayudarte hoy?",
            });
        },

        chat: async (req, res) => {
            const { mensaje } = req.chatInput;
            // Use ID and Name from the authenticated token
            const id = req.user.id;
            const nombre = req.user.nombre;

            try {
                const respuesta = await chatService.chat({ id, nombre, mensaje });
                res.json({ respuesta });
            } catch (error) {
                console.error("Error en chat controller:", error);
                res.status(500).json({ error: "Error comunicando con OpenAI" });
            }
        },

        eliminarMemoria: (req, res) => {
            const id = req.user.id;
            store.deleteUser(id);
            res.json({ mensaje: "Memoria eliminada para el usuario con id: " + id });
        },
    };
}

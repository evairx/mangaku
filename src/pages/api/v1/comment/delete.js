import Connect from "@/db/connect";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        try {
            await Connect();

            const { commentId } = req.body;

            const comment = await Comment .findByIdAndDelete(commentId);

            if (!comment) {
              throw new Error("El comentario no pudo ser eliminado!");
            }
            res.status(200).json("El comentario ha sido eliminado exitosamente!");

        } catch (error) {
            console.error('Error al procesar el like:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        return res.status(400).json({ error: 'Método no permitido' });
    }
}
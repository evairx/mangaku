import Connect from "@/db/connect";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        try {
            await Connect();

            const { userId, commentId } = req.body;

            const comment = await Comment.findOne({ _id: commentId });

            if (!comment) {
                return res.status(404).json({ error: 'El comentario no pudo ser encontrado' });
            }

            // Verifica si el userId ya existe en el array de likes
            const index = comment.likes.indexOf(userId);
            if (index !== -1) {
                // Si el userId ya existe, elimínalo
                comment.likes.splice(index, 1);
                await comment.save();
                return res.json({ message: 'Like eliminado exitosamente' });
            } else {
                // Si el userId no existe, agrégalo
                comment.likes.push(userId);
                await comment.save();
                return res.json({ message: 'Like agregado exitosamente' });
            }
        } catch (error) {
            console.error('Error al procesar el like:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        return res.status(400).json({ error: 'Método no permitido' });
    }
}
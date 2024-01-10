import Connect from "@/db/connect";
import Comment from "@/models/Comment";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        try {
            await Connect();

            const getToken = req.headers.authorization;

            if(!getToken) {
                return res.status(401).json({not_auth_token: {} });
            }

            const token = req.headers.authorization.split(" ")[1];

            const decodedToken = jwt.verify(token, process.env.SECRET);
    
            if (!(decodedToken.status === "ACTIVE")) {
                res.status(400).json({ not_allowed: {} });
            }

            const { userId, commentId } = req.body;

            const comment = await Comment.findOne({ _id: commentId });

            if (!comment) {
                return res.status(404).json({ error: 'El comentario no pudo ser encontrado' });
            }

            const index = comment.likes.indexOf(userId);
            if (index !== -1) {
                comment.likes.splice(index, 1);
                await comment.save();
                return res.json({ message: 'Like eliminado exitosamente' });
            } else {
                comment.likes.push(userId);
                await comment.save();
                return res.json({ message: 'Like agregado exitosamente' });
            }
        } catch (error) {
            console.error('Error al procesar el like:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        return res.status(400).json({ no_auth_token: {} });
    }
}
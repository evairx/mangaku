import Connect from "@/db/connect";
import Comment from "@/models/Comment";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        try {
            const getToken = req.headers.authorization;

            if(!getToken) {
                return res.status(401).json({not_auth_token: {} });
            }

            const token = req.headers.authorization.split(" ")[1];

            const decodedToken = jwt.verify(token, process.env.SECRET);
    
            if (!(decodedToken.status === "ACTIVE")) {
                res.status(400).json({ not_allowed: {} });
            }

            await Connect();

            const userId = decodedToken.id;

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }

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
        return res.status(401).json({not_auth_token: {} });
    }
}
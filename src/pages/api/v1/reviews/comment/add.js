import Connect from "@/db/connect";
import Comment from "@/models/Comment";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const { method } = req;

    if(method === "POST"){
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

        const { body } = req;

        const comment = await Comment.create(body);
        
        if (!comment) {
            res.status(400).json('El comentario no pudo ser creado');
        }
        
        res.status(200).json({ id: comment._id });
    } else {
        return res.status(401).json({not_auth_token: {} });
    }
}
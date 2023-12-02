import Connect from "@/db/connect";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const { method } = req;

    if(method === "GET"){
        const getToken = req.headers.authorization;

        if(!getToken) {
            return res.status(401).json({ no_token: {} });
        }

        await Connect()

        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.SECRET);
        const userId = decodedToken.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const { _id, username, email, roles, avatarId ,favorites, date } = user;

        const avatar = `${avatarId}.webp`;

        return res.json({ _id, username, email, roles, avatar, favorites, date});

    } else {
        return res.status(400).json({ error: {} });
    }
}
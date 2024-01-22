import Connect from "@/db/connect";
import Collection from "@/models/Collection";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        try {
            await Connect();

            const getToken = req.headers.authorization;

            if (!getToken) {
                return res.status(401).json({ not_auth_token: {} });
            }

            const token = req.headers.authorization.split(" ")[1];

            const decodedToken = jwt.verify(token, process.env.SECRET);

            if (!(decodedToken.status === "ACTIVE")) {
                res.status(400).json({ not_allowed: {} });
            }

            const { userId, collectionId } = req.body;

            const action = req.query.action;

            const collection = await Collection.findOne({ _id: collectionId });

            if (!collection) {
                return res.status(404).json({ error: 'La colección no pudo ser encontrada' });
            }

            const addLike = "up"
            const addDisLike = "down"

            if (action === addLike) {
                // Verificar si el usuario dio dislike
                const dislikeIndex = collection.dislikes.indexOf(userId);

                if (dislikeIndex !== -1) {
                    // Si el usuario ya dio dislike, quitar el dislike y agregar el like
                    collection.dislikes.splice(dislikeIndex, 1);
                    collection.likes.push(userId);

                    await collection.save();
                    return res.json({ message: 'Like agregado exitosamente' });
                } else {
                    // Si el usuario no dio dislike, verificar si dio like
                    const likeIndex = collection.likes.indexOf(userId);

                    if (likeIndex !== -1) {
                        // Si el usuario ya dio like, quitar el like
                        collection.likes.splice(likeIndex, 1);
                        await collection.save();
                        return res.json({ message: 'Like eliminado exitosamente' });
                    } else {
                        // Si el usuario no dio like ni dislike, agregar el like
                        collection.likes.push(userId);
                        await collection.save();
                        return res.json({ message: 'Like agregado exitosamente' });
                    }
                }

            } else if (action === addDisLike) {
                // Verificar si el usuario dio dislike
                const likeIndex = collection.likes.indexOf(userId);

                if (likeIndex !== -1) {
                    // Si el usuario ya dio like, quitar el like y agregar el dislike
                    collection.likes.splice(likeIndex, 1);
                    collection.dislikes.push(userId);

                    await collection.save();
                    return res.json({ message: 'disLike agregado exitosamente' });
                } else {
                    // Si el usuario no dio dislike, verificar si dio like
                    const dislikeIndex = collection.dislikes.indexOf(userId);

                    if (dislikeIndex !== -1) {
                        // Si el usuario ya dio like, quitar el like
                        collection.dislikes.splice(dislikeIndex, 1);
                        await collection.save();
                        return res.json({ message: 'Like eliminado exitosamente' });
                    } else {
                        // Si el usuario no dio like ni dislike, agregar el like
                        collection.dislikes.push(userId);
                        await collection.save();
                        return res.json({ message: 'Like agregado exitosamente' });
                    }
                }
            }
        } catch (error) {
            console.error('Error al procesar el like/dislike:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        return res.status(400).json({ no_auth_token: {} });
    }
}
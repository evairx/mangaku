import Connect from "@/db/connect";
import Collection from "@/models/Collection";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    const { method } = req;

    if (method === "GET") {
        if(req.headers.authorization === undefined) {
            res.status(400).json({ not_auth_token: {} });
            return;
        };
    
        const token = req.headers.authorization.split(" ")[1];
    
        const decodedToken = jwt.verify(token, process.env.SECRET);
    
        if (!(decodedToken.status === "OFFLINE" || decodedToken.status === "ACTIVE")) {
              res.status(400).json({ not_allowed: {} });
        }
      
        await Connect();

        const slug = req.query.slug;

        const collection = await Collection.findOne({ titleslug: slug });

        const like = collection.likes;
        const dislike = collection.dislikes;

        const likes = like ? like.length : 0;
        const dislikes = dislike ? dislike.length : 0;

        function formatLikesCount(likes) {
            if (likes >= 1000 && likes < 1000000) {
              return formatNumberWithK(likes, 1000);
            } else if (likes >= 1000000 && likes < 1000000000) {
              return formatNumberWithK(likes, 1000000);
            } else if (likes >= 1000000000) {
              return formatNumberWithK(likes, 1000000000);
            } else {
              return likes.toString();
            }
        }

        function formatNumberWithK(value, divisor) {
            const result = Math.floor(value / divisor);
            const remainder = value % divisor;
            const decimal = Math.floor(remainder / (divisor / 10));
          
            if (decimal >= 5) {
              return (result + 1).toString() + '.' + (decimal - 5).toString() + ' K';
            } else {
              return result.toString() + '.' + decimal.toString() + ' K';
            }
          }

        const likeCount = formatLikesCount(likes);
        const disLikeCount = formatLikesCount(dislikes);

        if (decodedToken.status === "OFFLINE") {
            const response = {
                up: {
                    displayed: likeCount,
                },
                down: {
                    displayed: disLikeCount,
                },
            }
    
            res.status(200).json(response);

        } else if (decodedToken.status === "ACTIVE") {
            const userId = decodedToken.id;

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }
            
            let rating = "";

            if (collection.likes.includes(user._id)) {
                rating = "up";
            } else if (collection.dislikes.includes(user._id)) {
                rating = "down";
            }

            const response = {
                up: {
                    displayed: likeCount,
                    total: likes,
                },
                down: {
                    displayed: disLikeCount,
                    total: dislikes,
                },
                rating: rating,
            }
    
            res.status(200).json(response);
        }
    } else if (method === "PUT") {
        try {

            const getToken = req.headers.authorization;

            if (!getToken) {
                return res.status(401).json({ not_auth_token: {} });
            }

            const token = req.headers.authorization.split(" ")[1];

            const decodedToken = jwt.verify(token, process.env.SECRET);

            if (!(decodedToken.status === "ACTIVE")) {
                res.status(400).json({ not_allowed: {} });
            }

            await Connect();

            const { userId, collectionId, type } = req.body;

            if (!userId || !collectionId || !type ) {
                res.status(400).json({ not_allowed: {} });
            }

            const collection = await Collection.findOne({ _id: collectionId });

            if (!collection) {
                return res.status(404).json({ error: 'La colección no pudo ser encontrada' });
            }

            if (type === "up") {
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

            } else if (type === "down") {
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
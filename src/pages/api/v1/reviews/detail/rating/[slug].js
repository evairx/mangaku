import Connect from "@/db/connect";
import Manga from "@/models/Collection";
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

        const manga = await Manga.findOne({ titleslug: slug });

        const like = manga.likes;
        const dislike = manga.dislikes;

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
                    total: likes,
                },
                down: {
                    displayed: disLikeCount,
                    total: dislikes,
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

            if (manga.likes.includes(user._id)) {
                rating = "up";
            } else if (manga.dislikes.includes(user._id)) {
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
    }
}
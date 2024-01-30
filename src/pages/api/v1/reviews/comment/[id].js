import Connect from "@/db/connect";
import Manga from "@/models/Collection";
import Comment from "@/models/Comment";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const id = req.query.id;
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                await Connect();

                const getToken = req.headers.authorization;
        
                if(!getToken) {
                    return res.status(401).json({not_auth_token: {} });
                }
        
                const token = req.headers.authorization.split(" ")[1];
        
                const decodedToken = jwt.verify(token, process.env.SECRET);
        
                if (!(decodedToken.status === "OFFLINE" || decodedToken.status === "ACTIVE")) {
                    res.status(400).json({ not_allowed: {} });
                }
        
                const manga = await Manga.findOne({ _id: id });
        
                if (!manga || (Array.isArray(manga) && manga.length === 0)) {
                    res.status(200).json({});
                    return;
                }
        
                const comments = await Comment.find({ mangaId: id });
        
                if (!comments || (Array.isArray(comments) && comments.length === 0)) {
                    res.status(200).json({
                        title: manga.title,
                        count: 0,
                        comments: [],
                    });
                    return;
                }
        
                // Función para formatear la fecha
                const formatTimeAgo = (date) => {
                    const currentDate = new Date();
                    const commentDate = new Date(date);
                    const timeDifference = currentDate - commentDate;
                    const seconds = Math.floor(timeDifference / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    const weeks = Math.floor(days / 7);
                    const months = Math.floor(days / 30);
                    const years = Math.floor(days / 365);
                
                    if (seconds < 60) {
                        return 'Ahora mismo';
                    } else if (minutes < 60) {
                        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
                    } else if (hours < 24) {
                        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
                    } else if (days < 7) {
                        return `Hace ${days} día${days > 1 ? 's' : ''}`;
                    } else if (weeks < 4) {
                        return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
                    } else if (months < 12) {
                        return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
                    } else {
                        return `Hace ${years} año${years > 1 ? 's' : ''}`;
                    }
                };
        
                const commentsWithCount = await Promise.all(
                    comments.map(async (comment) => {
                        const user = await UserModel.findOne({ _id: comment.userId });
                        const username = user ? user.username : "UnknownUser";
                        const avatar = user ? `/v1/static/avatar/${user.avatarId}.webp` : "UnknownUser";
        
                        const { mangaId, userId, date, likes , ...commentData } = comment.toObject();
        
                        const likee = likes ? likes.length : 0;
        
                        function formatLikesCount(likes) {
                            if (likes >= 1000 && likes < 1000000) {
                              return formatNumaberWithK(likes, 1000);
                            } else if (likes >= 1000000 && likes < 1000000000) {
                              return formatNumaberWithK(likes, 1000000);
                            } else if (likes >= 1000000000) {
                              return formatNumaberWithK(likes, 1000000000);
                            } else {
                              return likes.toString();
                            }
                        }
                
                        function formatNumaberWithK(value, divisor) {
                            const result = Math.floor(value / divisor);
                            const remainder = value % divisor;
                            const decimal = Math.floor(remainder / (divisor / 10));
                          
                            if (decimal >= 5) {
                              return (result + 1).toString() + '.' + (decimal - 5).toString() + ' K';
                            } else {
                              return result.toString() + '.' + decimal.toString() + ' K';
                            }
                        }
        
                        const likeCount = formatLikesCount(likee);
                                    
                        let rating = "";
            
                        if (likes.includes(user._id)) {
                            rating = "up";
                        }
        
                        switch (decodedToken.status) {
                            case "OFFLINE":
                                return {
                                    ...commentData,
                                    userId,
                                    avatar,
                                    username,
                                    date: formatTimeAgo(date),
                                    created: date,
                                    up: {
                                        displayed: likeCount,
                                    },
                                };
                            case "ACTIVE":
                                return {
                                    ...commentData,
                                    userId,
                                    avatar,
                                    username,
                                    date: formatTimeAgo(date),
                                    created: date,
                                    up: {
                                        displayed: likeCount,
                                        total: likes.length,
                                    },
                                    rating: rating
                                };
                        }
                    })
                );
        
                const response = {
                    title: manga.title,
                    count: comments.length,
                    comments: commentsWithCount,
                };
        
                res.status(200).json(response);
            } catch (err) {
                res.status(500).json(err);
                console.log(err)
            }
            break
        default:
            res.status(400).json({ not_auth_token: {} });
            break
    }
}
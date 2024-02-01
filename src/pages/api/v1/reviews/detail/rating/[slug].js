import Connect from "@/db/connect";
import Collection from "@/models/Collection";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
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
                
                const fiveCount = collection.votes.five.length;
                const fourCount = collection.votes.four.length;
                const threeCount = collection.votes.three.length;
                const twoCount = collection.votes.two.length;
                const oneCount = collection.votes.one.length;
        
                const createRating = (ratings) => {
                    let result = {};
            
                    let totalVotes = 0;
            
                    ratings.forEach(({ votes }) => {
                    totalVotes += votes;
                    });
            
                    ratings.forEach(({ rating, votes }) => {
                    const percentage = totalVotes !== 0 ? Math.max(0, Math.round((votes / totalVotes) * 100)) : 0;
                    const Votes = formatVotesCount(votes);
            
                    result[rating] = {
                        votes: Votes,
                        percentage: percentage,
                    };
                    });
            
                    function formatVotesCount(votes) {
                    if (votes >= 1000 && votes < 1000000) {
                        return formatNumberWithK(votes, 1000);
                    } else if (votes >= 1000000 && votes < 1000000000) {
                        return formatNumberWithK(votes, 1000000);
                    } else if (votes >= 1000000000) {
                        return formatNumberWithK(votes, 1000000000);
                    } else {
                        return votes.toString();
                    }
                    }
            
                    function formatNumberWithK(value, divisor) {
                    const result = Math.floor(value / divisor);
                    const remainder = value % divisor;
                    const decimal = Math.floor((remainder / divisor) * 10);
            
                    if (decimal > 0) {
                        return `${result}.${decimal} K`;
                    } else {
                        return `${result} K`;
                    }
                    }
            
                    const overallAverage =
                    totalVotes !== 0
                        ? (ratings.reduce((acc, { rating, votes }) => acc + rating * votes, 0) / totalVotes).toFixed(1)
                        : 0;
            
                    result['average'] = overallAverage;
                    result['total'] = totalVotes.toLocaleString();
            
                    return result;
                };
            
                const ratings = [
                    { rating: 5, votes: fiveCount },
                    { rating: 4, votes: fourCount },
                    { rating: 3, votes: threeCount },
                    { rating: 2, votes: twoCount },
                    { rating: 1, votes: oneCount },
                ];
            
                const result = createRating(ratings);
    
                switch (decodedToken.status) {
                    case "OFFLINE":
                        const responseOffline = {
                            ...result,
                        }
                
                        res.status(200).json(responseOffline);
                        break
                    case "ACTIVE":
                        const userId = decodedToken.id;
    
                        const user = await UserModel.findById(userId);
    
                        if (!user) {
                            return res.status(401).json({ message: "Usuario no encontrado" });
                        }
                        
                        let rating = "";

                        if (Object.values(collection.votes).some(voteArray => voteArray.includes(user._id))) {
                            // Encuentra la clave (clasificación) que contiene el user._id
                            const foundRating = Object.keys(collection.votes).find(key => collection.votes[key].includes(user._id));
                        
                            // Asigna el valor numérico correspondiente
                            switch (foundRating) {
                                case "five":
                                    rating = "5";
                                    break;
                                case "four":
                                    rating = "4";
                                    break;
                                case "three":
                                    rating = "3";
                                    break;
                                case "two":
                                    rating = "2";
                                    break;
                                case "one":
                                    rating = "1";
                                    break;
                                default:
                                    rating = "";
                                    break;
                            }
                        }
    
                        const response = {
                            ...result,
                            rating: rating,
                        }
                
                        res.status(200).json(response);
                        break
                }
            } catch (err) {
                res.status(500).json(err);
                console.log(err);
            }
            break
        case "PUT":
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
                const voteCategories = ["five", "four", "three", "two", "one"];
                const existingVoteCategory = voteCategories.find(category => collection.votes[category].includes(userId));
                
                // Eliminar votos existentes en otras categorías si el usuario ya ha votado
                if (existingVoteCategory && existingVoteCategory !== type) {
                    collection.votes[existingVoteCategory].splice(collection.votes[existingVoteCategory].indexOf(userId), 1);
                }
                
                // Agregar el voto al tipo especificado
                switch (type) {
                    case "5":
                        collection.votes["five"].push(userId);
                        await collection.save();
                        return res.json({ message: 'Voto agregado exitosamente a five' });
                    case "4":
                        collection.votes["four"].push(userId);
                        await collection.save();
                        return res.json({ message: 'Voto agregado exitosamente a four' });
                    case "3":
                        collection.votes["three"].push(userId);
                        await collection.save();
                        return res.json({ message: 'Voto agregado exitosamente a three' });
                    case "2":
                        collection.votes["two"].push(userId);
                        await collection.save();
                        return res.json({ message: 'Voto agregado exitosamente a two' });
                    case "1":
                        collection.votes["one"].push(userId);
                        await collection.save();
                        return res.json({ message: 'Voto agregado exitosamente a one' });
                }

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
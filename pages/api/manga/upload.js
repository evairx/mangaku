import Connect from "@/db/connect";
import Manga from "@/models/Manga";

export default async function handler(req, res) {
    const { method } = req;

    if(method === "POST"){
        await Connect();

        const { body } = req;

        const manga = await Manga.create(body);
        
        if (!manga) {
            res.status(400).json('El manga no pudo ser creado');
        }
        
        res.status(200).json({ id: manga._id });
    } else {
        res.status(400).json({error: {}})
    }
}
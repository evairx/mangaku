import Connect from "@/db/connect";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
    const { method } = req;

    if(method === "POST"){
        await Connect();

        const { body } = req;

        const comment = await Comment.create(body);
        
        if (!comment) {
            res.status(400).json('El comentario no pudo ser creado');
        }
        
        res.status(200).json({ id: comment._id });
    } else {
        res.status(400).json({error: {}})
    }
}
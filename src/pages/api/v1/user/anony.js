import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        const datos = {
            status: "OFFLINE",
            client_tag: "*",
            id: "ANONYMOUS"
        }
        const token = jwt.sign(datos, process.env.SECRET, { expiresIn: '12h' });

        res.status(200).json({ token });
    } else {
        res.redirect("/");
    }
}
import Connect from "@/db/connect";
import UserModel from "@/models/User"
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        await Connect();

        const { email, password } = req.body;

        if (!email && !password) {
            res.status(500).json("inputs vacíos");
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(400).json({ error: "Este usuario no existe" });
        }

        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            res.status(400).json({ message: "Credenciales inválidas" });
        }

        const datos = {
            status: "ACTIVE",
            client_tag: "*",
            id: user._id
        }

        const token = jwt.sign(datos, process.env.SECRET, { expiresIn: '730h' });

        res.status(200).json({ token });
    } else {
        res.redirect("/");
    }
}
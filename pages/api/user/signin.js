import Connect from "@/db/connect";
import UserModel from "@/src/models/User"
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        await Connect();

        const { email, password } = req.body;

        if (!email && !password) {
            return res.status(500).json("inputs vacíos");
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Este usuario no existe" });
        }

        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '730h' });

        return res.status(200).json({ token });
    } else {
        return res.redirect("/");
    }
}
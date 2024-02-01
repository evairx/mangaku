import Connect from "@/db/connect";
import UserModel from "@/models/User"
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import geoip from 'geoip-lite'; 
import requestIp from 'request-ip'
import { v4 as uuidv4 } from 'uuid';

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

        const ip = requestIp.getClientIp(req);

        let country = "";

        if (ip === "::1") {
            country = "localhost";
        } else {
            const geo = geoip.lookup(ip);
            country = geo ? geo.country : "";
        }

        const datos = {
            status: "ACTIVE",
            iss: "mangaku",
            oauth_scopes: "account content reviews",
            client_tag: "*",
            id: user._id,
            country: country,
            device_id: uuidv4()
        }

        const token = jwt.sign(datos, process.env.SECRET);

        res.status(200).json({ token });
    } else {
        res.redirect("/");
    }
}
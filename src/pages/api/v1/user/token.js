import jwt from 'jsonwebtoken';
import geoip from 'geoip-lite'; 
import requestIp from 'request-ip'

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {

        const ip = requestIp.getClientIp(req);
        
        let country = "";

        if (ip === "::1") {
            country = "localhost";
        } else {
            const geo = geoip.lookup(ip);
            country = geo ? geo.country : "";
        }
        
        const datos = {
            status: "OFFLINE",
            iss: "mangaku",
            client_tag: "*",
            id: "",
            country: country
        };
        const token = jwt.sign(datos, process.env.SECRET, { expiresIn: '12h' });

        res.status(200).json({ token });
    } else {
        res.redirect("/");
    }
}
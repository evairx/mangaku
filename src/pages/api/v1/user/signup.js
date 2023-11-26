import Connect from "@/db/connect";
import UserModel from "@/models/User"
import Role from "@/models/Role";
import Suscription from "@/models/Suscription";
import { createRoles , createSuscription} from "@/middleware/generate"

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        await Connect()
        await createRoles()
        await createSuscription()

        const existingUser = await UserModel.findOne({ email: req.body.email });

        if (existingUser) {
            res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        const user = await UserModel.create(req.body);

        let roles = ["user"];
        const foundRoles = await Role.find({ name: { $in: roles } });

        user.roles = foundRoles.map((role) => role.name);

        let suscription = ["default"]
        const foundSuscription = await Suscription.find({ name: { $in: suscription } });

        user.suscription = foundSuscription.map((suscription) => suscription.name);

        await user.encryptPassword(req.body.password);
        
        await user.save();

        res.status(200).json({ message: "El usuario se creó correctamente" });
    } else {
        res.redirect("/");
    }
}
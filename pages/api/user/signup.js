import Connect from "@/db/connect";
import UserModel from "@/src/models/User"
import Role from "@/src/models/Role";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        await Connect()

        const existingUser = await UserModel.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        const user = await UserModel.create(req.body);

        let roles = ["user"];
        const foundRoles = await Role.find({ name: { $in: roles } });

        user.roles = foundRoles.map((role) => role.name);

        await user.encryptPassword(req.body.password);
        
        await user.save();

        res.status(200).json({ message: "El usuario se creó correctamente" });
    } else {
        return res.redirect("/");
    }
}
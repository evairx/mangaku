import { Schema, models, model } from "mongoose";
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

const favoritesSchema = new Schema({
    favorites: {
        type: [String],
        required: false,
    },
},{ _id : false })

const UserSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        ref: "Role",
        type: String,
    }],
    suscription: [{
        ref: "Suscription",
        type: String,
    }],
    avatarId: {
        type: String,
        default: "72b45e6b-6cc8-4593-8a69-926429e2d4f4"
    },
    views: {
        type: Number,
        default: 0,
    },
    favorites: [favoritesSchema],
    ban: {
        type: Boolean,
        default: false,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
    versionKey: false,
});

UserSchema.methods.encryptPassword = async function (password) {
    const hashedPassword = await argon2.hash(password);
    this.password = hashedPassword;
};

UserSchema.methods.validatePassword = async function (password) {
    return await argon2.verify(this.password, password);
};

export default models.User || model('User', UserSchema);
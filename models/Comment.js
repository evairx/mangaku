import { Schema, models, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const commentSchema = new Schema({
    _id : {
        type: String,
        default: uuidv4,
    },
    content: {
        type: String,
        required: true,
    },
    mangaId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    spoilerContent: {
        type: Boolean,
        required: true,
        default: false,
    },
    likes: [
        {
            type: String,
            required: false,
        }
    ],
    reply: [{
        _id : {
            type: String,
            default: uuidv4,
        },
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        spoilerContent: {
            type: Boolean,
            required: true,
            default: false,
        },
        likes: [
            {
                type: String,
                required: false,
            }
        ],
    }],
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});

export default models.Comments || model('Comments', commentSchema);
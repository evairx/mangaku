import {Schema, model} from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const genresSchema = new Schema({
    genres: {
        type: [String],
        required: false,
    },
},{ _id : false })

const MangaSchema = new Schema({
    _id : {
        type: String,
        default: uuidv4,
    },
    title: {
        type: String,
        required: true,
    },
    poster: {
        type: String,
        required: false,
    },
    overview: {
        type: String,
        required: false,
    },
    format: {
        type: String,
        required: true,
    },
    genres: [genresSchema],
    status: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: false,
    versionKey: false,
});

export default model('Manga', MangaSchema);
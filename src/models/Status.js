import { Schema, models, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const statustSchema = new Schema({
    _id : {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String
    },
}, {
    versionKey: false,
});

export default models.Status || model('Status', statustSchema);
import { Schema, models, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const MangaSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: false,
  },
  format: {
    type: String,
    required: true,
  },
  genres: [
    {
        type: String,
        required: false,
    }
    ],
  status: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
  versionKey: false,
});

export default models.Manga || model('Manga', MangaSchema);

import { Schema, models, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const MangaSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    type: String,
    required: true,
  },
  titleJp: {
    type: String,
    required: true,
  },
  titleslug: {
    type: String
  },
  overview: {
    type: String,
    required: false,
  },
  format: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    required: false,
    default:0,
  },
  dislike: {
    type: Number,
    required: false,
    default:0,
  },
  author: {
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

MangaSchema.pre("save", function(next) {
  const isModified = this.isModified("title");
  if (isModified) {
      this.titleslug = slugify(this.title, {remove: /[%\<>#',.!?:]/gi, lower: true });
  };
  next();
});

export default models.Manga || model('Manga', MangaSchema);

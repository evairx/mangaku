import { Schema, models, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const CollectionSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    type: String,
    required: true,
  },
  titleAlt: {
    type: String,
    required: false,
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
  author: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  publication: {
    type: Number,
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
  likes: [
    {
        type: String,
        required: false,
    }
  ],
  dislikes: [
    {
        type: String,
        required: false,
    }
  ],
  nsfw: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
  versionKey: false,
});

CollectionSchema.pre("save", function(next) {
  const isModified = this.isModified("title");
  if (isModified) {
      this.titleslug = slugify(this.title, {remove: /[%\<>#',.!?:]/gi, lower: true });
  };
  next();
});

export default models.Collection || model('Collection', CollectionSchema);

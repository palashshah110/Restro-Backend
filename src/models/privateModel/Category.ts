import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: string; // can be file upload path or custom URL
  categoryId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    categoryId:{
      ref: 'Category',
      type: mongoose.Schema.Types.ObjectId,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default CategorySchema

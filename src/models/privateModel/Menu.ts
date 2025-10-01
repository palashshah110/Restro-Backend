import mongoose, { Schema, Document } from "mongoose";

export interface IMenu extends Document {
  itemImage: string;
  itemName: string;
  menuId: mongoose.Schema.Types.ObjectId;
  categoryId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const MenuSchema = new Schema<IMenu>(
  {
    itemImage: {
      type: String,
      required: [true, "Item image is required"],
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    menuId: {
      ref: 'Menu',
      type: mongoose.Schema.Types.ObjectId,
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

export default MenuSchema
import mongoose, { Schema, Document } from "mongoose";

export interface IMenu extends Document {
  itemImage: string;
  itemName: string;
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export const Menu = mongoose.model<IMenu>("Menu", MenuSchema);

import { Schema, model, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: string[];
  posterUrl: string;
  price: number;
  status: "available" | "unavailable";
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: [{ type: String }],
    posterUrl: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IMovie>("Movie", movieSchema);

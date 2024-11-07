import { Schema, model } from "mongoose";

const movieApplicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    actorsOrDirectors: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    price: {
      type: Number,
      required: true,
    },
    genre: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("MovieApplication", movieApplicationSchema);

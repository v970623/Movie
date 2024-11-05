import { Schema, model, Document } from "mongoose";

export interface IRental extends Document {
  userId: Schema.Types.ObjectId;
  movieId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "new" | "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const rentalSchema = new Schema<IRental>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["new", "pending", "accepted", "rejected"],
      default: "new",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IRental>("Rental", rentalSchema);

import { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
  status: "new" | "pending" | "accepted" | "rejected";
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "pending", "accepted", "rejected"],
      default: "new",
      required: true,
    },
    attachments: [
      {
        type: String,
        required: false,
        validate: {
          validator: function (v: string) {
            return /\.(jpg|jpeg|png|gif)$/i.test(v);
          },
          message: "Attachments must be image files (JPG/JPEG/PNG/GIF)",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IApplication>("Application", applicationSchema);

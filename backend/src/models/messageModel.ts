import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);

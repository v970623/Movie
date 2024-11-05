import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/user";

interface IUserDocument extends IUser, Document {
  password?: string;
  googleId?: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  role: {
    type: String,
    enum: ["staff", "public"],
    default: "public",
    required: true,
  },
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default model<IUserDocument>("User", userSchema);

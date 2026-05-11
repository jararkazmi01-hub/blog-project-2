import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["author", "reader"], default: "reader" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);

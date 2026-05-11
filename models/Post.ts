import { Schema, model, models, Types } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", content: "text", tags: "text" });

export const Post = models.Post || model("Post", PostSchema);

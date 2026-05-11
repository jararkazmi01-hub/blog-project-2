import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";
import { getAuthUser } from "@/middleware/auth";

// GET /api/posts/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const post = await Post.findById(id).populate("author", "name avatar").lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

// PATCH /api/posts/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "author") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.author.toString() !== auth.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, content, excerpt, coverImage, status, tags } = body;
    Object.assign(post, { title, content, excerpt, coverImage, status, tags });
    await post.save();
    return NextResponse.json({ post });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/posts/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "author") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.author.toString() !== auth.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await Promise.all([post.deleteOne(), Comment.deleteMany({ post: id })]);
    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

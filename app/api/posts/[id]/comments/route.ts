import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Comment } from "@/models/Comment";
import { getAuthUser } from "@/middleware/auth";

// GET /api/posts/[id]/comments
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const comments = await Comment.find({ post: id }).populate("author", "name avatar").sort({ createdAt: 1 }).lean();
  return NextResponse.json({ comments });
}

// POST /api/posts/[id]/comments
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
  const comment = await Comment.create({ post: id, author: auth.id, content });
  await comment.populate("author", "name avatar");
  return NextResponse.json({ comment }, { status: 201 });
}

// DELETE /api/posts/[id]/comments?commentId=xxx
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("commentId");
  const comment = await Comment.findById(commentId);
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (comment.author.toString() !== auth.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await comment.deleteOne();
  return NextResponse.json({ message: "Deleted" });
}

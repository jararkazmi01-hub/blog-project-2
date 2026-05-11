import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { getAuthUser } from "@/middleware/auth";

// POST /api/posts/[id]/like — toggle like
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const liked = post.likes.includes(auth.id);
  if (liked) post.likes.pull(auth.id);
  else post.likes.push(auth.id);
  await post.save();

  return NextResponse.json({ likes: post.likes.length, liked: !liked });
}

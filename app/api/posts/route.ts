import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { getAuthUser } from "@/middleware/auth";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
}

// GET /api/posts — list published posts (or all for author)
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const auth = getAuthUser(req);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter: any = auth?.role === "author" ? { author: auth.id } : { status: "published" };

  const [posts, total] = await Promise.all([
    Post.find(filter).populate("author", "name avatar").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments(filter),
  ]);

  return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
}

// POST /api/posts — create post (author only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "author") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, content, excerpt, coverImage, status, tags } = body;
    if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const post = await Post.create({
      title, content, excerpt, coverImage, status: status || "draft",
      tags: tags || [], slug: slugify(title), author: auth.id,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

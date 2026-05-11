import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAuthUser } from "@/middleware/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize filename — strip directory components, allow only safe extension
  const safeName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = safeName.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTS.includes(ext)) return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const finalPath = path.join(uploadDir, filename);

  // Ensure final path stays within uploadDir
  if (!finalPath.startsWith(uploadDir)) return NextResponse.json({ error: "Invalid path" }, { status: 400 });

  await mkdir(uploadDir, { recursive: true });
  await writeFile(finalPath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}

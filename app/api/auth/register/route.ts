import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role === "author" ? "author" : "reader" });

    const token = signToken({ id: user._id, email: user.email, role: user.role });
    const res = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
    res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function requireRole(req: NextRequest, role: string) {
  const user = requireAuth(req);
  if (user.role !== role) throw new Error("Forbidden");
  return user;
}

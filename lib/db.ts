import mongoose from "mongoose";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

// Validate URI is a MongoDB connection string only
if (!/^mongodb(\+srv)?:\/\//.test(MONGODB_URI)) throw new Error("Invalid MONGODB_URI format");

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}

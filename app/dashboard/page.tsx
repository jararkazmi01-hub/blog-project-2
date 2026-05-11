"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .finally(() => setFetching(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading || fetching) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="h-7 w-40 bg-slate-100 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-56 bg-slate-100 rounded animate-pulse mb-10" />
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Welcome back, <span className="text-slate-700 font-medium">{user?.name}</span>
          </p>
        </div>
        {user?.role === "author" && (
          <Link
            href="/main/posts/create"
            className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-700 text-sm font-medium transition-colors shadow-sm"
          >
            + New post
          </Link>
        )}
      </div>

      {user?.role === "author" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total posts", value: posts.length, icon: "📝" },
              { label: "Published", value: published, icon: "🌐" },
              { label: "Drafts", value: drafts, icon: "✏️" },
              { label: "Total likes", value: totalLikes, icon: "❤️" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-200 transition-colors">
                <span className="text-xl mb-2 block">{icon}</span>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Posts */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800">Your posts</h2>
            {posts.length > 0 && (
              <span className="text-xs text-slate-400">{posts.length} total</span>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white">
              <span className="text-4xl mb-4 block">✍️</span>
              <p className="text-slate-500 font-medium">No posts yet</p>
              <p className="text-slate-400 text-sm mt-1 mb-5">Start writing your first post</p>
              <Link
                href="/main/posts/create"
                className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Write your first post
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} showActions onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

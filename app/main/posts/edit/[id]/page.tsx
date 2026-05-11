"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "@/components/PostForm";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((d) => setPost(d.post))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-4">
        <div className="h-7 w-32 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!post) return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center text-slate-400">Post not found.</div>
  );

  return <PostForm initial={post} />;
}

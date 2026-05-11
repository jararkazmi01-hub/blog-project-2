"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts/${id}`).then((r) => r.json()),
      fetch(`/api/posts/${id}/comments`).then((r) => r.json()),
    ]).then(([postData, commentData]) => {
      setPost(postData.post);
      setLikeCount(postData.post?.likes?.length || 0);
      setLiked(user ? postData.post?.likes?.includes(user.id) : false);
      setComments(commentData.comments || []);
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return router.push("/auth/login");
    const res = await fetch(`/api/posts/${id}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount(data.likes);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    const res = await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    const data = await res.json();
    if (data.comment) {
      setComments((prev) => [...prev, data.comment]);
      setComment("");
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    await fetch(`/api/posts/${id}/comments?commentId=${commentId}`, { method: "DELETE" });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-4">
        <div className="h-8 bg-slate-100 rounded-lg animate-pulse w-3/4" />
        <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse mt-6" />
      </div>
    );
  }

  if (!post) return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <p className="text-slate-400">Post not found.</p>
      <Link href="/main" className="text-slate-900 font-medium text-sm mt-2 inline-block hover:underline">← Back to posts</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Back */}
      <Link href="/main" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-900 transition-colors mb-8">
        ← Back
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((t: string) => (
          <span key={t} className="text-xs bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full">{t}</span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-4">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
          {post.author?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">{post.author?.name}</p>
          <p className="text-xs text-slate-400">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            {" · "}{readingTime(post.content)} min read
          </p>
        </div>
      </div>

      {/* Cover */}
      {post.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-10">
          <img src={post.coverImage} alt={post.title} className="w-full object-cover max-h-80" />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Like */}
      <div className="flex items-center gap-4 py-6 border-y border-slate-100 mb-12">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-all ${
            liked ? "bg-red-50 border-red-200 text-red-500" : "border-slate-200 text-slate-500 hover:border-slate-400"
          }`}
        >
          <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </button>
        {!user && <span className="text-xs text-slate-400">Sign in to like</span>}
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h2>

        {user ? (
          <form onSubmit={handleComment} className="flex gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0 mt-1">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text" value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-300"
              />
              <button
                type="submit" disabled={submitting || !comment.trim()}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-slate-50 rounded-xl text-sm text-slate-500 text-center">
            <Link href="/auth/login" className="text-slate-900 font-medium hover:underline">Sign in</Link> to leave a comment
          </div>
        )}

        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                {c.author?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{c.author?.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {user?.id === c.author?._id && (
                    <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-slate-300 hover:text-red-500 transition-colors">
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}

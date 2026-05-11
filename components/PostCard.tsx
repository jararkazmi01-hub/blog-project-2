"use client";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  status: string;
  likes: string[];
  tags: string[];
  author: { name: string };
  createdAt: string;
};

export default function PostCard({ post, showActions, onDelete }: {
  post: Post;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}) {
  return (
    <article className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col">
      {post.coverImage ? (
        <div className="overflow-hidden h-44 shrink-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-slate-100 to-slate-200 shrink-0" />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Tags + status */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {post.status === "draft" && (
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
              Draft
            </span>
          )}
          {post.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-xs bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link href={`/main/posts/${post._id}`} className="flex-1">
          <h2 className="text-[15px] font-semibold text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-2 leading-snug mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          )}
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
              {post.author?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-slate-400">
              {post.author?.name} · {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            {post.likes.length}
          </span>
        </div>

        {showActions && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-slate-50">
            <Link href={`/main/posts/edit/${post._id}`} className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors">
              Edit
            </Link>
            <button onClick={() => onDelete?.(post._id)} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

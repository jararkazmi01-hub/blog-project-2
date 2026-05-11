"use client";
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";

export default function MainPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchPosts = async (p = 1) => {
    setLoading(true);
    const res = await fetch(`/api/posts?page=${p}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setPages(data.pages || 1);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return fetchPosts(1);
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setPages(1);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(page); }, [page]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Explore</h1>
          <p className="text-slate-400 text-sm mt-0.5">Discover stories from our writers</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Search posts..." value={search}
              onChange={(e) => { setSearch(e.target.value); if (!e.target.value) fetchPosts(1); }}
              className="border border-slate-200 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent w-52 placeholder:text-slate-300 bg-white transition-all"
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm hover:bg-slate-700 transition-colors font-medium">
            Search
          </button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-32 text-slate-400">
          <svg className="w-10 h-10 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="font-medium">No posts found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-1.5 mt-12 justify-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            ←
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === page ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}>
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

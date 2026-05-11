"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";

type PostFormProps = {
  initial?: {
    _id?: string;
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    status?: string;
    tags?: string[];
  };
};

export default function PostForm({ initial = {} }: PostFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isEdit = !!initial._id;

  const [form, setForm] = useState({
    title: initial.title || "",
    content: initial.content || "",
    excerpt: initial.excerpt || "",
    coverImage: initial.coverImage || "",
    status: initial.status || "draft",
    tags: initial.tags?.join(", ") || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, coverImage: data.url }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent, status?: string) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      status: status || form.status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const url = isEdit ? `/api/posts/${initial._id}` : "/api/posts";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError((await res.json()).error || "Failed to save");
    }
    setSaving(false);
  };

  if (!user || user.role !== "author") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-slate-400">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{isEdit ? "Edit post" : "New post"}</h1>
        <p className="text-slate-400 text-sm mt-1">{isEdit ? "Update your post" : "Write something great"}</p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
          <input
            type="text" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Your post title..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-300 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Excerpt</label>
          <textarea
            rows={2} value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="A short summary of your post..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-300 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover image</label>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <span className="text-sm border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors text-slate-600">
              {uploading ? "Uploading..." : "Choose image"}
            </span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {form.coverImage && (
            <div className="mt-3 relative w-fit">
              <img src={form.coverImage} alt="cover" className="h-36 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-500 shadow text-xs"
              >✕</button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
          <RichTextEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags</label>
          <input
            type="text" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="tech, writing, tutorial"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-300 transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">Separate tags with commas</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={saving}
            className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-full hover:bg-slate-50 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Save draft"}
          </button>
          <button
            type="button" disabled={saving}
            onClick={(e) => handleSubmit(e as any, "published")}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-700 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "author" ? "/dashboard" : "/main");
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest text-slate-400 uppercase border border-slate-200 rounded-full px-3 py-1 mb-8">
          ✦ A place for ideas
        </span>
        <h1 className="text-6xl sm:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
          Write. Share.
          <br />
          <span className="text-slate-300">Inspire.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
          A minimal, distraction-free platform for writers who care about their craft and readers who love great content.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/auth/register"
            className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-700 transition-colors font-medium text-sm shadow-sm"
          >
            Start writing free
          </Link>
          <Link
            href="/main"
            className="text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm px-4 py-3"
          >
            Browse posts →
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-slate-100" />
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: "✍️",
              title: "Rich editor",
              desc: "Write with a clean, distraction-free editor that supports formatting, images, and more.",
            },
            {
              icon: "💬",
              title: "Engage readers",
              desc: "Readers can like and comment on your posts, building a community around your writing.",
            },
            {
              icon: "📊",
              title: "Track your work",
              desc: "Manage drafts and published posts from a clean dashboard built for authors.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-6 bg-white border border-slate-100 rounded-2xl">
              <span className="text-2xl mb-4 block">{icon}</span>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-slate-900 rounded-3xl px-10 py-14 text-center">
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Ready to share your story?</h2>
          <p className="text-slate-400 mb-8 text-sm">Join writers who are already publishing on Jarar Bella.</p>
          <Link
            href="/auth/register"
            className="bg-white text-slate-900 px-8 py-3 rounded-full hover:bg-slate-100 transition-colors font-medium text-sm inline-block"
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}

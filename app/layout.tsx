import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jarar Bella — A place for ideas",
  description: "A minimal platform for writers who care about their craft.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fafafa]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-100 mt-20">
            <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
              <Link href="/" className="font-semibold text-slate-900 tracking-tight text-sm">Jarar Bella</Link>
              <p className="text-xs text-slate-400">© {new Date().getFullYear()} Jarar Bella. All rights reserved.</p>
              <div className="flex gap-5">
                <Link href="/main" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Explore</Link>
                <Link href="/auth/register" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Write</Link>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        <Link href="/" className="font-bold text-slate-900 tracking-tight text-lg">
          Jarar Bella
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/main"
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isActive("/main") ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Explore
          </Link>

          {user ? (
            <>
              {user.role === "author" && (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isActive("/dashboard") ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive("/auth/login") ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="ml-1 text-sm bg-slate-900 text-white px-4 py-1.5 rounded-full hover:bg-slate-700 transition-colors font-medium"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

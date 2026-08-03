"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, BookOpen, GraduationCap, Phone, Shield } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Intern<span className="text-blue-500">Vision</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${isActive('/') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className={`flex items-center gap-1.5 transition-colors ${isActive('/courses') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4" />
            Courses
          </Link>
          <Link
            href="/apply"
            className={`flex items-center gap-1.5 transition-colors ${isActive('/apply') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
          >
            <GraduationCap className="w-4 h-4" />
            Internship
          </Link>
          <Link
            href="/contact"
            className={`flex items-center gap-1.5 transition-colors ${isActive('/contact') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
          >
            <Phone className="w-4 h-4" />
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Portal
          </Link>
          <Link
            href="/apply"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}

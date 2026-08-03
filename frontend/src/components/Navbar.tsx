"use client";

import Link from"next/link";
import Image from"next/image";
import { usePathname } from"next/navigation";
import { Sparkles, BookOpen, GraduationCap, Phone, Shield } from"lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
 const pathname = usePathname();

 const isActive = (path: string) => pathname === path;

 return (
 <motion.header 
 initial={{ y: -100 }}
 animate={{ y: 0 }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 className="sticky top-0 z-50 glass-card border-b border-ink-800"
 >
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
 <Link href="/"className="flex items-center gap-2 font-bold text-xl tracking-tight">
 <Image src="/logo.jpg" alt="InternVision Logo" width={160} height={40} className="h-8 w-auto object-contain" />
 </Link>

 <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
 <Link
 href="/"
 className={`transition-colors ${isActive('/') ? 'text-brand-400 font-semibold' : 'text-ink-300 hover:text-white'}`}
 >
 Home
 </Link>
 <Link
 href="/courses"
 className={`flex items-center gap-1.5 transition-colors ${isActive('/courses') ? 'text-brand-400 font-semibold' : 'text-ink-300 hover:text-white'}`}
 >
 <BookOpen className="w-4 h-4"/>
 Courses
 </Link>
 <Link
 href="/apply"
 className={`flex items-center gap-1.5 transition-colors ${isActive('/apply') ? 'text-brand-400 font-semibold' : 'text-ink-300 hover:text-white'}`}
 >
 <GraduationCap className="w-4 h-4"/>
 Internship
 </Link>
 <Link
 href="/contact"
 className={`flex items-center gap-1.5 transition-colors ${isActive('/contact') ? 'text-brand-400 font-semibold' : 'text-ink-300 hover:text-white'}`}
 >
 <Phone className="w-4 h-4"/>
 Contact
 </Link>
 </nav>

 <div className="flex items-center gap-3">
 <Link
 href="/admin/login"
 className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-ink-800 hover:bg-ink-700 text-ink-300 border border-ink-700 transition"
 >
 <Shield className="w-3.5 h-3.5"/>
 Admin Portal
 </Link>
 <Link
 href="/apply"
 className="px-4 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition hover:-translate-y-0.5"
 >
 Apply Now
 </Link>
 </div>
 </div>
 </motion.header>
 );
}

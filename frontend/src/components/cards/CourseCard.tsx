"use client";

import Link from"next/link";
import { Signal, Clock, ArrowRight, Award } from"lucide-react";
import { Course } from"@/types";
import { formatINR } from"@/lib/utils";
import { motion } from "framer-motion";

interface CourseCardProps {
 course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
 return (
 <motion.div 
 whileHover={{ y: -4 }}
 className="glass-card p-6 flex flex-col justify-between hover:border-ember-500/50 transition group h-full"
 >
 <div className="space-y-4">
 <div className="flex items-center justify-between text-xs">
 <span className="px-3 py-1 font-medium bg-ember-500/10 text-ember-400 border border-ember-500/20 flex items-center gap-1">
 <Signal className="w-3 h-3"/>
 {course.level}
 </span>
 <span className="text-ink-400 flex items-center gap-1 font-medium">
 <Clock className="w-3.5 h-3.5"/>
 {course.duration}
 </span>
 </div>

 <h3 className="text-xl font-bold text-white group-hover:text-ember-400 transition leading-snug">
 {course.title}
 </h3>

 <p className="text-ink-400 text-xs leading-relaxed line-clamp-3">
 {course.description}
 </p>

 <div className="flex flex-wrap gap-1.5 pt-2">
 {course.technologies.map((tech) => (
 <span key={tech} className="px-2.5 py-0.5 text-[11px] bg-ink-900 text-ink-300 border border-ink-800">
 {tech}
 </span>
 ))}
 </div>
 </div>

 <div className="pt-6 mt-6 border-t border-ink-800/80 flex items-center justify-between">
 <div>
 <div className="flex items-center gap-1.5 text-emerald-400/90 text-[10px] uppercase tracking-wider font-bold mb-1">
 <Award className="w-3 h-3"/> Certificate Included
 </div>
 <div className="text-2xl font-black text-white">{formatINR(course.price_inr)}</div>
 </div>

 <Link
 href={`/courses/${course.slug}`}
 className="px-4 py-2.5 text-xs font-semibold bg-ember-600 hover:bg-ember-500 text-white flex items-center gap-1 transition shadow-ember-600/20"
 >
 View Syllabus
 <ArrowRight className="w-3.5 h-3.5"/>
 </Link>
 </div>
 </motion.div>
 );
}

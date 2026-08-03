"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Filter, Clock, Signal, ArrowRight, Loader2 } from "lucide-react";
import { Course } from "@/types";
import { apiRequest } from "@/lib/api-client";
import { formatINR } from "@/lib/utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, [levelFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let endpoint = "/courses";
      const params = new URLSearchParams();
      if (levelFilter !== "all") params.set("level", levelFilter);
      if (params.toString()) endpoint += `?${params.toString()}`;

      const data = await apiRequest<Course[]>(endpoint);
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Explore Industry <span className="gradient-text">Bootcamps</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Comprehensive, project-driven training programs engineered to make you job-ready.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Level:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition w-full md:w-auto"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* COURSE GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl text-slate-400 space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-slate-500" />
          <p className="font-semibold text-white">No courses match your search criteria.</p>
          <p className="text-xs text-slate-400">Try clearing filters or searching for different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition group">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                    <Signal className="w-3 h-3" />
                    {course.level}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition leading-snug">
                  {course.title}
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {course.technologies.map((tech) => (
                    <span key={tech} className="px-2.5 py-0.5 rounded-md text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Course Fee</div>
                  <div className="text-2xl font-black text-white">{formatINR(course.price_inr)}</div>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 transition shadow-md shadow-blue-600/20"
                >
                  View Syllabus
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

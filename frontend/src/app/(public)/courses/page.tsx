"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Filter, Loader2 } from "lucide-react";
import { Course } from "@/types";
import { apiRequest } from "@/lib/api-client";
import { CourseCard } from "@/components/cards/CourseCard";

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
 <div className="text-center space-y-4 max-w-3xl mx-auto">
 <h1 className="text-4xl font-extrabold text-white tracking-tight">
 Explore Industry <span className="gradient-text">Bootcamps</span>
 </h1>
 <p className="text-ink-400 text-sm sm:text-base leading-relaxed">
 Comprehensive, project-driven training programs engineered to make you job-ready.
 </p>
 </div>

 <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
 <div className="relative w-full md:w-96">
 <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-400" />
 <input
 type="text"
 placeholder="Search courses or technologies..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full bg-ink-900/80 border border-ink-700/80 pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-ember-500 transition"
 />
 </div>

 <div className="flex items-center gap-3 w-full md:w-auto">
 <Filter className="w-4 h-4 text-ink-400" />
 <span className="text-xs text-ink-400 font-medium hidden sm:inline">Level:</span>
 <select
 value={levelFilter}
 onChange={(e) => setLevelFilter(e.target.value)}
 className="bg-ink-900/80 border border-ink-700/80 px-4 py-2.5 text-sm text-ink-200 focus:outline-none focus:border-ember-500 transition w-full md:w-auto"
 >
 <option value="all">All Levels</option>
 <option value="Beginner">Beginner</option>
 <option value="Intermediate">Intermediate</option>
 <option value="Advanced">Advanced</option>
 </select>
 </div>
 </div>

 {loading ? (
 <div className="flex justify-center items-center py-24">
 <Loader2 className="w-8 h-8 text-ember-500 animate-spin" />
 </div>
 ) : filteredCourses.length === 0 ? (
 <div className="glass-card p-12 text-center text-ink-400 space-y-2">
 <BookOpen className="w-8 h-8 mx-auto text-ink-500" />
 <p className="font-semibold text-white">No courses match your search criteria.</p>
 <p className="text-xs text-ink-400">Try clearing filters or searching for different keywords.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {filteredCourses.map((course) => (
 <CourseCard key={course.id} course={course} />
 ))}
 </div>
 )}
 </div>
 );
}

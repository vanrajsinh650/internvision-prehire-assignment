"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Mail, Phone, Building2, BookOpen, Calendar, Code, Clock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

export default function InternshipApplyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    year_of_study: "3rd Year",
    skills: "",
    duration: "3 Months",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await apiRequest("/applications", {
        method: "POST",
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          degree: formData.degree,
          year_of_study: formData.year_of_study,
          skills: skillsArray.length > 0 ? skillsArray : ["General Development"],
          duration: formData.duration,
        }),
      });

      router.push(`/success?type=application&name=${encodeURIComponent(formData.full_name)}&duration=${encodeURIComponent(formData.duration)}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit application. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* HEADER */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          Pre-Hire Internship Program 2026
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Apply For <span className="gradient-text">Internship</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Join our hands-on engineering track. Gain experience building production applications with 1:1 senior developer guidance.
        </p>
      </div>

      {/* APPLICATION FORM */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PERSONAL INFO */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
              1. Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Aarav Sharma"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="aarav@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* ACADEMIC DETAILS */}
          <div className="space-y-4 pt-6 mt-6 border-t border-slate-800/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
              2. Academic Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" /> College / University Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Indian Institute of Technology, Bombay"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Degree & Major *
                </label>
                <input
                  type="text"
                  required
                  placeholder="B.Tech CSE"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Year of Study *
                </label>
                <select
                  value={formData.year_of_study}
                  onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduated">Graduated / Recent Passout</option>
                </select>
              </div>
            </div>
          </div>

          {/* SKILLS & DURATION */}
          <div className="space-y-4 pt-6 mt-6 border-t border-slate-800/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
              3. Program Preferences & Technical Skills
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-400" /> Technical Skills (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Next.js, Python, FastAPI, Docker, PostgreSQL"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* DURATION RADIO CARDS */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Preferred Internship Duration *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {["1 Month", "3 Months", "6 Months"].map((dur) => (
                    <div
                      key={dur}
                      onClick={() => setFormData({ ...formData, duration: dur })}
                      className={`cursor-pointer p-4 rounded-2xl border text-center transition ${
                        formData.duration === dur
                          ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold text-base text-white">{dur}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {dur === "1 Month" && "Foundation Bootcamp & Mentorship"}
                        {dur === "3 Months" && "Standard Industrial Internship"}
                        {dur === "6 Months" && "Advanced Product Co-Op Program"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting Application...
                </>
              ) : (
                <>
                  Submit Application <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

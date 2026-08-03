import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, Cpu, Rocket, ShieldCheck, Users, Trophy, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5" />
            Launch Your Tech Career in 2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Transform Your Passion Into A <span className="gradient-text">Production Tech Career</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Gain industry-ready skills with hands-on bootcamps, real client projects, and guaranteed internship opportunities tailored for ambitious software engineering students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex flex-col items-center">
              <Link
                href="/apply"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 ring-1 ring-blue-500/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                Apply For Internship
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> No credit card required
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700/50 flex items-center justify-center transition-all"
              >
                Explore Courses
              </Link>
              <p className="text-xs text-slate-500 mt-3 opacity-0 hidden sm:block">spacer</p>
            </div>
          </div>

          {/* STATS STRIP (TRUST BANNER) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 pb-8 mt-16 max-w-5xl mx-auto bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-sm shadow-2xl">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">5,000+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400">Students Trained</div>
            </div>
            <div className="space-y-1 border-l border-slate-800/50 pl-4 sm:pl-0 sm:border-l-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">94%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400">Placement Rate</div>
            </div>
            <div className="space-y-1 pt-4 border-t border-slate-800/50 sm:pt-0 sm:border-t-0 md:border-l md:border-slate-800/50 md:pl-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">4.9/5</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400">Student Satisfaction</div>
            </div>
            <div className="space-y-1 pt-4 border-t border-slate-800/50 border-l border-slate-800/50 pl-4 sm:pt-0 sm:border-t-0 md:border-l md:border-slate-800/50 md:pl-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">100+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400">Hiring Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-white">Why Choose InternVision Tech?</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            We bridge the gap between academic theory and real-world engineering standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-blue-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Production-Grade Stack</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Learn Next.js 15, FastAPI, Docker, and PostgreSQL with real GitHub workflows and deployment pipelines.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">1:1 Mentorship</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get direct code reviews, resume polishing, and mock technical interview sessions from senior engineers.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Guaranteed Internship</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Choose from 1, 3, or 6-month hands-on internships with real client projects and verified certificates.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Bootcamps</h2>
            <p className="text-slate-400 text-sm mt-1">Accelerate your skills with our top-rated programs.</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Intermediate
                </span>
                <span className="text-xs text-slate-400 font-medium">8 Weeks</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Full Stack Web Development Bootcamp</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Master Next.js 15, React 19, FastAPI, PostgreSQL, and modern Tailwind CSS. Build scalable web applications.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Next.js", "React", "FastAPI", "PostgreSQL"].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-2xl font-extrabold text-white">₹4,999</div>
              <Link href="/courses/full-stack-web-development" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition">
                Enroll Now
              </Link>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Advanced
                </span>
                <span className="text-xs text-slate-400 font-medium">12 Weeks</span>
              </div>
              <h3 className="text-2xl font-bold text-white">AI & Machine Learning Engineering</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Build cutting-edge AI models, fine-tune LLMs, integrate PyTorch and Vector DBs into production systems.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Python", "PyTorch", "OpenAI API", "LangChain"].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-2xl font-extrabold text-white">₹6,999</div>
              <Link href="/courses/ai-machine-learning-engineering" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition">
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to Step Into Tech?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Apply today for our upcoming batch. Flexible 1, 3, or 6-month internship durations tailored to your academic schedule.
          </p>
          <div className="pt-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition"
            >
              Start Internship Application <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

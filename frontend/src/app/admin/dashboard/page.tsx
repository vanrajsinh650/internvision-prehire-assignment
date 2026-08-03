"use client";

import { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import {
 Shield, LogOut, Users, CreditCard, BookOpen, Download, Search, Filter,
 ChevronLeft, ChevronRight, Loader2, DollarSign, CheckCircle2, Clock
} from"lucide-react";
import { DashboardStats, PaginatedResult, InternshipApplicationResponse, PaymentItem } from"@/types";
import { apiRequest } from"@/lib/api-client";
import { formatINR } from"@/lib/utils";
import { FadeIn } from "@/components/animations/FadeIn";

export default function AdminDashboardPage() {
 const router = useRouter();
 const [activeTab, setActiveTab] = useState<"overview"|"applications"|"payments"|"registrations">("overview");

 const [stats, setStats] = useState<DashboardStats | null>(null);
 const [loadingStats, setLoadingStats] = useState(true);

 // Applications Table State
 const [appsData, setAppsData] = useState<PaginatedResult<InternshipApplicationResponse>>({ total: 0, page: 1, limit: 10, total_pages: 1, items: [] });
 const [appsSearch, setAppsSearch] = useState("");
 const [appsDuration, setAppsDuration] = useState("all");
 const [appsPage, setAppsPage] = useState(1);
 const [loadingApps, setLoadingApps] = useState(false);

 // Payments Table State
 const [paymentsData, setPaymentsData] = useState<PaginatedResult<PaymentItem>>({ total: 0, page: 1, limit: 10, total_pages: 1, items: [] });
 const [pmtSearch, setPmtSearch] = useState("");
 const [pmtStatus, setPmtStatus] = useState("all");
 const [pmtPage, setPmtPage] = useState(1);
 const [loadingPayments, setLoadingPayments] = useState(false);

 useEffect(() => {
 // Check authentication
 const token = localStorage.getItem("token");
 if (!token) {
 router.push("/admin/login");
 return;
 }
 fetchStats();
 }, []);

 useEffect(() => {
 if (activeTab ==="applications"|| activeTab ==="overview") {
 fetchApplications();
 }
 if (activeTab ==="payments"|| activeTab ==="overview") {
 fetchPayments();
 }
 }, [activeTab, appsSearch, appsDuration, appsPage, pmtSearch, pmtStatus, pmtPage]);

 const fetchStats = async () => {
 try {
 const data = await apiRequest<DashboardStats>("/admin/stats");
 setStats(data);
 } catch (err) {
 localStorage.removeItem("token");
 router.push("/admin/login");
 } finally {
 setLoadingStats(false);
 }
 };

 const fetchApplications = async () => {
 setLoadingApps(true);
 try {
 const params = new URLSearchParams({
 page: appsPage.toString(),
 limit:"10",
 });
 if (appsSearch) params.set("q", appsSearch);
 if (appsDuration !=="all") params.set("duration", appsDuration);

 const data = await apiRequest<PaginatedResult<InternshipApplicationResponse>>(`/admin/applications?${params.toString()}`);
 setAppsData(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoadingApps(false);
 }
 };

 const fetchPayments = async () => {
 setLoadingPayments(true);
 try {
 const params = new URLSearchParams({
 page: pmtPage.toString(),
 limit:"10",
 });
 if (pmtSearch) params.set("q", pmtSearch);
 if (pmtStatus !=="all") params.set("status", pmtStatus);

 const data = await apiRequest<PaginatedResult<PaymentItem>>(`/admin/payments?${params.toString()}`);
 setPaymentsData(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoadingPayments(false);
 }
 };

 const handleExportExcel = (type: 'applications' | 'payments') => {
 const token = localStorage.getItem("token");
 const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
 let exportUrl = `${baseUrl}/admin/export/${type}?token=${token}`;
 if (type === 'applications' && appsDuration !=="all") {
 exportUrl += `&duration=${encodeURIComponent(appsDuration)}`;
 }
 if (type === 'payments' && pmtStatus !=="all") {
 exportUrl += `&status=${encodeURIComponent(pmtStatus)}`;
 }

 // Trigger binary stream download directly in browser
 fetch(exportUrl, {
 headers: {
 Authorization: `Bearer ${token}`
 }
 })
 .then(res => res.blob())
 .then(blob => {
 const url = window.URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `internvision_${type}.xlsx`;
 document.body.appendChild(a);
 a.click();
 a.remove();
 })
 .catch(err => console.error("Export download failed", err));
 };

 const handleLogout = () => {
 localStorage.removeItem("token");
 router.push("/admin/login");
 };

  return (
    <div className="min-h-screen relative overflow-hidden bg-ink-950 pb-20">
      {/* Background Blobs for Glass Effect */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 z-10">
        {/* TOP BAR */}
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 sm:p-8 border border-ink-800 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/5 to-transparent rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/5 text-brand-400 flex items-center justify-center border border-brand-500/30 shadow-[0_0_20px_rgba(246,161,43,0.15)] backdrop-blur-sm">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-ink-400 font-medium mt-1">InternVision Tech Management Portal</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-3 text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white flex items-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] relative z-10"
            >
              <LogOut className="w-4 h-4" /> Secure Logout
            </button>
          </div>
        </FadeIn>

        {/* STATS CARDS */}
        <FadeIn delay={0.2} direction="up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue */}
            <div className="glass-card p-7 rounded-3xl border border-ink-800 hover:border-emerald-500/40 transition-all duration-300 group shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-[20px] group-hover:bg-emerald-500/20 transition-colors" />
              <div className="flex items-center justify-between text-ink-400 mb-6 relative z-10">
                <span className="text-sm font-bold tracking-wide uppercase">Total Revenue</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-4xl font-black text-white tracking-tighter relative z-10">
                {stats ? formatINR(stats.total_revenue_inr) : "..."}
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-2 relative z-10 tracking-wide uppercase">Captured Payments</div>
            </div>

            {/* Applicants */}
            <div className="glass-card p-7 rounded-3xl border border-ink-800 hover:border-brand-500/40 transition-all duration-300 group shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-500/10 rounded-full blur-[20px] group-hover:bg-brand-500/20 transition-colors" />
              <div className="flex items-center justify-between text-ink-400 mb-6 relative z-10">
                <span className="text-sm font-bold tracking-wide uppercase">Total Applicants</span>
                <div className="p-2.5 rounded-xl bg-brand-500/10 group-hover:bg-brand-500/20 transition-colors border border-brand-500/20">
                  <Users className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <div className="text-4xl font-black text-white tracking-tighter relative z-10">
                {stats ? stats.total_applications : "..."}
              </div>
              <div className="text-xs text-brand-400 font-semibold mt-2 relative z-10 tracking-wide uppercase">Intern Applications</div>
            </div>

            {/* Enrolled */}
            <div className="glass-card p-7 rounded-3xl border border-ink-800 hover:border-purple-500/40 transition-all duration-300 group shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-[20px] group-hover:bg-purple-500/20 transition-colors" />
              <div className="flex items-center justify-between text-ink-400 mb-6 relative z-10">
                <span className="text-sm font-bold tracking-wide uppercase">Total Enrolled</span>
                <div className="p-2.5 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="text-4xl font-black text-white tracking-tighter relative z-10">
                {stats ? stats.total_registrations : "..."}
              </div>
              <div className="text-xs text-purple-400 font-semibold mt-2 relative z-10 tracking-wide uppercase">Course Registrations</div>
            </div>

            {/* Success */}
            <div className="glass-card p-7 rounded-3xl border border-ink-800 hover:border-blue-500/40 transition-all duration-300 group shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-[20px] group-hover:bg-blue-500/20 transition-colors" />
              <div className="flex items-center justify-between text-ink-400 mb-6 relative z-10">
                <span className="text-sm font-bold tracking-wide uppercase">Tx Success</span>
                <div className="p-2.5 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="text-4xl font-black text-white tracking-tighter relative z-10">
                {stats ? stats.successful_payments : "..."}
              </div>
              <div className="text-xs text-blue-400 font-semibold mt-2 relative z-10 tracking-wide uppercase">Completed Transactions</div>
            </div>
          </div>
        </FadeIn>

        {/* NAVIGATION TABS */}
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-ink-900/80 border border-ink-800 rounded-2xl backdrop-blur-md shadow-lg">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "overview" ? "bg-brand-500 text-ink-950 shadow-[0_0_15px_rgba(246,161,43,0.3)]" : "text-ink-400 hover:text-white hover:bg-ink-800/80"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                activeTab === "applications" ? "bg-brand-500 text-ink-950 shadow-[0_0_15px_rgba(246,161,43,0.3)]" : "text-ink-400 hover:text-white hover:bg-ink-800/80"
              }`}
            >
              Applicants 
              <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === "applications" ? "bg-ink-950/20" : "bg-ink-800 text-ink-300"}`}>
                {stats?.total_applications || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                activeTab === "payments" ? "bg-brand-500 text-ink-950 shadow-[0_0_15px_rgba(246,161,43,0.3)]" : "text-ink-400 hover:text-white hover:bg-ink-800/80"
              }`}
            >
              Payments 
              <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === "payments" ? "bg-ink-950/20" : "bg-ink-800 text-ink-300"}`}>
                {stats?.total_payments || 0}
              </span>
            </button>
          </div>
        </div>

        {/* APPLICATIONS TAB */}
        {(activeTab === "applications" || activeTab === "overview") && (
          <FadeIn delay={0.3} direction="up">
            <div className="glass-card rounded-3xl border border-ink-800 overflow-hidden shadow-2xl">
              {/* Header & Controls */}
              <div className="p-6 sm:p-8 border-b border-ink-800/60 bg-ink-900/30 flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative">
                <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-brand-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                    <Users className="w-6 h-6 text-brand-400" /> Internship Applications
                  </h3>
                  <p className="text-sm text-ink-400 mt-1.5 font-medium">Review and export student application data</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto relative z-10">
                  <div className="relative flex-grow sm:flex-grow-0 sm:w-80">
                    <Search className="w-4 h-4 absolute left-4 top-3.5 text-ink-400" />
                    <input
                      type="text"
                      placeholder="Search name, email, college..."
                      value={appsSearch}
                      onChange={(e) => { setAppsSearch(e.target.value); setAppsPage(1); }}
                      className="w-full bg-ink-950/80 border border-ink-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
                    />
                  </div>

                  <select
                    value={appsDuration}
                    onChange={(e) => { setAppsDuration(e.target.value); setAppsPage(1); }}
                    className="bg-ink-950/80 border border-ink-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer appearance-none shadow-inner min-w-[160px]"
                  >
                    <option value="all">All Durations</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                  </select>

                  <button
                    onClick={() => handleExportExcel("applications")}
                    className="px-6 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                  >
                    <Download className="w-4 h-4" /> Export .xlsx
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-ink-300">
                  <thead className="bg-ink-950/50 text-ink-400 font-bold uppercase tracking-widest text-[10px] border-b border-ink-800">
                    <tr>
                      <th className="px-8 py-5">Applicant</th>
                      <th className="px-8 py-5">College & Degree</th>
                      <th className="px-8 py-5">Year</th>
                      <th className="px-8 py-5">Skills</th>
                      <th className="px-8 py-5">Duration</th>
                      <th className="px-8 py-5">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-800/50">
                    {loadingApps ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16">
                          <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-500 drop-shadow-[0_0_15px_rgba(246,161,43,0.5)]" />
                        </td>
                      </tr>
                    ) : appsData.items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-ink-500 font-medium">
                          No internship applications found matching filters.
                        </td>
                      </tr>
                    ) : (
                      appsData.items.map((app) => (
                        <tr key={app.id} className="hover:bg-ink-800/40 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="font-bold text-white group-hover:text-brand-300 transition-colors text-base">{app.full_name}</div>
                            <div className="text-xs text-ink-400 mt-1 font-medium">{app.email}</div>
                            <div className="text-[11px] text-ink-500 mt-0.5">{app.phone}</div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="font-semibold text-ink-200">{app.college}</div>
                            <div className="text-xs text-ink-400 mt-1">{app.degree}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-300 text-xs font-bold shadow-inner">
                              {app.year_of_study}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-wrap gap-2 max-w-[240px]">
                              {app.skills.map((skill) => (
                                <span key={skill} className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)] tracking-wide">
                              {app.duration}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-xs text-ink-400 font-semibold tracking-wide">
                            {new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between px-8 py-5 bg-ink-900/50 border-t border-ink-800/60">
                <div className="text-sm font-semibold text-ink-400">
                  Showing <span className="text-white">{appsData.page}</span> of <span className="text-white">{appsData.total_pages}</span> <span className="text-ink-500">({appsData.total} total)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={appsPage <= 1}
                    onClick={() => setAppsPage((p) => p - 1)}
                    className="p-2.5 bg-ink-800 border border-ink-700 rounded-xl disabled:opacity-30 hover:bg-ink-700 hover:border-ink-600 transition-all text-white shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={appsPage >= appsData.total_pages}
                    onClick={() => setAppsPage((p) => p + 1)}
                    className="p-2.5 bg-ink-800 border border-ink-700 rounded-xl disabled:opacity-30 hover:bg-ink-700 hover:border-ink-600 transition-all text-white shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* PAYMENTS TAB */}
        {(activeTab === "payments" || activeTab === "overview") && (
          <FadeIn delay={0.4} direction="up">
            <div className="glass-card rounded-3xl border border-ink-800 overflow-hidden shadow-2xl">
              {/* Header & Controls */}
              <div className="p-6 sm:p-8 border-b border-ink-800/60 bg-ink-900/30 flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative">
                <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                    <CreditCard className="w-6 h-6 text-emerald-400" /> Payments History
                  </h3>
                  <p className="text-sm text-ink-400 mt-1.5 font-medium">Transaction logs, status monitoring, and financial exports</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto relative z-10">
                  <div className="relative flex-grow sm:flex-grow-0 sm:w-80">
                    <Search className="w-4 h-4 absolute left-4 top-3.5 text-ink-400" />
                    <input
                      type="text"
                      placeholder="Search order ID, payment ID..."
                      value={pmtSearch}
                      onChange={(e) => { setPmtSearch(e.target.value); setPmtPage(1); }}
                      className="w-full bg-ink-950/80 border border-ink-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                    />
                  </div>

                  <select
                    value={pmtStatus}
                    onChange={(e) => { setPmtStatus(e.target.value); setPmtPage(1); }}
                    className="bg-ink-950/80 border border-ink-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer appearance-none shadow-inner min-w-[160px]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="captured">Captured (Success)</option>
                    <option value="created">Created (Pending)</option>
                    <option value="failed">Failed</option>
                  </select>

                  <button
                    onClick={() => handleExportExcel("payments")}
                    className="px-6 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                  >
                    <Download className="w-4 h-4" /> Export .xlsx
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-ink-300">
                  <thead className="bg-ink-950/50 text-ink-400 font-bold uppercase tracking-widest text-[10px] border-b border-ink-800">
                    <tr>
                      <th className="px-8 py-5">Order ID</th>
                      <th className="px-8 py-5">Payment ID</th>
                      <th className="px-8 py-5">Student Email</th>
                      <th className="px-8 py-5">Amount (INR)</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-800/50">
                    {loadingPayments ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16">
                          <Loader2 className="w-10 h-10 animate-spin mx-auto text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </td>
                      </tr>
                    ) : paymentsData.items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-ink-500 font-medium">
                          No payment transactions recorded.
                        </td>
                      </tr>
                    ) : (
                      paymentsData.items.map((pmt) => (
                        <tr key={pmt.id} className="hover:bg-ink-800/40 transition-colors group">
                          <td className="px-8 py-5 font-mono text-xs text-ink-300 tracking-wider bg-ink-900/30">{pmt.order_id}</td>
                          <td className="px-8 py-5 font-mono text-xs text-ink-500 tracking-wider">{pmt.payment_id || "N/A"}</td>
                          <td className="px-8 py-5 text-white font-semibold group-hover:text-emerald-300 transition-colors">{pmt.student_email}</td>
                          <td className="px-8 py-5 font-black text-white text-lg tracking-tighter">{formatINR(pmt.amount_inr)}</td>
                          <td className="px-8 py-5">
                            <span
                              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm ${
                                pmt.status === "captured"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                  : pmt.status === "failed"
                                  ? "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                              }`}
                            >
                              {pmt.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-xs text-ink-400 font-semibold tracking-wide">
                            {new Date(pmt.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between px-8 py-5 bg-ink-900/50 border-t border-ink-800/60">
                <div className="text-sm font-semibold text-ink-400">
                  Showing <span className="text-white">{paymentsData.page}</span> of <span className="text-white">{paymentsData.total_pages}</span> <span className="text-ink-500">({paymentsData.total} total)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={pmtPage <= 1}
                    onClick={() => setPmtPage((p) => p - 1)}
                    className="p-2.5 bg-ink-800 border border-ink-700 rounded-xl disabled:opacity-30 hover:bg-ink-700 hover:border-ink-600 transition-all text-white shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={pmtPage >= paymentsData.total_pages}
                    onClick={() => setPmtPage((p) => p + 1)}
                    className="p-2.5 bg-ink-800 border border-ink-700 rounded-xl disabled:opacity-30 hover:bg-ink-700 hover:border-ink-600 transition-all text-white shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

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
 const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ||"http://localhost:8000/api/v1";
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
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
 {/* TOP BAR */}
 <FadeIn delay={0.1} direction="up">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 border border-ink-800">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-ember-600/20 text-ember-400 flex items-center justify-center border border-ember-500/30">
 <Shield className="w-5 h-5"/>
 </div>
 <div>
 <h1 className="text-xl font-extrabold text-white">Admin Dashboard</h1>
 <p className="text-xs text-ink-400">InternVision Tech Pre-Hire Platform Management</p>
 </div>
 </div>

 <button
 onClick={handleLogout}
 className="px-4 py-2 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 flex items-center gap-1.5 transition"
 >
 <LogOut className="w-3.5 h-3.5"/> Logout
 </button>
 </div>
 </FadeIn>

 {/* STATS CARDS */}
 <FadeIn delay={0.2} direction="up">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 <div className="glass-card p-6 border border-ink-800 space-y-2">
 <div className="flex items-center justify-between text-ink-400">
 <span className="text-xs font-medium">Total Revenue</span>
 <DollarSign className="w-4 h-4 text-emerald-400"/>
 </div>
 <div className="text-2xl font-black text-white">
 {stats ? formatINR(stats.total_revenue_inr) :"..."}
 </div>
 <div className="text-[11px] text-emerald-400 font-medium">Captured Razorpay Payments</div>
 </div>

 <div className="glass-card p-6 border border-ink-800 space-y-2">
 <div className="flex items-center justify-between text-ink-400">
 <span className="text-xs font-medium">Total Applicants</span>
 <Users className="w-4 h-4 text-ember-400"/>
 </div>
 <div className="text-2xl font-black text-white">
 {stats ? stats.total_applications :"..."}
 </div>
 <div className="text-[11px] text-ember-400 font-medium">Internship Applications</div>
 </div>

 <div className="glass-card p-6 border border-ink-800 space-y-2">
 <div className="flex items-center justify-between text-ink-400">
 <span className="text-xs font-medium">Total Enrolled</span>
 <BookOpen className="w-4 h-4 text-purple-400"/>
 </div>
 <div className="text-2xl font-black text-white">
 {stats ? stats.total_registrations :"..."}
 </div>
 <div className="text-[11px] text-purple-400 font-medium">Course Registrations</div>
 </div>

 <div className="glass-card p-6 border border-ink-800 space-y-2">
 <div className="flex items-center justify-between text-ink-400">
 <span className="text-xs font-medium">Successful Payments</span>
 <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
 </div>
 <div className="text-2xl font-black text-white">
 {stats ? stats.successful_payments :"..."}
 </div>
 <div className="text-[11px] text-ink-400 font-medium">Completed Transactions</div>
 </div>
 </div>
 </FadeIn>

 {/* NAVIGATION TABS */}
 <div className="flex items-center gap-2 border-b border-ink-800 pb-2">
 <button
 onClick={() => setActiveTab("overview")}
 className={`px-4 py-2 text-xs font-semibold transition ${
 activeTab ==="overview"?"bg-ember-600 text-white":"text-ink-400 hover:text-white hover:bg-ink-900"
 }`}
 >
 Overview
 </button>
 <button
 onClick={() => setActiveTab("applications")}
 className={`px-4 py-2 text-xs font-semibold transition ${
 activeTab ==="applications"?"bg-ember-600 text-white":"text-ink-400 hover:text-white hover:bg-ink-900"
 }`}
 >
 Internship Applicants ({stats?.total_applications || 0})
 </button>
 <button
 onClick={() => setActiveTab("payments")}
 className={`px-4 py-2 text-xs font-semibold transition ${
 activeTab ==="payments"?"bg-ember-600 text-white":"text-ink-400 hover:text-white hover:bg-ink-900"
 }`}
 >
 Payments History ({stats?.total_payments || 0})
 </button>
 </div>

 {/* APPLICATIONS TAB */}
 {(activeTab ==="applications"|| activeTab ==="overview") && (
 <FadeIn delay={0.3} direction="up">
 <div className="glass-card p-6 border border-ink-800 space-y-6">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
 <div>
 <h3 className="text-lg font-bold text-white">Internship Applications</h3>
 <p className="text-xs text-ink-400">Manage student applications and duration preferences</p>
 </div>

 <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
 <div className="relative w-full sm:w-64">
 <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-400"/>
 <input
 type="text"
 placeholder="Search name, email, college..."
 value={appsSearch}
 onChange={(e) => { setAppsSearch(e.target.value); setAppsPage(1); }}
 className="w-full bg-ink-900 border border-ink-700/80 pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-ember-500"
 />
 </div>

 <select
 value={appsDuration}
 onChange={(e) => { setAppsDuration(e.target.value); setAppsPage(1); }}
 className="bg-ink-900 border border-ink-700/80 px-3 py-1.5 text-xs text-ink-200 focus:outline-none"
 >
 <option value="all">All Durations</option>
 <option value="1 Month">1 Month</option>
 <option value="3 Months">3 Months</option>
 <option value="6 Months">6 Months</option>
 </select>

 <button
 onClick={() => handleExportExcel("applications")}
 className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition shadow-emerald-600/20"
 >
 <Download className="w-3.5 h-3.5"/> Export .xlsx
 </button>
 </div>
 </div>

 {/* TABLE */}
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs text-ink-300">
 <thead className="bg-ink-900/60 text-ink-500 font-bold uppercase tracking-wider text-[10px] border-b border-ink-800">
 <tr>
 <th className="px-3 py-2">Applicant</th>
 <th className="px-3 py-2">College & Degree</th>
 <th className="px-3 py-2">Year</th>
 <th className="px-3 py-2">Skills</th>
 <th className="px-3 py-2">Duration</th>
 <th className="px-3 py-2">Applied Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-ink-800/80">
 {loadingApps ? (
 <tr>
 <td colSpan={6} className="text-center py-8">
 <Loader2 className="w-6 h-6 animate-spin mx-auto text-ember-500"/>
 </td>
 </tr>
 ) : appsData.items.length === 0 ? (
 <tr>
 <td colSpan={6} className="text-center py-8 text-ink-500">
 No internship applications found matching filters.
 </td>
 </tr>
 ) : (
 appsData.items.map((app) => (
 <tr key={app.id} className="hover:bg-ink-900/40 transition">
 <td className="px-3 py-2">
 <div className="font-bold text-white">{app.full_name}</div>
 <div className="text-[11px] text-ink-400">{app.email}</div>
 <div className="text-[10px] text-ink-500">{app.phone}</div>
 </td>
 <td className="px-3 py-2">
 <div className="font-medium text-ink-200">{app.college}</div>
 <div className="text-[11px] text-ink-400">{app.degree}</div>
 </td>
 <td className="px-3 py-2">
 <span className="px-2 py-0.5 rounded bg-ink-800 text-ink-300">
 {app.year_of_study}
 </span>
 </td>
 <td className="px-3 py-2">
 <div className="flex flex-wrap gap-1 max-w-xs">
 {app.skills.map((skill) => (
 <span key={skill} className="px-2 py-0.5 rounded text-[10px] bg-ember-500/10 text-ember-300 border border-ember-500/20">
 {skill}
 </span>
 ))}
 </div>
 </td>
 <td className="px-3 py-2">
 <span className="px-2.5 py-1 text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
 {app.duration}
 </span>
 </td>
 <td className="px-3 py-2 text-[11px] text-ink-400">
 {new Date(app.created_at).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {/* PAGINATION */}
 <div className="flex items-center justify-between text-xs text-ink-400 pt-2">
 <div>Showing page {appsData.page} of {appsData.total_pages} ({appsData.total} total)</div>
 <div className="flex items-center gap-2">
 <button
 disabled={appsPage <= 1}
 onClick={() => setAppsPage((p) => p - 1)}
 className="p-1.5 bg-ink-900 border border-ink-800 disabled:opacity-40 hover:bg-ink-800"
 >
 <ChevronLeft className="w-4 h-4"/>
 </button>
 <button
 disabled={appsPage >= appsData.total_pages}
 onClick={() => setAppsPage((p) => p + 1)}
 className="p-1.5 bg-ink-900 border border-ink-800 disabled:opacity-40 hover:bg-ink-800"
 >
 <ChevronRight className="w-4 h-4"/>
 </button>
 </div>
 </div>
 </div>
 </FadeIn>
 )}

 {/* PAYMENTS TAB */}
 {(activeTab ==="payments"|| activeTab ==="overview") && (
 <FadeIn delay={0.4} direction="up">
 <div className="glass-card p-6 border border-ink-800 space-y-6">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
 <div>
 <h3 className="text-lg font-bold text-white">Razorpay Payments History</h3>
 <p className="text-xs text-ink-400">Transaction logs, payment status, and OpenPyXL exports</p>
 </div>

 <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
 <div className="relative w-full sm:w-64">
 <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-400"/>
 <input
 type="text"
 placeholder="Search order ID, payment ID..."
 value={pmtSearch}
 onChange={(e) => { setPmtSearch(e.target.value); setPmtPage(1); }}
 className="w-full bg-ink-900 border border-ink-700/80 pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-ember-500"
 />
 </div>

 <select
 value={pmtStatus}
 onChange={(e) => { setPmtStatus(e.target.value); setPmtPage(1); }}
 className="bg-ink-900 border border-ink-700/80 px-3 py-1.5 text-xs text-ink-200 focus:outline-none"
 >
 <option value="all">All Statuses</option>
 <option value="captured">Captured (Success)</option>
 <option value="created">Created (Pending)</option>
 <option value="failed">Failed</option>
 </select>

 <button
 onClick={() => handleExportExcel("payments")}
 className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition shadow-emerald-600/20"
 >
 <Download className="w-3.5 h-3.5"/> Export .xlsx
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs text-ink-300">
 <thead className="bg-ink-900/60 text-ink-500 font-bold uppercase tracking-wider text-[10px] border-b border-ink-800">
 <tr>
 <th className="px-3 py-2">Order ID</th>
 <th className="px-3 py-2">Payment ID</th>
 <th className="px-3 py-2">Student Email</th>
 <th className="px-3 py-2">Amount (INR)</th>
 <th className="px-3 py-2">Status</th>
 <th className="px-3 py-2">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-ink-800/80">
 {loadingPayments ? (
 <tr>
 <td colSpan={6} className="text-center py-8">
 <Loader2 className="w-6 h-6 animate-spin mx-auto text-ember-500"/>
 </td>
 </tr>
 ) : paymentsData.items.length === 0 ? (
 <tr>
 <td colSpan={6} className="text-center py-8 text-ink-500">
 No payment transactions recorded.
 </td>
 </tr>
 ) : (
 paymentsData.items.map((pmt) => (
 <tr key={pmt.id} className="hover:bg-ink-900/40 transition">
 <td className="px-3 py-2 font-mono text-ink-200">{pmt.order_id}</td>
 <td className="px-3 py-2 font-mono text-ink-400">{pmt.payment_id ||"N/A"}</td>
 <td className="px-3 py-2 text-white font-medium">{pmt.student_email}</td>
 <td className="px-3 py-2 font-bold text-white">{formatINR(pmt.amount_inr)}</td>
 <td className="px-3 py-2">
 <span
 className={`px-2.5 py-0.5 text-[10px] font-bold uppercase ${
 pmt.status ==="captured"
 ?"bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
 : pmt.status ==="failed"
 ?"bg-red-500/10 text-red-400 border border-red-500/20"
 :"bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
 }`}
 >
 {pmt.status}
 </span>
 </td>
 <td className="px-3 py-2 text-[11px] text-ink-400">
 {new Date(pmt.created_at).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 <div className="flex items-center justify-between text-xs text-ink-400 pt-2">
 <div>Showing page {paymentsData.page} of {paymentsData.total_pages} ({paymentsData.total} total)</div>
 <div className="flex items-center gap-2">
 <button
 disabled={pmtPage <= 1}
 onClick={() => setPmtPage((p) => p - 1)}
 className="p-1.5 bg-ink-900 border border-ink-800 disabled:opacity-40 hover:bg-ink-800"
 >
 <ChevronLeft className="w-4 h-4"/>
 </button>
 <button
 disabled={pmtPage >= paymentsData.total_pages}
 onClick={() => setPmtPage((p) => p + 1)}
 className="p-1.5 bg-ink-900 border border-ink-800 disabled:opacity-40 hover:bg-ink-800"
 >
 <ChevronRight className="w-4 h-4"/>
 </button>
 </div>
 </div>
 </div>
 </FadeIn>
 )}
 </div>
 );
}

"use client";

import { useEffect, useState, use } from"react";
import { useRouter } from"next/navigation";
import Link from"next/link";
import { BookOpen, Clock, Signal, CheckCircle2, ShieldCheck, CreditCard, ArrowLeft, Loader2, User, Mail, Phone } from"lucide-react";
import { Course, OrderCreateResponse } from"@/types";
import { apiRequest } from"@/lib/api-client";
import { formatINR } from"@/lib/utils";

declare global {
 interface Window {
 Razorpay: any;
 }
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
 const resolvedParams = use(params);
 const router = useRouter();
 const [course, setCourse] = useState<Course | null>(null);
 const [loading, setLoading] = useState(true);
 const [showCheckoutModal, setShowCheckoutModal] = useState(false);
 const [submitting, setSubmitting] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");

 const [studentForm, setStudentForm] = useState({
 student_name:"",
 student_email:"",
 student_phone:"",
 });

 useEffect(() => {
 fetchCourseDetails();
 }, [resolvedParams.id]);

 const fetchCourseDetails = async () => {
 try {
 const data = await apiRequest<Course>(`/courses/${resolvedParams.id}`);
 setCourse(data);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleCreateOrder = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!course) return;
 setSubmitting(true);
 setErrorMsg("");

 try {
 // 1. Create order on backend
 const orderRes = await apiRequest<OrderCreateResponse>("/payments/create-order", {
 method:"POST",
 body: JSON.stringify({
 course_id: course.id,
 student_name: studentForm.student_name,
 student_email: studentForm.student_email,
 student_phone: studentForm.student_phone,
 }),
 });

 // 2. Options for Razorpay Checkout Modal
 const options = {
 key: orderRes.key_id,
 amount: orderRes.amount_inr * 100,
 currency: orderRes.currency,
 name:"InternVision Tech",
 description: `Enrollment: ${course.title}`,
 order_id: orderRes.order_id,
 prefill: {
 name: studentForm.student_name,
 email: studentForm.student_email,
 contact: studentForm.student_phone,
 },
 theme: {
 color:"#2563eb",
 },
 handler: async function (response: any) {
 try {
 // 3. Verify payment signature on backend
 await apiRequest("/payments/verify", {
 method:"POST",
 body: JSON.stringify({
 razorpay_order_id: response.razorpay_order_id,
 razorpay_payment_id: response.razorpay_payment_id,
 razorpay_signature: response.razorpay_signature,
 registration_id: orderRes.registration_id,
 }),
 });

 router.push(`/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&course=${encodeURIComponent(course.title)}`);
 } catch (err: any) {
 router.push(`/error?message=${encodeURIComponent(err.message ||"Signature verification failed")}`);
 }
 },
 modal: {
 ondismiss: function () {
 setSubmitting(false);
 },
 },
 };

 // Handle fallback simulation if Razorpay JS SDK isn't loaded (e.g. adblocker)
 if (typeof window !=="undefined"&& window.Razorpay) {
 const rzp = new window.Razorpay(options);
 rzp.open();
 } else {
 // Mock success fallback for local development without external script loading
 const mockVerify = await apiRequest<any>("/payments/verify", {
 method:"POST",
 body: JSON.stringify({
 razorpay_order_id: orderRes.order_id,
 razorpay_payment_id: `pay_mock_${Date.now()}`,
 razorpay_signature: `mock_sig_${Date.now()}`,
 registration_id: orderRes.registration_id,
 }),
 });
 router.push(`/success?payment_id=${mockVerify.payment_id}&order_id=${orderRes.order_id}&course=${encodeURIComponent(course.title)}`);
 }
 } catch (err: any) {
 setErrorMsg(err.message ||"Failed to initialize payment order.");
 setSubmitting(false);
 }
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center py-32">
 <Loader2 className="w-8 h-8 text-ember-500 animate-spin"/>
 </div>
 );
 }

 if (!course) {
 return (
 <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
 <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
 <p className="text-ink-400 text-sm">The course you are looking for does not exist or has been removed.</p>
 <Link href="/courses"className="inline-flex items-center gap-2 text-ember-400 font-semibold text-sm">
 <ArrowLeft className="w-4 h-4"/> Back to Course Catalog
 </Link>
 </div>
 );
 }

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
 <Link href="/courses"className="inline-flex items-center gap-2 text-xs font-semibold text-ink-400 hover:text-white transition">
 <ArrowLeft className="w-4 h-4"/> Back to All Courses
 </Link>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 {/* MAIN CONTENT */}
 <div className="lg:col-span-2 space-y-8">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <span className="px-3 py-1 text-xs font-medium bg-ember-500/10 text-ember-400 border border-ember-500/20">
 {course.level}
 </span>
 <span className="text-ink-400 text-xs flex items-center gap-1 font-medium">
 <Clock className="w-3.5 h-3.5"/>
 {course.duration}
 </span>
 </div>

 <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
 {course.title}
 </h1>

 <p className="text-ink-300 text-base leading-relaxed">
 {course.description}
 </p>
 </div>

 {/* TECHNOLOGIES COVERED */}
 <div className="glass-card p-6 space-y-4">
 <h3 className="text-lg font-bold text-white">Technologies You Will Master</h3>
 <div className="flex flex-wrap gap-2">
 {course.technologies.map((tech) => (
 <span key={tech} className="px-3 py-1.5 text-xs font-semibold bg-ink-900 text-ember-300 border border-ink-700">
 {tech}
 </span>
 ))}
 </div>
 </div>

 {/* SYLLABUS HIGHLIGHTS */}
 <div className="glass-card p-6 space-y-4">
 <h3 className="text-lg font-bold text-white">Curriculum & Learning Outcomes</h3>
 <ul className="space-y-3 text-sm text-ink-300">
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-ember-400 shrink-0 mt-0.5"/>
 <span>Production application architecture using Next.js 15 & FastAPI backend.</span>
 </li>
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-ember-400 shrink-0 mt-0.5"/>
 <span>REST API design, JWT authentication, and database ORM patterns.</span>
 </li>
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-ember-400 shrink-0 mt-0.5"/>
 <span>Payment gateway integration (Razorpay Test Mode) and signature verification.</span>
 </li>
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-ember-400 shrink-0 mt-0.5"/>
 <span>Containerization with Docker & automated cloud deployment on Railway & Vercel.</span>
 </li>
 </ul>
 </div>
 </div>

 {/* SIDEBAR ENROLLMENT CARD */}
 <div className="space-y-6">
 <div className="glass-card p-6 space-y-6 sticky top-24 border border-ember-500/30">
 <div>
 <div className="text-xs text-ink-400 font-medium">Total Registration Fee</div>
 <div className="text-4xl font-extrabold text-white mt-1">{formatINR(course.price_inr)}</div>
 <div className="text-xs text-emerald-400 font-medium mt-1">Includes Verified Certificate & Internship Placement</div>
 </div>

 <button
 onClick={() => setShowCheckoutModal(true)}
 className="w-full py-3.5 font-bold bg-ember-600 hover:bg-ember-500 text-white shadow-ember-600/30 flex items-center justify-center gap-2 transition"
 >
 <CreditCard className="w-4 h-4"/>
 Enroll & Pay Now
 </button>

 <div className="space-y-3 pt-4 border-t border-ink-800 text-xs text-ink-400">
 <div className="flex items-center gap-2">
 <ShieldCheck className="w-4 h-4 text-ember-400"/>
 <span>Razorpay Test Mode 256-bit Encrypted Checkout</span>
 </div>
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
 <span>Instant Enrollment Access</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* REGISTRATION MODAL */}
 {showCheckoutModal && (
 <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="glass-card max-w-md w-full p-6 space-y-6 border border-ink-700 relative">
 <div className="flex items-center justify-between border-b border-ink-800 pb-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-lg font-bold text-white">Complete Registration</h3>
 <span className="px-2 py-0.5 rounded flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
 <ShieldCheck className="w-3 h-3"/> Secure
 </span>
 </div>
 <p className="text-xs text-ink-400">{course.title}</p>
 </div>
 <button
 onClick={() => setShowCheckoutModal(false)}
 className="text-ink-400 hover:text-white text-sm font-bold p-1"
 >
 ✕
 </button>
 </div>

 {errorMsg && (
 <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
 {errorMsg}
 </div>
 )}

 <form onSubmit={handleCreateOrder} className="space-y-4 text-sm">
 <div className="space-y-1.5">
 <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
 <User className="w-3.5 h-3.5 text-ember-400"/> Full Name *
 </label>
 <input
 type="text"
 required
 placeholder="John Doe"
 value={studentForm.student_name}
 onChange={(e) => setStudentForm({ ...studentForm, student_name: e.target.value })}
 className="w-full bg-ink-900 border border-ink-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-ember-500"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
 <Mail className="w-3.5 h-3.5 text-ember-400"/> Email Address *
 </label>
 <input
 type="email"
 required
 placeholder="john@example.com"
 value={studentForm.student_email}
 onChange={(e) => setStudentForm({ ...studentForm, student_email: e.target.value })}
 className="w-full bg-ink-900 border border-ink-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-ember-500"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
 <Phone className="w-3.5 h-3.5 text-ember-400"/> Phone Number *
 </label>
 <input
 type="tel"
 required
 placeholder="+91 9876543210"
 value={studentForm.student_phone}
 onChange={(e) => setStudentForm({ ...studentForm, student_phone: e.target.value })}
 className="w-full bg-ink-900 border border-ink-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-ember-500"
 />
 </div>

 <div className="pt-4 flex items-center justify-between border-t border-ink-800">
 <div>
 <span className="text-xs text-ink-400 block">Total Due</span>
 <span className="text-xl font-black text-white">{formatINR(course.price_inr)}</span>
 </div>

 <button
 type="submit"
 disabled={submitting}
 className="px-6 py-2.5 font-bold bg-ember-600 hover:bg-ember-500 text-white shadow-ember-600/30 flex items-center gap-2 transition disabled:opacity-50"
 >
 {submitting ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin"/> Processing...
 </>
 ) : (
"Proceed to Pay"
 )}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}

"use client";

import { useEffect, useState, use } from"react";
import { useRouter } from"next/navigation";
import Link from"next/link";
import { BookOpen, Clock, Signal, CheckCircle2, ShieldCheck, CreditCard, ArrowLeft, Loader2, User, Mail, Phone } from"lucide-react";
import { Course, OrderCreateResponse } from"@/types";
import { apiRequest } from "@/lib/api-client";
import { formatINR } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registrationSchema = z.object({
  student_name: z.string().min(2, "Name must be at least 2 characters."),
  student_email: z.string().email("Please enter a valid email address."),
  student_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number."),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
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

  const handleCreateOrder = async (data: RegistrationFormValues) => {
    if (!course) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Create order on backend
      const orderRes = await apiRequest<OrderCreateResponse>("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({
          course_id: course.id,
          student_name: data.student_name,
          student_email: data.student_email,
          student_phone: data.student_phone,
        }),
      });

      // 2. Options for Razorpay Checkout Modal
      const options = {
        key: orderRes.key_id,
        amount: orderRes.amount_inr * 100,
        currency: orderRes.currency,
        name: "InternVision Tech",
        description: `Enrollment: ${course.title}`,
        order_id: orderRes.order_id,
        prefill: {
          name: data.student_name,
          email: data.student_email,
          contact: data.student_phone,
        },
        theme: {
          color: "#2563eb",
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

      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection or disable adblockers.");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMsg(response.error.description || "Payment failed");
        setSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initialize payment order.");
      setSubmitting(false);
    }
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center py-32">
 <Loader2 className="w-8 h-8 text-brand-500 animate-spin"/>
 </div>
 );
 }

 if (!course) {
 return (
 <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
 <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
 <p className="text-ink-400 text-sm">The course you are looking for does not exist or has been removed.</p>
 <Link href="/courses"className="inline-flex items-center gap-2 text-brand-400 font-semibold text-sm">
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
 <span className="px-3 py-1 text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
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
 <div className="bg-ink-950 border border-ink-800 p-6 space-y-4">
 <h3 className="text-lg font-bold text-white">Technologies You Will Master</h3>
 <div className="flex flex-wrap gap-2">
 {course.technologies.map((tech) => (
 <span key={tech} className="px-3 py-1.5 text-xs font-semibold bg-ink-900 text-brand-300 border border-ink-700">
 {tech}
 </span>
 ))}
 </div>
 </div>

 {/* SYLLABUS HIGHLIGHTS */}
 <div className="bg-ink-950 border border-ink-800 p-6 space-y-4">
 <h3 className="text-lg font-bold text-white">Curriculum & Learning Outcomes</h3>
 <ul className="space-y-3 text-sm text-ink-300">
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5"/>
 <span>Production application architecture using Next.js 15 & FastAPI backend.</span>
 </li>
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5"/>
 <span>REST API design, JWT authentication, and database ORM patterns.</span>
 </li>
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5"/>
 <span>Payment gateway integration (Razorpay Test Mode) and signature verification.</span>
 </li>
 <li className="flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5"/>
 <span>Containerization with Docker & automated cloud deployment on Railway & Vercel.</span>
 </li>
 </ul>
 </div>
 </div>

 {/* SIDEBAR ENROLLMENT CARD */}
 <div className="space-y-6">
 <div className="bg-ink-950 border border-ink-800 p-6 space-y-6 sticky top-24">
 <div>
 <div className="text-xs text-ink-400 font-medium">Total Registration Fee</div>
 <div className="text-4xl font-extrabold text-white mt-1">{formatINR(course.price_inr)}</div>
 <div className="text-xs text-emerald-400 font-medium mt-1">Includes Verified Certificate & Internship Placement</div>
 </div>

 <button
 onClick={() => setShowCheckoutModal(true)}
 className="w-full py-3.5 font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30 flex items-center justify-center gap-2 transition"
 >
 <CreditCard className="w-4 h-4"/>
 Enroll & Pay Now
 </button>

 <div className="space-y-3 pt-4 border-t border-ink-800 text-xs text-ink-400">
 <div className="flex items-center gap-2">
 <ShieldCheck className="w-4 h-4 text-brand-400"/>
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
 <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
 <div className="bg-ink-950 border border-ink-800 max-w-md w-full p-6 space-y-6 relative">
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

          <form onSubmit={handleSubmit(handleCreateOrder)} className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-400" /> Full Name *
              </label>
              <input
                type="text"
                {...register("student_name")}
                placeholder="John Doe"
                className="w-full bg-ink-900 border border-ink-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
              {errors.student_name && <p className="text-red-400 text-xs mt-1">{errors.student_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address *
              </label>
              <input
                type="email"
                {...register("student_email")}
                placeholder="john@example.com"
                className="w-full bg-ink-900 border border-ink-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
              {errors.student_email && <p className="text-red-400 text-xs mt-1">{errors.student_email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-400" /> Phone Number *
              </label>
              <input
                type="tel"
                {...register("student_phone")}
                placeholder="+91 9876543210"
                className="w-full bg-ink-900 border border-ink-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
              {errors.student_phone && <p className="text-red-400 text-xs mt-1">{errors.student_phone.message}</p>}
            </div>

 <div className="pt-4 flex items-center justify-between border-t border-ink-800">
 <div>
 <span className="text-xs text-ink-400 block">Total Due</span>
 <span className="text-xl font-black text-white">{formatINR(course.price_inr)}</span>
 </div>

 <button
 type="submit"
 disabled={submitting}
 className="px-6 py-2.5 font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30 flex items-center gap-2 transition disabled:opacity-50"
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

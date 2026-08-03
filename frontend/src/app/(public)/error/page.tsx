"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "An error occurred during payment processing or verification.";

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-2xl shadow-red-500/20">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          Transaction Failed
        </span>
        <h1 className="text-3xl font-extrabold text-white">Payment Unsuccessful</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Link
          href="/courses"
          className="px-6 py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading error status...</div>}>
      <ErrorContent />
    </Suspense>
  );
}

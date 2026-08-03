"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@internvision.tech");
  const [password, setPassword] = useState("Admin@123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Authentication failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Admin Authentication</h2>
          <p className="text-xs text-slate-400">Secure JWT portal for InternVision Tech administrators</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Default Credentials:</p>
            <p>Email: <span className="font-mono text-blue-400">admin@internvision.tech</span></p>
            <p>Password: <span className="font-mono text-blue-400">Admin@123456</span></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Login to Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

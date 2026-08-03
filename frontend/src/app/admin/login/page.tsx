"use client";

import { useState } from"react";
import { useRouter } from"next/navigation";
import { Shield, Lock, Mail, ArrowRight, Loader2, Sparkles } from"lucide-react";
import { apiRequest } from"@/lib/api-client";
import { FadeIn } from "@/components/animations/FadeIn";

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

 const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ||"http://localhost:8000/api/v1"}/auth/login`, {
 method:"POST",
 headers: {
"Content-Type":"application/x-www-form-urlencoded",
 },
 body: formData.toString(),
 });

 if (!res.ok) {
 const errorData = await res.json();
 throw new Error(errorData.detail ||"Authentication failed");
 }

 const data = await res.json();
 localStorage.setItem("token", data.access_token);
 router.push("/admin/dashboard");
 } catch (err: any) {
 setError(err.message ||"Invalid credentials. Please try again.");
 setLoading(false);
 }
 };

 return (
 <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
 <FadeIn delay={0.1} direction="up">
 <div className="max-w-md w-full glass-card p-8 border border-ink-800 space-y-8">
 <div className="text-center space-y-3">
 <div className="w-12 h-12 bg-ember-600/20 text-ember-400 flex items-center justify-center mx-auto border border-ember-500/30">
 <Shield className="w-6 h-6"/>
 </div>
 <h2 className="text-2xl font-extrabold text-white">Admin Authentication</h2>
 <p className="text-xs text-ink-400">Secure JWT portal for InternVision Tech administrators</p>
 </div>

 {error && (
 <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
 {error}
 </div>
 )}

 <form onSubmit={handleLogin} className="space-y-4 text-sm">
 <div className="space-y-1.5">
 <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
 <Mail className="w-3.5 h-3.5 text-ember-400"/> Admin Email
 </label>
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full bg-ink-900 border border-ink-700 px-4 py-2.5 text-white focus:outline-none focus:border-ember-500 transition"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-xs text-ink-300 font-medium flex items-center gap-1.5">
 <Lock className="w-3.5 h-3.5 text-ember-400"/> Password
 </label>
 <input
 type="password"
 required
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full bg-ink-900 border border-ink-700 px-4 py-2.5 text-white focus:outline-none focus:border-ember-500 transition"
 />
 </div>

 <div className="p-3 bg-ink-900/60 border border-ink-800 text-[11px] text-ink-400 space-y-1">
 <p className="font-semibold text-ink-300">Default Credentials:</p>
 <p>Email: <span className="font-mono text-ember-400">admin@internvision.tech</span></p>
 <p>Password: <span className="font-mono text-ember-400">Admin@123456</span></p>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-3.5 font-bold bg-ember-600 hover:bg-ember-500 text-white flex items-center justify-center gap-2 transition disabled:opacity-50"
 >
 {loading ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin"/> Authenticating...
 </>
 ) : (
 <>
 Login to Dashboard <ArrowRight className="w-4 h-4"/>
 </>
 )}
 </button>
 </form>
 </div>
 </FadeIn>
 </div>
 );
}

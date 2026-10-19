"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Sparkles,
  KeyRound,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("admin@sisora.si");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter your admin password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Outer subtle glow */}
      <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-neutral-800 to-neutral-900 opacity-60 blur-xl pointer-events-none" />

      {/* Double Bezel Outer Shell */}
      <div className="relative rounded-[2rem] p-1.5 bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-2xl">
        {/* Inner Card Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0d0f14] p-8 sm:p-10 border border-neutral-800/80 text-white relative overflow-hidden">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="text-center relative z-10 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700/80 text-white font-black text-2xl shadow-inner mb-4">
              <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
                S
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restricted Terminal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              SISORA Console
            </h1>
            <p className="mt-1 text-xs text-neutral-400 font-medium">
              High-Value .SI Domain Portfolio Administration
            </p>
          </div>

          {/* Form Area */}
          <div className="relative z-10">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-xs leading-relaxed animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Admin Identity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-700 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400"
                  >
                    Passkey
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    256-Bit Encrypted
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full pl-10 pr-10 py-3 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-700 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-between p-1.5 pr-2 rounded-full bg-white text-black hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-lg font-bold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="pl-5 tracking-tight font-black">
                    {loading ? "Authenticating..." : "Authorize & Enter Console"}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Footer security signal */}
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero-Trust SSR Shield</span>
            </span>
            <span>Sisora Brokerage v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07080a] text-white relative overflow-hidden">
      {/* Background Decorative Mesh Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2430_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-950/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-950/20 rounded-full blur-[128px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl border border-neutral-800 p-8 flex flex-col items-center justify-center min-h-[360px]">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-2" />
            <p className="text-xs text-neutral-500 font-medium font-mono">Establishing secure handshake...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

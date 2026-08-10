"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    
    if (res?.error) {
      setPending(false);
      setError("Wrong email or password.");
      return;
    }
    
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex text-ink bg-white antialiased relative">
      
      {/* SVG ClipPath Definition for the Right Panel */}
      <svg width="0" height="0" className="absolute hidden lg:block">
        <clipPath id="s-curve-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0.15,0 C 0.28,0.15 0.28,0.35 0.15,0.5 C 0.02,0.65 0.02,0.85 0.15,1 L 1,1 L 1,0 Z" />
        </clipPath>
      </svg>

      {/* Left Panel - Form Area */}
      <div className="w-full lg:w-[50%] flex flex-col relative bg-white h-screen z-10">
        
        {/* Top Logo */}
        <div className="absolute top-4 left-4 md:top-6 md:left-8 z-10">
          <img src="/logo.png" alt="Beyond Demands" className="h-28 md:h-32 w-auto object-contain" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:pl-32 lg:pr-16 py-8 overflow-y-auto">
          <div className="w-full max-w-[400px] mx-auto my-auto mt-32 lg:mt-auto">
            <h1 className="text-4xl text-black tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
              Sign in to your salon
            </h1>
            <p className="mt-3 text-[12px] text-gray-500 max-w-[280px] leading-relaxed">
              Order supplies, track deliveries, manage your account
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="block text-[9px] font-bold text-black mb-2 uppercase tracking-[0.15em]">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 rounded-sm px-4 h-10 text-[13px] text-black placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  placeholder="you@salon.com"
                />
              </label>

              <label className="block relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-[9px] font-bold text-black uppercase tracking-[0.15em]">
                    Password
                  </span>
                  <Link href="/forgot-password" className="text-[10px] text-gray-500 hover:text-black transition-colors">
                    Forgot your password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 rounded-sm px-4 h-10 text-[13px] text-black placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  placeholder="••••••••"
                />
              </label>

              {error && <p className="text-red-500 text-sm pt-2">{error}</p>}

              <button
                type="submit"
                disabled={pending}
                className="mt-6 w-full h-10 bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {pending ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="mt-6 text-center text-[11px] text-gray-500">
              Don&apos;t have a professional account?{" "}
              <Link href="/apply" className="text-black font-semibold underline underline-offset-2 hover:text-gray-700">
                Apply here
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 w-full text-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            Beyond Demands · by Infynix Growth Solutions
          </p>
        </div>
      </div>

      {/* Right Panel - Image Area */}
      <div 
        className="hidden lg:block absolute right-0 top-0 w-[50%] h-full bg-gray-100 z-0"
        style={{ clipPath: 'url(#s-curve-clip)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/wholesale_bg.png"
            alt="Wholesale Warehouse Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Partner Access Badge - moved right to avoid curve */}
          <div className="absolute top-8 left-[28%] xl:left-[25%]">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-sm shadow-sm inline-block">
              <span className="text-[8px] font-bold text-black uppercase tracking-[0.15em]">
                Storefront · Salon Login
              </span>
            </div>
          </div>

          {/* Quote - moved right to avoid curve */}
          <div className="absolute bottom-10 left-[28%] xl:left-[25%] pr-8">
            <h2 className="text-2xl text-white max-w-[400px] leading-relaxed italic font-light drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
              &quot;Your premier wholesale partner for professional salon supplies and bulk ordering.&quot;
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

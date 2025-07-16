"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Signup successful!");
      router.push("/login");
    } else {
      const err = await res.json();
      alert(err.detail || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <form 
          onSubmit={handleSignup}
          className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-white/20 shadow-2xl"
        >
          {/* Logo/Brand Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/30 rounded-md sm:rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rounded-sm"></div>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2 sm:mb-3">
              Create Account
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
              Join our automation workspace
            </p>
          </div>

          {/* Signup Form */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 px-4 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-white/20 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-xs sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 px-4 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-white/20 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-xs sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:shadow-purple-500/25 relative overflow-hidden group text-xs sm:text-sm"
            >
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="relative flex items-center justify-center gap-1.5">
                <div className="w-0 h-0 border-l-[4px] sm:border-l-[5px] border-l-white border-y-[2px] sm:border-y-[3px] border-y-transparent"></div>
                Sign Up
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4 sm:my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-gray-400 text-xs sm:text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-300 text-xs sm:text-sm">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-purple-300 hover:text-purple-200 font-semibold transition-colors hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
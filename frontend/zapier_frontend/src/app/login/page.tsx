"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "@/assets/Google__G__logo.svg.webp";

const setToken = (token: string) => {
  localStorage.setItem("zapier_token", token);
};

const getToken = (): string | null => {
  return localStorage.getItem("zapier_token");
};

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // ✅ Handle redirect from Google OAuth
  useEffect(() => {
    const token = searchParams.get("zapier_token");
    if (token) {
      setToken(token);
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.access_token);
        router.push("/dashboard");
      } else {
        alert(data.detail || "Login failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => router.push("/signup");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* 🔆 Background + Grid Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* 🧾 Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-sm">Sign in to your automation workspace</p>
          </div>

          {/* 📩 Email Field */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-purple-500/30 text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* 🔒 Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-purple-500/30 text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* 🔐 Forgot Password */}
            <div className="text-right">
              <button className="text-xs text-purple-300 hover:text-purple-200">Forgot password?</button>
            </div>

            {/* 🔁 Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] text-white font-semibold py-3 px-4 rounded-xl transition duration-300"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* 🔵 Google OAuth */}
            <button
              onClick={() => {
                window.location.href = "http://localhost:8000/auth/google/login";
              }}
              className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center gap-2"
            >
              <Image src={GoogleIcon} alt="Google" width={16} height={16} />
              Sign in with Google
            </button>

            {/* ➖ Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* 🧾 Sign Up Link */}
            <div className="text-center text-gray-300 text-sm">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={handleSignUpClick}
                className="text-purple-300 hover:text-purple-200 font-semibold hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔁 Spinner CSS */}
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
};

export default Login;

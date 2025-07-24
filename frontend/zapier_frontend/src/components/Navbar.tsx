"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("zapier_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setName(decoded?.name || "User");
      } catch {
        setName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("zapier_token");
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <nav className="relative w-full bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 flex justify-between items-center px-8 py-2">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white/30 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* User Section */}
        {name && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">
                Hi, {name.split(" ")[0]}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/25"
            >
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="relative flex items-center gap-2">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </div>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
          }
        }

        nav {
          animation: subtle-glow 4s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
}
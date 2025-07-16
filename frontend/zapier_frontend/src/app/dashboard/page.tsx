"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon, Bars3Icon, PlusIcon, PlayIcon, StopIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const [flows, setFlows] = useState([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/flows/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setFlows)
      .catch((err) => console.error("Failed to fetch flows:", err));
  }, []);

  const handleCreateFlow = () => {
    router.push("/flows/new");
  };

  const handleLoadFlow = (flowId: any) => {
    router.push(`/flows/${flowId}`);
  };

  const handleRunFlow = (flowId: any) => {
    router.push(`/flows/${flowId}/run`);
  };

  const handleExportFlow = (flowId: any) => {
    router.push(`/flows/${flowId}/export`);
  };

  const deleteFlow = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/flows/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      alert("✅ Flow deleted!");
    } else {
      alert("❌ Failed to delete flow.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-center animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Zapier GenAI
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Your automation playground reimagined
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/flows")}
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="relative flex items-center gap-3">
                  <Bars3Icon className="w-6 h-6 text-white/90" />
                  View All Flows
                </div>
              </button>
              <button
                onClick={handleCreateFlow}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="relative flex items-center gap-3">
                  <PlusIcon className="w-6 h-6 text-white/90" />
                  Create New Flow
                </div>
              </button>
            </div>
          </div>

          {/* Recent Flows Section */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-white">Recent Flows</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>

            {flows.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  No flows yet
                </h3>
                <p className="text-gray-400">
                  Create your first automation flow to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flows.slice(0, 6).map((flow: any, index) => (
                  <div
                    key={flow.id}
                    className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                            {flow.title}
                          </h3>
                          <p className="text-sm text-gray-400 font-mono">
                            ID: {flow.id}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <div className="w-6 h-6 bg-white/30 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={() => handleLoadFlow(flow.id)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2"
                        >
                          {/* <div className="w-3 h-3 bg-current rounded-sm opacity-70"></div> */}
                          <StopIcon className="w-4 h-4"/>
                          Load
                        </button>
                        <button
                          onClick={() => handleRunFlow(flow.id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                          <PlayIcon className="w-4 h-4"/>
                          Run
                        </button>
                        <button
                          onClick={() => handleExportFlow(flow.id)}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2"
                        >
                          <div className="w-3 h-3 border-2 border-current rounded-sm"></div>
                          Export
                        </button>
                        <button
                          onClick={() => deleteFlow(flow.id)}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2"
                        >
                          {/* <div className="w-3 h-3 border-2 border-current rounded-sm"></div> */}
                          <TrashIcon className="w-5 h-5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon , PencilIcon, PlayIcon} from "@heroicons/react/24/outline";

export default function FlowListPage() {
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const flowsPerPage = 4;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/flows/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched flows:", data);
        if (Array.isArray(data)) {
          setFlows(data);
        } else {
          setFlows([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching flows:", err);
        setFlows([]);
        setLoading(false);
      });
  }, []);

  // Get current flows
  const indexOfLastFlow = currentPage * flowsPerPage;
  const indexOfFirstFlow = indexOfLastFlow - flowsPerPage;
  const currentFlows = flows.slice(indexOfFirstFlow, indexOfLastFlow);
  const totalPages = Math.ceil(flows.length / flowsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4 sm:p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            My Automation Flows
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mt-2">
            Manage your workflow automations
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-300">Loading your flows...</p>
          </div>
        ) : flows.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
            <p className="text-gray-300 mb-4">No flows found. Create one first!</p>
            <button
              onClick={() => router.push("/flows/new")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Create New Flow
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentFlows.map((flow: any) => (
                <div
                  key={flow.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-lg text-white group-hover:text-purple-200 transition-colors">
                        {flow.title || "Untitled Flow"}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">ID: {flow.id}</p>
                      {flow.description && (
                        <p className="text-gray-300 text-sm mt-2">{flow.description}</p>
                      )}
                    </div>
                  <div className="flex gap-3">
  <button
    onClick={() => router.push(`/flows/${flow.id}`)}
    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:shadow-purple-500/20 hover:shadow-md"
  >
    <PencilIcon className="w-4 h-4" />
    <span>Edit Flow</span>
  </button>
  <button
    onClick={() => router.push(`/flows/${flow.id}/run`)}
    className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-all duration-200"
  >
    <PlayIcon className="w-4 h-4" />
    <span>Run Now</span>
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {flows.length > flowsPerPage && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${currentPage === number ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'}`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-gray-400 text-xs sm:text-sm">
            Advanced workflow automation at your fingertips
          </p>
        </div>
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
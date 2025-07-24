"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Loader Component (extracted from the demo)
const Loader = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default',
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animated Spinner */}
      {variant === 'default' && (
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-purple-500/20 rounded-full`}></div>
          <div className={`${sizeClasses[size]} border-4 border-purple-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin`}></div>
        </div>
      )}

      {/* Pulsing Dots */}
      {variant === 'dots' && (
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      )}

      {/* Rotating Gradient Ring */}
      {variant === 'ring' && (
        <div className="relative">
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-spin p-1`}>
            <div className="bg-slate-900 rounded-full w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Text */}
      {text && (
        <p className={`text-gray-300 ${textSizeClasses[size]} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 min-w-[200px] text-center">
          <LoaderContent />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
      <LoaderContent />
    </div>
  );
};

export default function FlowListPage() {
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const flowsPerPage = 4;
  const router = useRouter();

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("zapier_token");
        const response = await fetch("http://localhost:8000/flows/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        console.log("Fetched flows:", data);
        
        if (Array.isArray(data)) {
          setFlows(data);
        } else {
          setFlows([]);
        }
      } catch (err) {
        console.error("Error fetching flows:", err);
        setFlows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlows();
  }, []);

  const deleteFlow = async (flowId: string) => {
    try {
      setDeletingId(flowId);
      const token = localStorage.getItem("zapier_token");
      
      const response = await fetch(`http://localhost:8000/flows/${flowId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete flow");
      }

      // Remove the flow from the state
      setFlows(flows.filter(flow => flow.id !== flowId));
      setShowDeleteConfirm(null);
      
      // Adjust current page if needed 
      const remainingFlows = flows.length - 1;
      const maxPage = Math.ceil(remainingFlows / flowsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch (error) {
      console.error("Error deleting flow:", error);
      // You could add a toast notification here
    } finally {
      setDeletingId(null);
    }
  };

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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Flow</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this flow? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteFlow(showDeleteConfirm)}
                disabled={deletingId === showDeleteConfirm}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Overlay Loader */}
      {deletingId && (
        <Loader 
          variant="ring" 
          overlay={true}
          text="Deleting flow..."
          size="md"
        />
      )}

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

        {loading ? (
          <Loader 
            variant="dots" 
            text="Loading your flows..." 
            size="lg"
          />
        ) : flows.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center border border-white/10">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              No flows found. Create one first!
            </p>
            <button
              onClick={() => router.push("/flows/new")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-purple-500/20"
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
                    <div className="flex-1">
                      <h2 className="font-bold text-lg text-white group-hover:text-purple-200 transition-colors">
                        {flow.title || "Untitled Flow"}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        ID: {flow.id}
                      </p>
                      {flow.description && (
                        <p className="text-gray-300 text-sm mt-2">
                          {flow.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => router.push(`/flows/${flow.id}`)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:shadow-purple-500/20 hover:shadow-md"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => router.push(`/flows/${flow.id}/run`)}
                        className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-all duration-200"
                      >
                        <PlayIcon className="w-4 h-4" />
                        <span>Run</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(flow.id)}
                        disabled={deletingId === flow.id}
                        className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-600/30 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
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
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        currentPage === number
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-white hover:bg-white/10"
                  }`}
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
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
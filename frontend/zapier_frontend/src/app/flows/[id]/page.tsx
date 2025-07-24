"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FlowBuilder from "@/components/FlowBuilder";

export default function FlowDetailPage() {
  const [flow, setFlow] = useState<any>(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("zapier_token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    fetch(`http://localhost:8000/flows/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to load flow");
        }
        return res.json();
      })
      .then(setFlow)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!flow) return <p className="p-4">Loading flow...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">{flow.title}</h1>
      <FlowBuilder initialNodes={flow.nodes} initialEdges={flow.edges} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FlowRunPage() {
  const { id } = useParams();
  const [flow, setFlow] = useState<any>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/flows/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFlow(data));
  }, [id]);

const runFlow = async () => {
  try {
    setLoading(true);
    setResult(""); // clear previous output
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/flows/${id}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ input }), // ✅ must be a valid JSON string like { "input": "Hello" }
    });

    if (!res.ok) {
      const err = await res.text(); // show raw error if not JSON
      throw new Error(`Request failed: ${res.status}\n${err}`);
    }

    const data = await res.json();
    setResult(data.result || "No result returned");
  } catch (err: any) {
    setResult(`Error: ${err.message}`);
  } finally {
    setLoading(false);
  }
};



  if (!flow) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Run: {flow.title}</h1>

      <input
        type="text"
        placeholder="Enter input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />

      <button
        onClick={runFlow}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Flow"}
      </button>

      {result && (
        <div className="border rounded p-4 bg-gray-100">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}

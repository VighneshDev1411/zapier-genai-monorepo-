"use client";
import React, { useState } from "react";

export default function FlowRunner({ flowId }: { flowId: string }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const runFlow = async () => {
    setLoading(true);
    const token = localStorage.getItem("zapier_token");

    const res = await fetch(`http://localhost:8000/flows/${flowId}/run?input=${encodeURIComponent(input)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult(data.result);
    } else {
      setResult(data.detail || "Flow execution failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-semibold">Run Flow</h1>
      <textarea
        rows={4}
        className="w-full border rounded p-2"
        placeholder="Enter your input..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={runFlow}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Flow"}
      </button>

      {result && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <strong>Result:</strong>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

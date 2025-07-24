"use client";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import FlowNode from "./FlowNode";
import { nanoid } from "nanoid";
import { useState, useCallback, useMemo } from "react";
import { PlusIcon, BookmarkIcon } from "@heroicons/react/24/outline";

export default function FlowBuilder({ initialNodes = [], initialEdges = [] }) {
  // ✅ Sanitize initial nodes
  const cleanInitialNodes = initialNodes.map((n, idx) => ({
    ...n,
    id: n.id || nanoid(),
    position: n?.position ?? {
      x: 100 + idx * 50,
      y: 100 + idx * 50,
    },
  }));

  // ✅ Sanitize initial edges
  const cleanInitialEdges = initialEdges.map((e: Edge) => ({
    ...e,
    id: e.id || nanoid(),
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(cleanInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(cleanInitialEdges);
  const [title, setTitle] = useState("My Flow");

  const handleNodeChange = useCallback(
    (id: any, newData: any) => {
      setNodes((nds: any) =>
        nds.map((node: any) =>
          node.id === id ? { ...node, data: newData } : node
        )
      );
    },
    [setNodes]
  );

  const nodeTypes = useMemo(
    () => ({
      default: (nodeProps: any) => (
        <FlowNode
          {...nodeProps}
          data={{ ...nodeProps.data, onChange: handleNodeChange }}
        />
      ),
    }),
    [handleNodeChange]
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, id: nanoid() }, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    const token = localStorage.getItem("zapier_token");

    const safeNodes = nodes.map((node) => {
      const position = node?.position ?? {
        x: Math.random() * 400,
        y: Math.random() * 400,
      };
      return {
        id: node.id,
        type: node.data.type,
        config: node.data.config || {},
        position,
      };
    });

    const safeEdges = edges.map((edge) => ({
      ...edge,
      id: edge.id || nanoid(),
    }));

    const res = await fetch("http://localhost:8000/flows/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, nodes: safeNodes, edges: safeEdges }),
    });

    if (res.ok) {
      alert("Flow saved!");
    } else {
      alert("Save failed");
    }
  };

  const addPromptNode = useCallback(() => {
    const id = nanoid();
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "default",
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        data: {
          label: `Prompt ${id.slice(0, 4)}`,
          type: "llm",
          config: {
            prompt: "Reply nicely to: {{input}}",
          },
        },
      },
    ]);
  }, [setNodes]);

  const addToolNode = useCallback(() => {
    const id = nanoid();
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "default",
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        data: {
          label: `Tool ${id.slice(0, 4)}`,
          type: "tool",
          config: {
            tool_type: "slack",
            tool_input: "Send this to Slack: {{input}}",
          },
        },
      },
    ]);
  }, [setNodes]);

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

      <div className="relative z-10 h-[90vh] flex flex-col">
        {/* Header Controls */}
        <div className="bg-white/10 backdrop-blur-md p-4 border-b border-white/20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="w-full sm:w-auto">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Flow Title"
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 px-4 py-2 rounded-xl border border-white/20 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={addPromptNode}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-purple-500/20 hover:shadow-md"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Prompt</span>
              </button>
              
              <button
                onClick={addToolNode}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 hover:shadow-green-500/20 hover:shadow-md"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Tool</span>
              </button>
              
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 hover:scale-105 hover:shadow-blue-500/20 hover:shadow-md"
              >
                <BookmarkIcon className="w-4 h-4" />
                <span>Save Flow</span>
              </button>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
          >
            <MiniMap 
              nodeColor={(node) => {
                if (node.data?.type === 'llm') return '#8b5cf6'; // purple
                if (node.data?.type === 'tool') return '#10b981'; // emerald
                return '#3b82f6'; // blue
              }}
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
            />
            <Controls 
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                padding: '0.25rem',
              }}
            />
            <Background 
              color="#64748b"
              gap={24}
              variant="dots"
            />
          </ReactFlow>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
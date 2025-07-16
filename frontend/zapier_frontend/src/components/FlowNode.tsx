"use client";
import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { CodeBracketIcon, CommandLineIcon, GlobeAltIcon, InboxIcon, PaperAirplaneIcon, WrenchIcon } from "@heroicons/react/24/outline";

function FlowNode({ id, data, selected }: any) {
  const updateNode = useCallback(
    (changes: any) => {
      data.onChange(id, {
        ...data,
        config: {
          ...data.config,
          ...changes,
        },
      });
    },
    [data, id]
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      data.onChange(id, {
        ...data,
        type: e.target.value,
        config: {}, // reset config on type change
      });
    },
    [data, id]
  );

  const nodeTypeIcons = {
    llm: <CommandLineIcon className="w-4 h-4" />,
    http: <GlobeAltIcon className="w-4 h-4" />,
    code: <CodeBracketIcon className="w-4 h-4" />,
    input: <InboxIcon className="w-4 h-4" />,
    tool: <WrenchIcon className="w-4 h-4" />,
    output: <PaperAirplaneIcon className="w-4 h-4" />,
    code_convert: <CodeBracketIcon className="w-4 h-4" />
  };

  const nodeColors = {
    llm: 'from-purple-600 to-indigo-600',
    http: 'from-blue-600 to-cyan-600',
    code: 'from-yellow-600 to-amber-600',
    input: 'from-gray-600 to-slate-600',
    tool: 'from-emerald-600 to-green-600',
    output: 'from-pink-600 to-rose-600',
    code_convert: 'from-orange-600 to-red-600'
  };

  const currentType = data?.type || "llm";

  return (
    <div
      className={`
        bg-gradient-to-br ${nodeColors[currentType]} 
        rounded-xl shadow-lg p-4 w-64 text-sm space-y-3
        border border-white/20
        ${selected ? 'ring-2 ring-white ring-opacity-60' : ''}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Node Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {nodeTypeIcons[currentType]}
          <div className="text-xs font-bold text-white/90 uppercase">
            {currentType.toUpperCase()}
          </div>
        </div>
        <select
          value={currentType}
          onChange={handleTypeChange}
          className={`
            text-xs bg-white/10 backdrop-blur-sm text-white
            border border-white/20 rounded-lg px-2 py-1
            focus:outline-none focus:ring-1 focus:ring-white/50
          `}
        >
          <option value="llm">LLM</option>
          <option value="http">HTTP</option>
          <option value="code">Code</option>
          <option value="input">Input</option>
          <option value="tool">Tool</option>
          <option value="output">Output</option>
          <option value="code_convert">Code Convert</option>
        </select>
      </div>

      {/* Node Content */}
      <div className="space-y-3">
        {/* LLM Prompt */}
        {currentType === "llm" && (
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Prompt</label>
            <textarea
              className={`
                w-full bg-white/10 backdrop-blur-sm text-white
                border border-white/20 rounded-lg px-3 py-2
                placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50
                text-sm
              `}
              value={data.config?.prompt || ""}
              onChange={(e) => updateNode({ prompt: e.target.value })}
              placeholder="e.g. Translate to French"
              rows={3}
            />
          </div>
        )}

        {/* Tool */}
        {currentType === "tool" && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Tool Type</label>
              <select
                className={`
                  w-full bg-white/10 backdrop-blur-sm text-white
                  border border-white/20 rounded-lg px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-white/50
                  text-sm
                `}
                value={data.config?.tool_type || "slack"}
                onChange={(e) => updateNode({ tool_type: e.target.value })}
              >
                <option value="slack">Slack</option>
                <option value="gmail">Gmail</option>
                <option value="notion">Notion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Message</label>
              <input
                type="text"
                className={`
                  w-full bg-white/10 backdrop-blur-sm text-white
                  border border-white/20 rounded-lg px-3 py-2
                  placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50
                  text-sm
                `}
                value={data.config?.tool_input || ""}
                onChange={(e) => updateNode({ tool_input: e.target.value })}
                placeholder="e.g. Send this to Slack"
              />
            </div>
          </div>
        )}

        {/* HTTP Node */}
        {currentType === "http" && (
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">URL</label>
            <input
              className={`
                w-full bg-white/10 backdrop-blur-sm text-white
                border border-white/20 rounded-lg px-3 py-2
                placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50
                text-sm
              `}
              value={data.config?.url || ""}
              onChange={(e) => updateNode({ url: e.target.value })}
              placeholder="https://api.example.com"
            />
          </div>
        )}

        {/* Code Node */}
        {currentType === "code" && (
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Code</label>
            <textarea
              className={`
                w-full bg-white/10 backdrop-blur-sm text-white font-mono
                border border-white/20 rounded-lg px-3 py-2
                placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50
                text-xs
              `}
              rows={5}
              value={data.config?.code || ""}
              onChange={(e) => updateNode({ code: e.target.value })}
              placeholder="return input + ' world';"
            />
          </div>
        )}

        {/* Input Node */}
        {currentType === "input" && (
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Label</label>
            <input
              type="text"
              className={`
                w-full bg-white/10 backdrop-blur-sm text-white
                border border-white/20 rounded-lg px-3 py-2
                placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50
                text-sm
              `}
              value={data.config?.label || ""}
              onChange={(e) => updateNode({ label: e.target.value })}
              placeholder="User Input"
            />
          </div>
        )}

        {/* Output Node */}
        {currentType === "output" && (
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Output Key</label>
            <input
              type="text"
              className={`
                w-full bg-white/10 backdrop-blur-sm text-white
                border border-white/20 rounded-lg px-3 py-2
                placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50
                text-sm
              `}
              value={data.config?.key || ""}
              onChange={(e) => updateNode({ key: e.target.value })}
              placeholder="e.g. Final answer"
            />
          </div>
        )}

        {/* Code Convert Node */}
        {currentType === "code_convert" && (
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1">Target Language</label>
            <select
              className={`
                w-full bg-white/10 backdrop-blur-sm text-white
                border border-white/20 rounded-lg px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-white/50
                text-sm
              `}
              value={data.config?.lang || "JavaScript"}
              onChange={(e) => updateNode({ lang: e.target.value })}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="C++">C++</option>
              <option value="Go">Go</option>
            </select>
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-white/80 !w-2 !h-2 !border-0" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-white/80 !w-2 !h-2 !border-0" 
      />
    </div>
  );
}

export default memo(FlowNode);
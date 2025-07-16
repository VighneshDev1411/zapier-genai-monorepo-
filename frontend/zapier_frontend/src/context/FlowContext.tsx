"use client";
import { createContext, useContext, useState } from "react";
import { Node, Edge } from "reactflow";

type FlowContextType = {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
};

const FlowContext = createContext<FlowContextType | null>(null);

export const FlowProvider = ({ childern }: { childern: React.ReactNode }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <FlowContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
      {childern}
    </FlowContext.Provider>
  );
};


export const useFlow = () => {
    const context = useContext(FlowContext);
    if (!context) throw new Error("FlowContext missing!");
    return context;
}
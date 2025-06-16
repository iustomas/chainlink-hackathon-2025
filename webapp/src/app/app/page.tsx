"use client";

// react
import React from "react";

// react flow
import { ReactFlow, Node, Edge, Position, Handle } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// components
import Navbar from "@/components/Navbar";

const CustomNode = ({ data }: { data: { label: string } }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 20,
        borderRadius: 8,
        border: "2px solid #4a90e2",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: 180,
        textAlign: "center" as const,
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "user",
    position: { x: 50, y: 100 },
    data: { label: "Usuario conectado" },
    type: "custom",
    connectable: false,
  },
  {
    id: "iniciar-caso",
    position: { x: 350, y: 100 },
    data: { label: "Iniciar Caso" },
    type: "custom",
    connectable: false,
  },
];

const initialEdges: Edge[] = [
  {
    id: "user-to-iniciar",
    source: "user",
    target: "iniciar-caso",
    sourceHandle: "right",
    targetHandle: "left",
    type: "smoothstep",
    style: {
      stroke: "#4A90E2",
      strokeWidth: 3,
      opacity: 1,
    },
    animated: true,
  },
];

export default function App() {
  return (
    <main className="relative min-h-screen bg-[#F4F3ED]">
      <Navbar />

      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        />
      </div>
    </main>
  );
}

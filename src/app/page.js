"use client"
import React, { useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
} from "react-flow-renderer";
import Sidebar from "../app/components/Sidebar";
import Textnode from "../app/components/Textnode";

export default function Home() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeText, setNodeText] = useState("");

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setNodeText(node.data.label);
  };

  const handleDragStart = (event, text) => {
    event.dataTransfer.setData("text/plain", text);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    const reactFlowBounds = document
      .querySelector(".react-flow")
      .getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: "textNode",
      position,
      data: { label: text },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex h-full">
      <Sidebar
        nodeText={nodeText}
        setNodeText={setNodeText}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        onDragStart={handleDragStart}
      />
      <ReactFlowProvider>
        <div
          className="flex-grow h-full"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
            onNodeClick={handleNodeClick}
            nodeTypes={{ textNode: Textnode }}
          style={{ width: "100%", height: "100vh" }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      </ReactFlowProvider>
    </div>
  );
}

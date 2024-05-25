"use client"
import React, { useState } from "react";
import ReactFlow, { addEdge, Background, Controls } from "react-flow-renderer";
import Textnode from "./components/Textnode";
import Sidebar from "./components/Sidebar";


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
    const position = { x: event.clientX, y: event.clientY }; // Adjust position according to your needs
    const newNode = {
      id: Math.random(),
      type: "default",
      position,
      data: { label: text },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex" onDrop={handleDrop} onDragOver={handleDragOver}>
      <Sidebar
        nodeText={nodeText}
        setNodeText={setNodeText}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        onDragStart={handleDragStart}
      />
      <div className="flex-grow">
        <ReactFlow
          elements={nodes.concat(edges)}
          onElementsRemove={(elementsToRemove) =>
            setNodes((prevNodes) =>
              prevNodes.filter(
                (node) => !elementsToRemove.some((el) => el.id === node.id)
              )
            )
          }
          onConnect={(params) =>
            setEdges((prevEdges) => addEdge(params, prevEdges))
          }
          onElementClick={handleNodeClick}
          style={{ width: "100%", height: "100vh" }}
        >
          <Background />
          <Controls />
          {nodes.map((node) => (
            <Textnode
              key={node.id}
              id={node.id}
              data={node.data}
              position={node.position}
              selected={selectedNode && selectedNode.id === node.id}
              isNew={node.isNew} // Pass isNew prop here
            />
          ))}
        </ReactFlow>
      </div>
    </div>
  );
}

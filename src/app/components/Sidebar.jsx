// components/Sidebar.js
import React from "react";
import TextNodeSidebar from "./TextNodeSidebar";

const Sidebar = ({
  nodeText,
  setNodeText,
  selectedNode,
  setSelectedNode,
  onDragStart,
}) => {
  return (
    <div className="w-1/4 border-r border-gray-200 p-4">
      <TextNodeSidebar
        nodeText={nodeText}
        setNodeText={setNodeText}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        onDragStart={onDragStart} // Pass onDragStart here
      />
      {/* Add other sidebar components here if needed */}
    </div>
  );
};

export default Sidebar;

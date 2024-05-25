import React from "react";
import { Handle, Position } from "react-flow-renderer";

const Textnode = ({ id, data, position, selected, isNew }) => {
  return (
    <div
      className={`text-node ${selected ? "selected" : ""} ${
        isNew ? "bg-green-100 border-green-400 text-green-600" : "bg-gray-100 border-gray-400 text-green-600 px-12 py-4"
      } border rounded p-2 shadow-md`}
      style={{ left: position.x, top: position.y, position: "absolute" }}
    >
      <div className="text-node-content">
        <span>{data.label}</span>
      </div>
      <Handle
        type="source" // Make this node a source handle
        position={Position.Right} // Position of the handle
        id={`${id}-out`} // Unique id for the handle
        style={{ background: "#555" }}
      />
      <Handle
        type="target" // Make this node a target handle
        position={Position.Left} // Position of the handle
        id={`${id}-in`} // Unique id for the handle
        style={{ background: "#559" }}
      />
    </div>
  );
};

export default Textnode;

import React from "react";
import { Handle, Position } from "react-flow-renderer";

const Textnode = ({ id, data, position, selected, isNew }) => {
  return (
    <div
      className={`text-node ${selected ? "selected" : ""} ${
        isNew ? "bg-green-100 border-green-400 text-green-600" : "bg-gray-100 border-gray-400 text-green-600 px-12 py-4"
      } border rounded p-2 shadow-md`}
      style={{ position: "absolute", left: position.x, top: position.y }}
    >
      <div className="text-node-content">
        <span>{data.label}</span>
      </div>
      <Handle
        id={`${id}-out`}
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default Textnode;

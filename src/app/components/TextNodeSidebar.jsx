import React, { useState } from "react";
import { MessageSquareText } from "lucide-react";

const TextNodeSidebar = ({ onDragStart }) => {
  const [text, setText] = useState("");

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleDragStart = (event) => {
    // Prevent drag if the input field is empty
    if (!text.trim()) {
      event.preventDefault();
      alert("Please enter text before dragging.");
      return;
    }
    onDragStart(event, text);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl mb-4 text-blue-700">Nodes Panel</h3>
      <div
        className="bg-white p-3 border-solid border-2 border-blue-700 rounded cursor-move flex flex-col justify-center items-center text-blue-700"
        draggable
        onDragStart={handleDragStart}
      >
        <input
          type="text"
          className="border border-blue-500 rounded-md mt-4 px-2 py-1"
          placeholder="Enter text..."
          value={text}
          onChange={handleInputChange}
          required
        />
        <MessageSquareText />
        Message
      </div>
    </div>
  );
};

export default TextNodeSidebar;

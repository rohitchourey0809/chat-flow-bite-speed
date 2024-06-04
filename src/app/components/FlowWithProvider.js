"use client"
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/base.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import TextNode from "./TextNode";

const flowKey = "Nodesdata";

const initialNodes = [
  {
    id: "node_0",
    type: "textnode",
    data: { text: "Text Node" },
    position: { x: 100, y: 5 },
  },
];

let id = 3;
const getId = () => `node_${id++}`;

const FlowWithProvider = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeText, setNodeText] = useState("");
  const [nodeIndex, setNodeIndex] = useState(1); // Initialize nodeIndex

  const nodeTypes = useMemo(
    () => ({
      textnode: TextNode,
    }),
    []
  );

  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            let updatedData = {};
            if (selectedElements[0].type === "textnode") {
              updatedData = {
                ...node.data,
                text: nodeText,
              };
            }
            return {
              ...node,
              data: updatedData,
            };
          }
          return node;
        })
      );
    } else {
      setNodeText(""); // Clear nodeText when no node is selected
    }
  }, [nodeText, selectedElements, setNodes]);

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedElements([node]);
      if (node.type === "textnode") {
        setNodeText(node.data.text);
      }
      setNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
    },
    [setNodes]
  );

  const { setViewport } = useReactFlow();

  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );
    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();
      if (nodes.length > 0 && (emptyTargetHandles > 0 || isNodeUnconnected())) {
        toast.error(
          "Error: More than one node has an empty target handle or there are unconnected nodes."
        );
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        toast.success("Save successful!"); // Provide feedback when save is successful
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
    toast.success("Restore successful!"); // Provide feedback when restore is successful
  }, [setNodes, setViewport, setEdges]);

  const onConnect = useCallback(
    (params) => {
      const { source, sourceHandle } = params;
      const isSourceHandleOccupied = edges.some(
        (edge) => edge.source === source && edge.sourceHandle === sourceHandle
      );
      if (isSourceHandleOccupied) {
        toast.error(
          "Source handle already occupied. Please click on save button"
        );
        return;
      }
      console.log("Edge created: ", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, edges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          label: `${type === "textnode" ? `Text Node ${nodeIndex}` : null}`,
          text: type === "textnode" ? `Text Node ${nodeIndex}` : undefined,
          index: nodeIndex, // Assign the current node index
        },
      };
      setNodeIndex((prevIndex) => prevIndex + 1); // Increment the index
      console.log("Node created with ID: ", newNode.id);
      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, setNodes, nodeIndex]
  );

  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  return (
    <div className="flex flex-row min-h-screen lg:flex-row">
      <ToastContainer />
      <div className="flex-grow h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={rfStyle}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedElements([]); // Reset selected elements when clicking on pane
            setNodes((nodes) =>
              nodes.map((n) => ({
                ...n,
                selected: false, // Reset selected state of nodes when clicking on pane
              }))
            );
          }}
          fitView
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
          <MiniMap zoomable pannable />
          <Panel>
            <button
              className=" m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={onSave}
            >
              save flow
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={onRestore}
            >
              restore flow
            </button>
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
        nodeText={nodeText}
        setNodeText={setNodeText}
      />
    </div>
  );
};

function ChatProvider() {
  return (
    <ReactFlowProvider>
      <FlowWithProvider />
    </ReactFlowProvider>
  );
}

export default ChatProvider;

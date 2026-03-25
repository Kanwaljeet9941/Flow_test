// submit.js

import { useStore } from "./store";
import { useShallow } from "zustand/react/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

// Build the flow graph (positions + minimal data)
const buildFlow = (nodes, edges) => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: { messageId: node.id },
    position: node.position,
  })),
  edges: edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? null,
    targetHandle: edge.targetHandle ?? null,
  })),
});

// Determine which node triggers this one (first incoming edge source)
const getTriggerMessageId = (nodeId, edges) => {
  const incoming = edges.find((e) => e.target === nodeId);
  return incoming ? incoming.source : "";
};

// Build content array from node data based on type
const buildContent = (node) => {
  const { data, type } = node;
  switch (type) {
    case "customInput":
      return [
        {
          fieldType: data.inputType || "Text",
          name: data.name || "",
          value: data.inputType === "File" ? (data.file || "") : (data.value || ""),
        },
      ];
    case "customOutput":
      return [
        {
          fieldType: data.outputType || "Text",
          name: data.name || "",
        },
      ];
    case "text":
      return [{ text: data.text || "" }];
    case "llm":
      return [{ model: "default" }];
    default:
      return [];
  }
};

// Build flowMessage list (one message per node)
const buildFlowMessages = (nodes, edges) =>
  nodes.map((node) => ({
    messageId: node.id,
    type: node.type,
    triggerMessageId: getTriggerMessageId(node.id, edges),
    defaultTriggerMessageId: getTriggerMessageId(node.id, edges),
    content: buildContent(node),
  }));

export const SubmitButton = () => {
  const { nodes, edges } = useStore(useShallow(selector));

  const handleSubmit = async () => {
    const payload = {
      flow: buildFlow(nodes, edges),
      flowMessage: buildFlowMessages(nodes, edges),
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("http://localhost:8000/pipelines/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Response:", result);
      alert(`Pipeline submitted! Nodes: ${payload.flow.nodes.length}, Edges: ${payload.flow.edges.length}`);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to submit pipeline. Is the backend running?");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

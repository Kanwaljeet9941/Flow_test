// nodes/textNode.js

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useUpdateNodeInternals } from "reactflow";
import BaseNode from "./baseNode";
import { useStore } from "../store";

// Extract variables like {{variableName}}
const extractVariables = (text) => {
  const regex = /\{\{(\s*\w+\s*)\}\}/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((m) => m[1].trim());
};

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || "");
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  // Dynamic variables → handles (derived synchronously)
  const inputs = useMemo(() => {
    const vars = extractVariables(text);
    return vars.map((v) => ({ id: v }));
  }, [text]);

  // Notify React Flow when handles change
  useEffect(() => {
    updateNodeInternals(id);
  }, [inputs, id, updateNodeInternals]);

  // Auto resize + sync text to store
  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    updateNodeField(id, "text", newText);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <BaseNode id={id} title="Text" inputs={inputs} outputs={[{ id: "output" }]}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Enter text with {{variables}}"
        style={{
          width: "100%",
          minHeight: "50px",
          resize: "none",
        }}
      />
    </BaseNode>
  );
};

// nodes/textNode.js

import React, { useState, useEffect, useRef } from "react";
import BaseNode from "./baseNode";

// Extract variables like {{input}}
const extractVariables = (text) => {
  const regex = /{{(.*?)}}/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((m) => m[1].trim());
};

export const TextNode = ({ data }) => {
  const [text, setText] = useState(data?.text || "");
  const [inputs, setInputs] = useState([]);
  const textareaRef = useRef(null);

  // Dynamic variables → handles
  useEffect(() => {
    const vars = extractVariables(text);
    setInputs(vars.map((v) => ({ id: v })));
  }, [text]);

  // Auto resize
  const handleChange = (e) => {
    setText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <BaseNode title="Text" inputs={inputs} outputs={[{ id: "output" }]}>
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

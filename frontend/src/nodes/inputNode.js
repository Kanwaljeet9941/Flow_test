// nodes/inputNode.js

import React from "react";
import BaseNode from "./baseNode";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode id={id} title="Input" outputs={[{ id: "output" }]}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={data?.name || ""}
          onChange={(e) => updateNodeField(id, "name", e.target.value)}
        />
      </div>

      <div>
        <label>Type:</label>
        <select
          value={data?.inputType || "Text"}
          onChange={(e) => updateNodeField(id, "inputType", e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>

      {(data?.inputType || "Text") === "Text" ? (
        <div>
          <label>Value:</label>
          <input
            type="text"
            value={data?.value || ""}
            onChange={(e) => updateNodeField(id, "value", e.target.value)}
          />
        </div>
      ) : (
        <div>
          <label>File:</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              updateNodeField(id, "file", file ? file.name : "");
            }}
          />
        </div>
      )}
    </BaseNode>
  );
};

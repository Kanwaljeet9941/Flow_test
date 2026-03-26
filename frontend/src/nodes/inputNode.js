// nodes/inputNode.js

import React from "react";
import BaseNode from "./baseNode";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode id={id} title="Input" outputs={[{ id: "output" }]}>
      <div className="field">
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter input name..."
          value={data?.name || ""}
          onChange={(e) => updateNodeField(id, "name", e.target.value)}
        />
      </div>

      <div className="field">
        <label>Type</label>
        <select
          value={data?.inputType || "Text"}
          onChange={(e) => updateNodeField(id, "inputType", e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>

      {(data?.inputType || "Text") === "Text" ? (
        <div className="field">
          <label>Value</label>
          <input
            type="text"
            placeholder="Enter value..."
            value={data?.value || ""}
            onChange={(e) => updateNodeField(id, "value", e.target.value)}
          />
        </div>
      ) : (
        <div className="field">
          <label>Upload File</label>

          <label className="file-upload">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                updateNodeField(id, "fileName", file.name);
                updateNodeField(id, "fileType", file.type);

                const reader = new FileReader();
                reader.onload = () => {
                  updateNodeField(id, "fileData", reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
            <span>Choose File</span>
          </label>

          {data?.fileName && <div className="file-name">{data.fileName}</div>}
        </div>
      )}
    </BaseNode>
  );
};

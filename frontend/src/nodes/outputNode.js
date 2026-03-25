// nodes/outputNode.js

import React from "react";
import BaseNode from "./baseNode";
import { useStore } from "../store";

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode id={id} title="Output" inputs={[{ id: "input" }]}>
      <div>
        <label>Type:</label>
        <select
          value={data?.outputType || "Text"}
          onChange={(e) => updateNodeField(id, "outputType", e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};

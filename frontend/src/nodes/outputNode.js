// nodes/outputNode.js

import React from "react";
import BaseNode from "./baseNode";

export const OutputNode = ({ data }) => {
  return (
    <BaseNode title="Output" inputs={[{ id: "input" }]}>
      <div>
        <label>Name:</label>
        <input type="text" value={data?.name || ""} onChange={() => {}} />
      </div>

      <div>
        <label>Type:</label>
        <select defaultValue="Text">
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};

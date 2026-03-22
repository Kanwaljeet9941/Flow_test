// nodes/inputNode.js

import React from "react";
import BaseNode from "./baseNode";

export const InputNode = ({ data }) => {
  return (
    <BaseNode title="Input" outputs={[{ id: "output" }]}>
      <div>
        <label>Name:</label>
        <input type="text" value={data?.name || ""} onChange={() => {}} />
      </div>

      <div>
        <label>Type:</label>
        <select defaultValue="Text">
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};

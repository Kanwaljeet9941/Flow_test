// nodes/llmNode.js

import React from "react";
import BaseNode from "./baseNode";

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      inputs={[{ id: "input" }]}
      outputs={[{ id: "output" }]}
    >
      <div>This is an LLM</div>
    </BaseNode>
  );
};

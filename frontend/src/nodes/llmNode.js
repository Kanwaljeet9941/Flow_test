// nodes/llmNode.js

import React from "react";
import BaseNode from "./baseNode";

export const LLMNode = () => {
  return (
    <BaseNode
      title="LLM"
      inputs={[{ id: "input" }]}
      outputs={[{ id: "output" }]}
    >
      <div>This is an LLM</div>
    </BaseNode>
  );
};

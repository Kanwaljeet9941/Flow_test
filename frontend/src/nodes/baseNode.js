import React from "react";
import { Handle, Position } from "reactflow";

const BaseNode = ({ title, inputs = [], outputs = [], children }) => {
  return (
    <div className="node">
      <div className="node-header">{title}</div>

      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ top: 40 + index * 20 }}
        />
      ))}

      <div className="node-body">{children}</div>

      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ top: 40 + index * 20 }}
        />
      ))}
    </div>
  );
};

export default BaseNode;

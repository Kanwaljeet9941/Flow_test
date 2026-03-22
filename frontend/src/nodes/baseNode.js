import { Handle, Position } from "reactflow";

const BaseNode = ({ title, inputs = [], outputs = [], children }) => {
  return (
    <div className="node-container">
      {/* Header */}
      <div className="node-header">{title}</div>

      {/* Input Handles (Left) */}
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ top: 40 + index * 25 }}
        />
      ))}

      {/* Content */}
      <div className="node-body">{children}</div>

      {/* Output Handles (Right) */}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ top: 40 + index * 25 }}
        />
      ))}
    </div>
  );
};

export default BaseNode;

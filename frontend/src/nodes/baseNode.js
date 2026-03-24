import { Handle, Position } from "reactflow";
import { useStore } from "../store";

const BaseNode = ({ id, title, inputs = [], outputs = [], children }) => {
  const deleteNode = useStore((state) => state.deleteNode);

  return (
    <div className="node-container">
      {/* Header + Delete */}
      <div className="node-header">
        {title}
        <button
          className="node-delete-btn"
          onClick={() => deleteNode(id)}
          title="Delete node"
        >
          ×
        </button>
      </div>

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

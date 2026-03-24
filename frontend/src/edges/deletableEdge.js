import React from "react";
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "reactflow";
import { useStore } from "../store";

export const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}) => {
  const deleteEdge = useStore((state) => state.deleteEdge);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <button className="edge-delete-btn" onClick={() => deleteEdge(id)}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

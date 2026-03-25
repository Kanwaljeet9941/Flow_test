// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

// Extract {{variableName}} patterns from text
const extractVariables = (text) => {
  const regex = /\{\{(\s*\w+\s*)\}\}/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((m) => m[1].trim());
};

// DFS-based cycle detection: returns true if adding source→target creates a cycle
const hasCycle = (edges, source, target) => {
  const adjacency = {};
  for (const edge of edges) {
    if (!adjacency[edge.source]) adjacency[edge.source] = [];
    adjacency[edge.source].push(edge.target);
  }
  // Add the proposed edge
  if (!adjacency[source]) adjacency[source] = [];
  adjacency[source].push(target);

  const visited = new Set();
  const inStack = new Set();

  const dfs = (node) => {
    if (inStack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    inStack.add(node);
    for (const neighbor of adjacency[node] || []) {
      if (dfs(neighbor)) return true;
    }
    inStack.delete(node);
    return false;
  };

  return dfs(source);
};

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      // Filter out any "add" changes that bypass onConnect validation
      const safeChanges = changes.filter((change) => {
        if (change.type === 'add' && change.item) {
          const { source, target, targetHandle } = change.item;
          const { nodes } = get();
          const targetNode = nodes.find((n) => n.id === target);
          if (targetNode?.type === 'text') {
            const text = targetNode.data?.text || '';
            const variables = extractVariables(text);
            if (!variables.includes(targetHandle)) return false;
          }
        }
        return true;
      });
      set({
        edges: applyEdgeChanges(safeChanges, get().edges),
      });
    },
    onConnect: (connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;
      const { nodes, edges } = get();

      // 1. Prevent self-loops
      if (source === target) {
        console.warn('Connection rejected: self-loop');
        return;
      }

      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);
      if (!sourceNode || !targetNode) return;

      // 2. Node-type rules
      if (sourceNode.type === 'customOutput') {
        console.warn('Connection rejected: Output nodes cannot be a source');
        return;
      }
      if (targetNode.type === 'customInput') {
        console.warn('Connection rejected: Input nodes cannot be a target');
        return;
      }

      // 3. Text node variable validation
      if (targetNode.type === 'text') {
        const text = targetNode.data?.text || '';
        const variables = extractVariables(text);
        if (variables.length === 0) {
          console.warn('Connection rejected: Text node has no variables');
          return;
        }
        if (!variables.includes(targetHandle)) {
          console.warn(`Connection rejected: "${targetHandle}" is not a valid variable handle`);
          return;
        }
      }

      // 4. Prevent duplicate edges (same source, target, and handles)
      const isDuplicate = edges.some(
        (e) =>
          e.source === source &&
          e.target === target &&
          e.sourceHandle === sourceHandle &&
          e.targetHandle === targetHandle
      );
      if (isDuplicate) {
        console.warn('Connection rejected: duplicate edge');
        return;
      }

      // 5. Prevent multiple connections to the same target handle
      const handleOccupied = edges.some(
        (e) => e.target === target && e.targetHandle === targetHandle
      );
      if (handleOccupied) {
        console.warn(`Connection rejected: handle "${targetHandle}" is already connected`);
        return;
      }

      // 6. Cycle detection
      if (hasCycle(edges, source, target)) {
        console.warn('Connection rejected: would create a cycle');
        return;
      }

      // 7. Add valid edge
      set({
        edges: addEdge(
          {
            ...connection,
            type: 'deletable',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          edges,
        ),
      });
    },
    deleteNode: (nodeId) => {
      set({
        nodes: get().nodes.filter((n) => n.id !== nodeId),
        edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      });
    },
    deleteEdge: (edgeId) => {
      set({
        edges: get().edges.filter((e) => e.id !== edgeId),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, [fieldName]: fieldValue } };
          }
          return node;
        }),
      });

      // Clean up stale edges when text node variables change
      if (fieldName === 'text') {
        const variables = extractVariables(fieldValue);
        set({
          edges: get().edges.filter((edge) => {
            if (edge.target === nodeId && edge.targetHandle) {
              return variables.includes(edge.targetHandle);
            }
            return true;
          }),
        });
      }
    },
  }));

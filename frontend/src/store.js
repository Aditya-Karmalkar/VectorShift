
import { create } from "zustand";
import { persist } from 'zustand/middleware';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    updateEdge,
    MarkerType,
} from 'reactflow';

const nodeColors = {
  customInput: '#8b5cf6',
  llm: '#3b82f6',
  customOutput: '#ef4444',
  text: '#10b981',
  api: '#f59e0b',
  filter: '#06b6d4',
  transform: '#8b5cf6',
  database: '#14b8a6',
  chart: '#ec4899',
};

export const useStore = create(
  persist(
    (set, get) => ({
        nodes: [],
        edges: [],
        nodeIDs: {},
        past: [],
        future: [],

        takeSnapshot: () => {
            const state = get();
            set({
                past: [...state.past, { nodes: state.nodes, edges: state.edges }],
                future: []
            });
        },

        undo: () => {
            const state = get();
            if (state.past.length === 0) return;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            set({
                past: newPast,
                future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
                nodes: previous.nodes,
                edges: previous.edges,
            });
        },

        redo: () => {
            const state = get();
            if (state.future.length === 0) return;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            set({
                past: [...state.past, { nodes: state.nodes, edges: state.edges }],
                future: newFuture,
                nodes: next.nodes,
                edges: next.edges,
            });
        },

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
            get().takeSnapshot();
            set({
                nodes: [...get().nodes, node]
            });
        },

        onNodesChange: (changes) => {
            const isMeaningful = changes.some(c => c.type === 'remove' || c.type === 'add' || (c.type === 'position' && c.dragging === false));
            if (isMeaningful) get().takeSnapshot();
            
            set({
                nodes: applyNodeChanges(changes, get().nodes),
            });
        },

        onEdgesChange: (changes) => {
            const isMeaningful = changes.some(c => c.type === 'remove' || c.type === 'add');
            if (isMeaningful) get().takeSnapshot();

            set({
                edges: applyEdgeChanges(changes, get().edges),
            });
        },

        onConnect: (connection) => {
            get().takeSnapshot();
            const sourceNode = get().nodes.find(n => n.id === connection.source);
            const edgeColor = sourceNode ? nodeColors[sourceNode.type] : '#b1b1b7';
            
            const newEdge = {
                ...connection, 
                type: 'smoothstep', 
                animated: true, 
                style: { stroke: edgeColor, strokeWidth: 2 },
                markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px', color: edgeColor}
            };

            set({
                edges: addEdge(newEdge, get().edges),
            });
        },

        onEdgeUpdate: (oldEdge, newConnection) => {
            get().takeSnapshot();
            let updatedEdges = updateEdge(oldEdge, newConnection, get().edges);
            
            updatedEdges = updatedEdges.map(edge => {
                if (edge.id === oldEdge.id) {
                    const sourceNode = get().nodes.find(n => n.id === edge.source);
                    const edgeColor = sourceNode ? nodeColors[sourceNode.type] : '#b1b1b7';
                    return {
                        ...edge,
                        style: { ...edge.style, stroke: edgeColor, strokeWidth: 2 },
                        markerEnd: { ...edge.markerEnd, color: edgeColor }
                    };
                }
                return edge;
            });

            set({ edges: updatedEdges });
        },

        removeNode: (nodeId) => {
            get().takeSnapshot();
            get().onNodesChange([{ id: nodeId, type: 'remove' }]);
        },

        updateNodeField: (nodeId, fieldName, fieldValue) => {
            get().takeSnapshot();
            set({
                nodes: get().nodes.map((node) => {
                    if (node.id === nodeId) {
                        node.data = { ...node.data, [fieldName]: fieldValue };
                    }
                    return node;
                }),
            });
        },
    }),
    {
        name: 'vectorshift-pipeline-storage',
        partialize: (state) => ({ nodes: state.nodes, edges: state.edges, nodeIDs: state.nodeIDs }),
    }
  )
);

import { useState } from 'react';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

function PipelineResultModal({ result, open, onOpenChange }) {
  if (!result) return null;
  const { num_nodes, num_edges, is_dag } = result;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-slate-200">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Pipeline Analysis
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-500 font-mono mt-1">
            Submitted to /pipelines/parse
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="flex flex-col px-4 py-4 gap-3 bg-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">N</div>
              <span className="text-sm font-semibold text-slate-700">Total Nodes</span>
            </div>
            <span className="text-xl font-black text-cyan-500">{num_nodes}</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">E</div>
              <span className="text-sm font-semibold text-slate-700">Total Edges</span>
            </div>
            <span className="text-xl font-black text-purple-500">{num_edges}</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border shadow-sm ${
              is_dag ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                is_dag ? 'bg-emerald-200 text-emerald-700' : 'bg-red-200 text-red-700'
              }`}>
                {is_dag ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-semibold ${is_dag ? 'text-emerald-800' : 'text-red-800'}`}>
                  {is_dag ? 'Valid DAG' : 'Cycle Detected'}
                </span>
                <span className={`text-[10px] ${is_dag ? 'text-emerald-600' : 'text-red-600'}`}>
                  {is_dag ? 'No circular dependencies' : 'Not safe to execute'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">
            VectorShift Technical Assessment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const isDAG = (nodes, edges) => {
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        if (adj[e.source]) {
            adj[e.source].push(e.target);
        }
    });

    const visited = new Set();
    const recStack = new Set();

    const hasCycle = (nodeId) => {
        if (recStack.has(nodeId)) return true;
        if (visited.has(nodeId)) return false;

        visited.add(nodeId);
        recStack.add(nodeId);

        const neighbors = adj[nodeId] || [];
        for (let i = 0; i < neighbors.length; i++) {
            if (hasCycle(neighbors[i])) return true;
        }

        recStack.delete(nodeId);
        return false;
    };

    for (let i = 0; i < nodes.length; i++) {
        if (hasCycle(nodes[i].id)) return false;
    }
    return true;
};

export const SubmitButton = () => {
  const { nodes, edges } = useStore(useShallow(selector));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const liveIsDag = nodes.length > 0 ? isDAG(nodes, edges) : true;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert(`Error: ${err.message}\n\nMake sure the backend is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-bar">
        <div className="pipeline-stats">
          <div className="stat-item">
            <span>Nodes:</span>
            <span className="stat-value">{nodes.length}</span>
          </div>
          <div className="stat-item">
            <span>Edges:</span>
            <span className="stat-value">{edges.length}</span>
          </div>
          {nodes.length > 0 && (
            <div className="stat-item" style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', background: liveIsDag ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)', color: liveIsDag ? '#34d399' : '#f87171', fontWeight: 600, fontSize: '11px', border: `1px solid ${liveIsDag ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'}` }}>
              {liveIsDag ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              {liveIsDag ? 'Valid DAG' : 'Cycle Detected'}
            </div>
          )}
        </div>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading || nodes.length === 0}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <span className="submit-btn-icon"><Play size={16} fill="currentColor" /></span>
              Run Pipeline
            </>
          )}
        </button>
      </div>

      <PipelineResultModal 
        result={result} 
        open={!!result} 
        onOpenChange={(open) => { if (!open) setResult(null) }} 
      />
    </>
  );
};

import { useState, useEffect, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { Type } from 'lucide-react';
import { useStore } from '../store';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

function extractVariables(text) {
  const vars = [];
  const seen = new Set();
  let match;
  VARIABLE_REGEX.lastIndex = 0;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      vars.push(name);
    }
  }
  return vars;
}

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const textareaRef = useRef(null);
  const [size, setSize] = useState({ width: 220, height: 'auto' });
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    const vars = extractVariables(currText);
    setVariables(vars);
  }, [currText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollH + 'px';
      const lines = currText.split('\n');
      const maxLen = Math.max(...lines.map((l) => l.length), 10);
      const newWidth = Math.min(Math.max(220, maxLen * 8.5 + 40), 500);
      setSize({ width: newWidth });
    }
  }, [currText]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setCurrText(val);
    updateNodeField(id, 'text', val);
  };

  const inputs = variables.map((varName, i) => {
    const topPct = variables.length === 1 ? 50 : 30 + (i / (variables.length - 1)) * 40;
    return {
      id: varName,
      label: varName,
      style: { top: `${topPct}%` },
    };
  });

  return (
    <BaseNode
      id={id}
      title="Text"
      icon={<Type size={20} />}
      accentColor="#10b981"
      inputs={inputs}
      outputs={[{ id: 'output', label: 'Output' }]}
      style={{ width: size.width, minWidth: 220 }}
    >
      <div className="node-field">
        <label className="node-field-label">
          Content
          {variables.length > 0 && (
            <span className="var-badge" style={{ marginLeft: 6 }}>{variables.length} var{variables.length > 1 ? 's' : ''}</span>
          )}
        </label>
        <textarea
          ref={textareaRef}
          className="node-textarea"
          value={currText}
          onChange={handleTextChange}
          style={{ resize: 'none', overflow: 'hidden', minHeight: 60 }}
          placeholder="Type text… use {{variable}} to create inputs"
        />
      </div>
      {variables.length > 0 && (
        <div className="var-list">
          {variables.map((v) => (
            <span key={v} className="var-chip">{'{{' + v + '}}'}</span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

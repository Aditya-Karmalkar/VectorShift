import { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';
import { Upload, Download, FileText } from 'lucide-react';

/**
 * BaseNode - Reusable abstraction for all pipeline nodes
 *
 * @param {string} id - Node ID
 * @param {string} title - Node title shown in header
 * @param {string} icon - Emoji or icon character for the node
 * @param {string} accentColor - CSS color for the node accent/border
 * @param {Array} fields - Array of field definitions to render
 * @param {Array} inputs - Array of input handle definitions: { id, label, style }
 * @param {Array} outputs - Array of output handle definitions: { id, label, style }
 * @param {ReactNode} children - Custom content rendered below fields
 * @param {Object} style - Additional styles for the node container
 */
export const BaseNode = ({
  id,
  title,
  icon = '⚙️',
  accentColor = '#6366f1',
  fields = [],
  inputs = [],
  outputs = [],
  children,
  style = {},
}) => {
  const removeNode = useStore((state) => state.removeNode);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(id);
  }, [inputs.length, outputs.length, id, updateNodeInternals]);

  const handleDownload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="base-node" style={{ '--accent': accentColor, ...style }}>

      {inputs.map((handle, i) => (
        <div key={handle.id} className="handle-wrapper handle-left" style={handle.style}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            className="node-handle node-handle-input"
          />
          {handle.label && (
            <span className="handle-label handle-label-left">{handle.label}</span>
          )}
        </div>
      ))}


      {outputs.map((handle, i) => (
        <div key={handle.id} className="handle-wrapper handle-right" style={handle.style}>
          {handle.label && (
            <span className="handle-label handle-label-right">{handle.label}</span>
          )}
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            className="node-handle node-handle-output"
          />
        </div>
      ))}


      <div className="node-header">
        <div className="node-icon-wrapper">
          {icon}
        </div>
        <div className="node-title-container">
          <span className="node-title">{title}</span>
          <span className="node-subtitle">Node</span>
        </div>
        <button className="node-delete-btn" onClick={() => removeNode(id)} title="Delete node">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>


      <div className="node-body">
        {fields.map((field, index) => (
          <div key={field.name} className="node-field">
            <label className="node-field-label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="node-select"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {field.options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className="node-textarea"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                rows={field.rows || 3}
                style={field.textareaStyle}
              />
            ) : field.type === 'file' ? (
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id={`file-${id}-${index}`}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      field.onChange(e.target.files[0]);
                    }
                  }}
                  accept={field.accept}
                />
                <label htmlFor={`file-${id}-${index}`} className="file-upload-btn">
                  <Upload size={14} /> {field.value ? 'Replace File' : 'Upload File'}
                </label>
                {field.value && (
                  <div className="file-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={12} className="text-muted" />
                      <span className="file-name">{field.value.name}</span>
                    </div>
                    <button 
                      className="file-action-btn" 
                      onClick={() => handleDownload(field.value)}
                      title="Download file"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                className="node-input"
                type={field.type || 'text'}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        {children}
      </div>
    </div>
  );
};

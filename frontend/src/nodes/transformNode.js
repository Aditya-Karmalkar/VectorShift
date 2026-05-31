import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { Zap } from 'lucide-react';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
  const [script, setScript] = useState(data?.script || 'return data.map(x => x * 2);');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleScriptChange = (val) => {
    setScript(val);
    updateNodeField(id, 'script', val);
  };

  const fields = [
    {
      name: 'script',
      label: 'Transform Script',
      type: 'textarea',
      value: script,
      onChange: handleScriptChange,
      rows: 4,
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Transform"
      icon={<Zap size={20} />}
      accentColor="#8b5cf6"
      fields={fields}
      inputs={[{ id: 'input', label: 'Data In' }]}
      outputs={[{ id: 'output', label: 'Data Out' }]}
    >
      <div className="node-description">
        Applies a custom Javascript transformation to the data.
      </div>
    </BaseNode>
  );
};

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { Database } from 'lucide-react';
import { useStore } from '../store';

export const DatabaseNode = ({ id, data }) => {
  const [query, setQuery] = useState(data?.query || 'SELECT * FROM users');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleQueryChange = (val) => {
    setQuery(val);
    updateNodeField(id, 'query', val);
  };

  const fields = [
    {
      name: 'query',
      label: 'SQL Query',
      type: 'text',
      value: query,
      onChange: handleQueryChange,
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Database"
      icon={<Database size={20} />}
      accentColor="#14b8a6"
      fields={fields}
      inputs={[{ id: 'trigger', label: 'Trigger' }]}
      outputs={[{ id: 'result', label: 'Result' }]}
    />
  );
};

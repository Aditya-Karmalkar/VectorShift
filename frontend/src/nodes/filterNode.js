import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { Filter } from 'lucide-react';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'x > 10');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleConditionChange = (val) => {
    setCondition(val);
    updateNodeField(id, 'condition', val);
  };

  const fields = [
    {
      name: 'condition',
      label: 'Condition',
      type: 'text',
      value: condition,
      onChange: handleConditionChange,
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Filter"
      icon={<Filter size={20} />}
      accentColor="#f59e0b"
      fields={fields}
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[
        { id: 'true', label: 'True' },
        { id: 'false', label: 'False' },
      ]}
    />
  );
};

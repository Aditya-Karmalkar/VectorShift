import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { Globe } from 'lucide-react';
import { useStore } from '../store';

export const ApiNode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleMethodChange = (val) => {
    setMethod(val);
    updateNodeField(id, 'method', val);
  };

  const handleUrlChange = (val) => {
    setUrl(val);
    updateNodeField(id, 'url', val);
  };

  const fields = [
    {
      name: 'method',
      label: 'Method',
      type: 'select',
      value: method,
      onChange: handleMethodChange,
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
      ],
    },
    {
      name: 'url',
      label: 'Endpoint',
      type: 'text',
      value: url,
      onChange: handleUrlChange,
    },
  ];

  return (
    <BaseNode
      id={id}
      title="API Request"
      icon={<Globe size={20} />}
      accentColor="#0ea5e9"
      fields={fields}
      inputs={[{ id: 'trigger', label: 'Trigger' }]}
      outputs={[{ id: 'response', label: 'Response' }]}
    />
  );
};

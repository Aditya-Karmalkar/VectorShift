import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { ArrowRightToLine } from 'lucide-react';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const [file, setFile] = useState(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (val) => {
    setCurrName(val);
    updateNodeField(id, 'inputName', val);
  };

  const handleTypeChange = (val) => {
    setInputType(val);
    updateNodeField(id, 'inputType', val);
  };

  const handleFileChange = (val) => {
    setFile(val);
    updateNodeField(id, 'file', val);
  };

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      value: currName,
      onChange: handleNameChange,
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      value: inputType,
      onChange: handleTypeChange,
      options: [
        { label: 'Text', value: 'Text' },
        { label: 'File', value: 'File' },
      ],
    },
  ];

  if (inputType === 'File') {
    fields.push({
      name: 'file',
      label: 'Upload File',
      type: 'file',
      value: file,
      onChange: handleFileChange,
    });
  }

  return (
    <BaseNode
      id={id}
      title="Input"
      icon={<ArrowRightToLine size={20} />}
      accentColor="#8b5cf6"
      fields={fields}
      outputs={[{ id: 'value', label: 'Output' }]}
    />
  );
};

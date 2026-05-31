import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { ArrowLeftFromLine } from 'lucide-react';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const [image, setImage] = useState(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (val) => {
    setCurrName(val);
    updateNodeField(id, 'outputName', val);
  };

  const handleTypeChange = (val) => {
    setOutputType(val);
    updateNodeField(id, 'outputType', val);
  };

  const handleImageChange = (val) => {
    setImage(val);
    updateNodeField(id, 'image', val);
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
      value: outputType,
      onChange: handleTypeChange,
      options: [
        { label: 'Text', value: 'Text' },
        { label: 'Image', value: 'Image' },
      ],
    },
  ];

  if (outputType === 'Image') {
    fields.push({
      name: 'image',
      label: 'Upload Image',
      type: 'file',
      accept: 'image/*',
      value: image,
      onChange: handleImageChange,
    });
  }

  return (
    <BaseNode
      id={id}
      title="Output"
      icon={<ArrowLeftFromLine size={20} />}
      accentColor="#ef4444"
      fields={fields}
      inputs={[{ id: 'value', label: 'Input' }]}
    />
  );
};

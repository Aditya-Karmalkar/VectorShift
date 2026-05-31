
import { BaseNode } from './BaseNode';
import { Brain } from 'lucide-react';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      icon={<Brain size={20} />}
      accentColor="#34d399"
      inputs={[
        { id: 'system', label: 'System', style: { top: '33%' } },
        { id: 'prompt', label: 'Prompt', style: { top: '66%' } },
      ]}
      outputs={[{ id: 'response', label: 'Response' }]}
    >
      <div className="node-description">
        Generates text using a large language model.
      </div>
    </BaseNode>
  );
};

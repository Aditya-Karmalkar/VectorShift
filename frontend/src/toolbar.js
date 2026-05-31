

import { DraggableNode } from './draggableNode';
import { ArrowRightToLine, Brain, ArrowLeftFromLine, Type, Globe, Filter, Zap, Database, BarChart } from 'lucide-react';

export const PipelineToolbar = () => {
    return (
        <div className="toolbar">
            <div className="toolbar-section">
                <div className="toolbar-section-title">Nodes</div>
                <div className="toolbar-nodes">
                    <DraggableNode type='customInput' label='Input' icon={<ArrowRightToLine size={16} />} />
                    <DraggableNode type='llm' label='LLM' icon={<Brain size={16} />} />
                    <DraggableNode type='customOutput' label='Output' icon={<ArrowLeftFromLine size={16} />} />
                    <DraggableNode type='text' label='Text' icon={<Type size={16} />} />
                    <div className="toolbar-divider" />
                    <DraggableNode type='api' label='API Request' icon={<Globe size={16} />} />
                    <DraggableNode type='filter' label='Filter' icon={<Filter size={16} />} />
                    <DraggableNode type='transform' label='Transform' icon={<Zap size={16} />} />
                    <DraggableNode type='database' label='Database' icon={<Database size={16} />} />
                    <DraggableNode type='chart' label='Chart' icon={<BarChart size={16} />} />
                </div>
            </div>
        </div>
    );
};

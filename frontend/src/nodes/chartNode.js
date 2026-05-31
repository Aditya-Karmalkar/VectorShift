import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { BarChart as BarIcon, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';

const dummyData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 300 },
  { name: 'D', value: 200 },
];
const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'];

export const ChartNode = ({ id, data }) => {
  const [chartType, setChartType] = useState(data?.chartType || 'bar');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleChartTypeChange = (val) => {
    setChartType(val);
    updateNodeField(id, 'chartType', val);
  };

  const fields = [
    {
      name: 'chartType',
      label: 'Chart Type',
      type: 'select',
      value: chartType,
      onChange: handleChartTypeChange,
      options: [
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Line Chart', value: 'line' },
        { label: 'Pie Chart', value: 'pie' },
      ],
    },
  ];

  let Icon = BarIcon;
  if (chartType === 'line') Icon = LineIcon;
  if (chartType === 'pie') Icon = PieIcon;

  return (
    <BaseNode
      id={id}
      title="Chart"
      icon={<Icon size={20} />}
      accentColor="#ec4899"
      fields={fields}
      inputs={[{ id: 'data', label: 'Data' }]}
      outputs={[{ id: 'chart', label: 'Visualization' }]}
    >
      <div className="chart-preview" style={{ marginTop: '10px', height: '120px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '6px', padding: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={dummyData}>
              <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={dummyData}>
              <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: "#ec4899" }} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={dummyData} cx="50%" cy="50%" innerRadius={20} outerRadius={40} paddingAngle={5} dataKey="value">
                {dummyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </BaseNode>
  );
};

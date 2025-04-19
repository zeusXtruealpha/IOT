import { useMemo } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis, ReferenceLine } from 'recharts';
import type { MLModel } from '@/services/mlModels';

interface ModelPerformanceChartProps {
  model: MLModel;
  chartType?: 'comparison' | 'scatter' | 'metrics';
}

export function ModelPerformanceChart({ model, chartType = 'comparison' }: ModelPerformanceChartProps) {
  // Prepare metrics data for the bar chart
  const metricsData = useMemo(() => {
    return [
      { name: 'Accuracy', value: model.accuracy * 100, fill: '#0EA5E9' },
      { name: 'Precision', value: model.precision * 100, fill: '#10B981' },
      { name: 'Recall', value: model.recall * 100, fill: '#F59E0B' },
      { name: 'F1 Score', value: model.f1Score * 100, fill: '#8B5CF6' }
    ];
  }, [model]);

  // Prepare comparison data for the line chart
  const comparisonData = useMemo(() => {
    if (!model.performanceGraph || !model.performanceGraph.labels) {
      return [];
    }
    return model.performanceGraph.labels.map((label, index) => ({
      name: label,
      actual: model.performanceGraph.actual[index] || 0,
      predicted: model.performanceGraph.predicted[index] || 0
    }));
  }, [model]);

  // Prepare scatter plot data
  const scatterData = useMemo(() => {
    if (!model.performanceGraph || !model.performanceGraph.actual) {
      return [];
    }
    return model.performanceGraph.actual.map((actual, index) => ({
      actual,
      predicted: model.performanceGraph.predicted[index] || 0
    }));
  }, [model]);

  const renderChart = () => {
    switch (chartType) {
      case 'metrics':
        return (
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" />
            <YAxis 
              domain={[0, 100]} 
              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Score']}
              labelFormatter={(label) => label}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Score" 
              fill="#0EA5E9"
              animationDuration={1500}
            />
          </BarChart>
        );

      case 'scatter':
        return (
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              dataKey="actual" 
              name="Actual" 
              label={{ value: 'Actual EC (μS/cm)', position: 'insideBottom', offset: -5 }}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <YAxis 
              type="number" 
              dataKey="predicted" 
              name="Predicted" 
              label={{ value: 'Predicted EC (μS/cm)', angle: -90, position: 'insideLeft' }}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <ZAxis range={[100]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number, name: string) => [`${value} μS/cm`, name]}
              labelFormatter={() => ''}
            />
            <Legend />
            <Scatter 
              name="Actual vs Predicted" 
              data={scatterData} 
              fill="#0EA5E9" 
              shape="circle"
              animationDuration={1500}
            />
            <ReferenceLine 
              y={0} 
              stroke="#000" 
              strokeDasharray="3 3" 
              label="Perfect Prediction"
              segment={[
                { x: Math.min(...scatterData.map(d => d.actual)), y: Math.min(...scatterData.map(d => d.actual)) },
                { x: Math.max(...scatterData.map(d => d.actual)), y: Math.max(...scatterData.map(d => d.actual)) }
              ]}
            />
          </ScatterChart>
        );

      default: // comparison
        return (
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              label={{ value: 'Data Points', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'EC Value (μS/cm)', angle: -90, position: 'insideLeft' }}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [`${value} μS/cm`, name]}
              labelFormatter={(label) => `Point: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Actual Value" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted Value" 
              stroke="#0EA5E9" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1500}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="chart-container p-4 h-[400px]">
      <h3 className="text-lg font-medium mb-4">
        {model.name} Performance - 
        {chartType === 'metrics' ? ' Metrics' : 
         chartType === 'scatter' ? ' Scatter Plot' : ' Comparison'}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
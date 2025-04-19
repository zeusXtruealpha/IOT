
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { ProcessedData } from '@/services/thingspeak';

interface WaterQualityChartProps {
  data: ProcessedData[];
  type?: 'line' | 'area';
  showTemperature?: boolean;
  showEC?: boolean;
  showVoltage?: boolean;
}

export function WaterQualityChart({ 
  data, 
  type = 'line',
  showTemperature = true,
  showEC = true,
  showVoltage = false
}: WaterQualityChartProps) {
  const chartData = useMemo(() => {
    // Use the most recent 20 entries for better visualization
    return [...data].reverse().slice(0, 20).reverse().map(item => ({
      name: item.id.toString(),
      temperature: item.temperature,
      ecValue: item.ecValue,
      voltage: item.voltage
    }));
  }, [data]);

  const renderChart = () => {
    const ecDomain = [0, Math.max(...data.map(d => d.ecValue)) * 1.1 || 1000];
    const tempDomain = [0, Math.max(...data.map(d => d.temperature)) * 1.1 || 50];
    
    if (type === 'area') {
      return (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFB86C" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FFB86C" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEC" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          
          {showTemperature && (
            <YAxis 
              yAxisId="temp" 
              orientation="left" 
              domain={tempDomain} 
              tick={{ fontSize: 12 }} 
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
            />
          )}
          
          {showEC && (
            <YAxis 
              yAxisId="ec" 
              orientation="right" 
              domain={ecDomain} 
              tick={{ fontSize: 12 }} 
              label={{ value: 'EC Value (μS/cm)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }} 
            />
          )}
          
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '8px', border: 'none' }}
          />
          <Legend />
          
          {showTemperature && (
            <Area 
              yAxisId="temp" 
              type="monotone" 
              dataKey="temperature" 
              stroke="#FFB86C" 
              fill="url(#colorTemp)" 
              name="Temperature" 
              activeDot={{ r: 8 }} 
            />
          )}
          
          {showEC && (
            <Area 
              yAxisId="ec" 
              type="monotone" 
              dataKey="ecValue" 
              stroke="#0EA5E9" 
              fill="url(#colorEC)" 
              name="EC Value" 
              activeDot={{ r: 8 }} 
            />
          )}
          
          {showVoltage && (
            <Area 
              yAxisId="ec" 
              type="monotone" 
              dataKey="voltage" 
              stroke="#10B981" 
              fill="url(#colorVoltage)" 
              name="Voltage" 
              activeDot={{ r: 8 }} 
            />
          )}
        </AreaChart>
      );
    }
    
    return (
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        
        {showTemperature && (
          <YAxis 
            yAxisId="temp" 
            orientation="left" 
            domain={tempDomain} 
            tick={{ fontSize: 12 }} 
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
          />
        )}
        
        {showEC && (
          <YAxis 
            yAxisId="ec" 
            orientation="right" 
            domain={ecDomain} 
            tick={{ fontSize: 12 }} 
            label={{ value: 'EC Value (μS/cm)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }} 
          />
        )}
        
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '8px', border: 'none' }}
        />
        <Legend />
        
        {showTemperature && (
          <Line 
            yAxisId="temp" 
            type="monotone" 
            dataKey="temperature" 
            stroke="#FFB86C" 
            name="Temperature" 
            activeDot={{ r: 8 }} 
            strokeWidth={2} 
            dot={{ strokeWidth: 2 }}
          />
        )}
        
        {showEC && (
          <Line 
            yAxisId="ec" 
            type="monotone" 
            dataKey="ecValue" 
            stroke="#0EA5E9" 
            name="EC Value" 
            activeDot={{ r: 8 }} 
            strokeWidth={2} 
            dot={{ strokeWidth: 2 }}
          />
        )}
        
        {showVoltage && (
          <Line 
            yAxisId="ec" 
            type="monotone" 
            dataKey="voltage" 
            stroke="#10B981" 
            name="Voltage" 
            activeDot={{ r: 8 }} 
            strokeWidth={2} 
            dot={{ strokeWidth: 2 }}
          />
        )}
      </LineChart>
    );
  };

  return (
    <div className="chart-container p-4 h-[400px]">
      <h3 className="text-lg font-medium mb-4">Water Quality Trends</h3>
      <ResponsiveContainer width="100%" height="90%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

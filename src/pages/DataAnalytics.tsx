
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchThingSpeakData, 
  getAverages,
  getWaterQuality, 
  ProcessedData 
} from '@/services/thingspeak';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WaterQualityChart } from '@/components/WaterQualityChart';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DataAnalytics = () => {
  const [chartType, setChartType] = useState('time-series');
  const [timeRange, setTimeRange] = useState('all');
  
  const { data = [], isLoading } = useQuery({
    queryKey: ['thingspeak-data'],
    queryFn: fetchThingSpeakData,
  });
  
  // Filter data based on selected time range
  const filteredData = (() => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    const ranges = {
      'last-hour': 60 * 60 * 1000, // 1 hour in ms
      'last-day': 24 * 60 * 60 * 1000, // 24 hours in ms
      'last-week': 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    };
    
    const cutoff = now.getTime() - (ranges[timeRange as keyof typeof ranges] || 0);
    return data.filter(item => new Date(item.timestamp).getTime() > cutoff);
  })();
  
  // Prepare data for distribution chart
  const prepareDistributionData = (data: ProcessedData[]) => {
    // Create EC value range buckets
    const buckets = {
      '0-300': { range: '0-300', count: 0 },
      '300-600': { range: '300-600', count: 0 },
      '600-900': { range: '600-900', count: 0 },
      '900-1200': { range: '900-1200', count: 0 },
      '1200+': { range: '1200+', count: 0 },
    };
    
    data.forEach(item => {
      const ec = item.ecValue;
      if (ec < 300) buckets['0-300'].count++;
      else if (ec < 600) buckets['300-600'].count++;
      else if (ec < 900) buckets['600-900'].count++;
      else if (ec < 1200) buckets['900-1200'].count++;
      else buckets['1200+'].count++;
    });
    
    return Object.values(buckets);
  };
  
  // Prepare data for scatter plot
  const prepareScatterData = (data: ProcessedData[]) => {
    return data.map(item => ({
      temperature: item.temperature,
      ecValue: item.ecValue,
    }));
  };
  
  // Calculate water quality distribution
  const prepareQualityData = (data: ProcessedData[]) => {
    const qualities = {
      'Excellent': { quality: 'Excellent', count: 0 },
      'Good': { quality: 'Good', count: 0 },
      'Fair': { quality: 'Fair', count: 0 },
      'Poor': { quality: 'Poor', count: 0 },
      'Harmful': { quality: 'Harmful', count: 0 },
    };
    
    data.forEach(item => {
      const quality = getWaterQuality(item.ecValue).status;
      const qualityKey = quality.charAt(0).toUpperCase() + quality.slice(1);
      if (qualityKey in qualities) {
        qualities[qualityKey as keyof typeof qualities].count++;
      }
    });
    
    return Object.values(qualities);
  };
  
  const distributionData = prepareDistributionData(filteredData);
  const scatterData = prepareScatterData(filteredData);
  const qualityData = prepareQualityData(filteredData);
  
  const { avgTemp, avgEC, avgVoltage } = getAverages(filteredData);
  
  // Get maximum EC value
  const maxEC = Math.max(...filteredData.map(item => item.ecValue));
  const minEC = Math.min(...filteredData.map(item => item.ecValue));
  
  const renderChart = () => {
    switch (chartType) {
      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="range" />
              <YAxis label={{ value: 'Number of Readings', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar name="EC Value Distribution" dataKey="count" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number" 
                dataKey="temperature" 
                name="Temperature" 
                label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                type="number" 
                dataKey="ecValue" 
                name="EC Value" 
                label={{ value: 'EC Value (μS/cm)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Temperature vs EC" data={scatterData} fill="#0EA5E9" />
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      case 'quality':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="quality" />
              <YAxis label={{ value: 'Number of Readings', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar 
                name="Water Quality Distribution" 
                dataKey="count" 
                fill="#0EA5E9"
                // Custom fill colors based on quality
                isAnimationActive={false}
                shape={(props: any) => {
                  const { x, y, width, height, quality } = props;
                  const colors = {
                    'Excellent': '#10B981',
                    'Good': '#3B82F6',
                    'Fair': '#F59E0B',
                    'Poor': '#F97316',
                    'Harmful': '#EF4444',
                  };
                  
                  const quality_name = props.payload.quality;
                  const fill = colors[quality_name as keyof typeof colors] || '#0EA5E9';
                  
                  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        );
        
      default: // time-series
        return (
          <WaterQualityChart 
            data={filteredData} 
            type="line" 
            showTemperature={true}
            showEC={true}
            showVoltage={true}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Data Analytics</h1>
        <p className="text-muted-foreground">Analyze trends and patterns in your water quality data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Water Quality Analytics</h3>
              
              <div className="flex gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Data</SelectItem>
                    <SelectItem value="last-hour">Last Hour</SelectItem>
                    <SelectItem value="last-day">Last 24h</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time-series">Time Series</SelectItem>
                    <SelectItem value="distribution">EC Distribution</SelectItem>
                    <SelectItem value="scatter">Temp vs EC</SelectItem>
                    <SelectItem value="quality">Quality Distribution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {renderChart()}
          </CardContent>
        </Card>
        
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-4">Data Summary</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Readings</div>
                  <div className="text-2xl font-bold">{filteredData.length}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Avg Temperature</div>
                  <div className="text-2xl font-bold">{avgTemp.toFixed(1)}°C</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Avg EC Value</div>
                  <div className="text-2xl font-bold">{avgEC.toFixed(1)} μS/cm</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Avg Voltage</div>
                  <div className="text-2xl font-bold">{avgVoltage.toFixed(3)} V</div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">EC Range</div>
                  <div className="text-sm font-medium mt-1">
                    Min: {minEC.toFixed(1)} μS/cm
                  </div>
                  <div className="text-sm font-medium">
                    Max: {maxEC.toFixed(1)} μS/cm
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Insights</h3>
              
              <div className="text-sm space-y-3">
                <p>
                  {chartType === 'time-series' && 'The time series chart shows the trends in temperature and EC values over time. Look for patterns and correlations.'}
                  {chartType === 'distribution' && 'The distribution chart shows how EC values are distributed across different ranges, helping identify the most common values.'}
                  {chartType === 'scatter' && 'The scatter plot shows the relationship between temperature and EC values. A positive correlation indicates that EC increases with temperature.'}
                  {chartType === 'quality' && 'The quality distribution chart shows the breakdown of water quality categories based on EC values.'}
                </p>
                
                <p className="text-muted-foreground text-xs">
                  To improve analysis, try selecting different time ranges and chart types to gain different perspectives on your data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;

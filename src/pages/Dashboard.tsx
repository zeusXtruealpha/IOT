
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SensorCard } from '@/components/SensorCard';
import { DataTable } from '@/components/DataTable';
import { WaterQualityChart } from '@/components/WaterQualityChart';
import { fetchThingSpeakData } from '@/services/thingspeak';
import { AlertTriangle, CheckCircle2, Droplets, Info, Thermometer } from 'lucide-react';

const Dashboard = () => {
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  
  const { data = [], isLoading } = useQuery({
    queryKey: ['thingspeak-data'],
    queryFn: fetchThingSpeakData,
  });
  
  // Get the latest values
  const latestData = data.length > 0 ? data[data.length - 1] : null;
  const previousData = data.length > 1 ? data[data.length - 2] : null;
  
  // Calculate temperature and EC deltas
  const tempDelta = latestData && previousData 
    ? latestData.temperature - previousData.temperature
    : 0;
    
  const ecDelta = latestData && previousData 
    ? latestData.ecValue - previousData.ecValue
    : 0;
  
  // Status message based on current EC value
  const getStatusMessage = () => {
    if (!latestData) return { icon: Info, color: 'text-muted-foreground', message: 'No data available' };
    
    const ec = latestData.ecValue;
    
    if (ec > 1200) {
      return { 
        icon: AlertTriangle, 
        color: 'text-red-500', 
        message: 'Alert: Water quality is harmful! EC value exceeds safe limits.' 
      };
    }
    
    if (ec > 900) {
      return { 
        icon: AlertTriangle, 
        color: 'text-orange-500', 
        message: 'Warning: Water quality is poor. Treatment recommended.' 
      };
    }
    
    if (ec > 600) {
      return { 
        icon: Info, 
        color: 'text-yellow-500', 
        message: 'Notice: Water quality is fair. Monitoring recommended.' 
      };
    }
    
    return { 
      icon: CheckCircle2, 
      color: 'text-green-500', 
      message: 'Good: Water quality is within safe parameters.' 
    };
  };
  
  const { icon: StatusIcon, color: statusColor, message: statusMessage } = getStatusMessage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your water quality parameters in real time</p>
      </div>
      
      {/* Status message */}
      <div className={`p-3 rounded-lg border flex items-center gap-3 ${statusColor} bg-background`}>
        <StatusIcon className="h-5 w-5" />
        <span>{statusMessage}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-4">
          <SensorCard 
            title="Temperature"
            value={latestData?.temperature || 0}
            unit="°C"
            type="temperature"
            delta={tempDelta}
            isLoading={isLoading}
          />
          
          <SensorCard 
            title="EC Value"
            value={latestData?.ecValue || 0}
            unit="μS/cm"
            type="ec"
            delta={ecDelta}
            isLoading={isLoading}
          />
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-medium">Sensor Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span>Temperature Sensor</span>
                  </div>
                  <span className="text-xs text-green-500">Active</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                    <span>TDS Sensor</span>
                  </div>
                  <span className="text-xs text-green-500">Active</span>
                </div>
                
                <div className="text-xs text-muted-foreground mt-4">
                  <div>Last Reading: {latestData?.timestamp || 'N/A'}</div>
                  <div>Raw Voltage: {latestData?.voltage.toFixed(3) || 'N/A'} V</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3 space-y-4">
          <Tabs defaultValue="chart">
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${chartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  onClick={() => setChartType('line')}
                >
                  Line
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${chartType === 'area' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  onClick={() => setChartType('area')}
                >
                  Area
                </button>
              </div>
            </div>
            
            <TabsContent value="chart" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <WaterQualityChart 
                    data={data} 
                    type={chartType} 
                    showTemperature={true}
                    showEC={true}
                    showVoltage={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-3">Temperature & EC Correlation</h3>
                  <p className="text-sm text-muted-foreground">
                    The chart above shows the correlation between temperature and EC values over time. 
                    EC values typically increase with temperature due to increased ion mobility.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="table">
              <Card>
                <CardContent className="pt-6">
                  <DataTable data={data} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

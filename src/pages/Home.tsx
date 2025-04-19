import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchThingSpeakData, getAverages } from '@/services/thingspeak';
import { Droplets, Thermometer, BarChart2, BrainCircuit, Database, ArrowRight } from 'lucide-react';
import { SensorCard } from '@/components/SensorCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Home = () => {
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
  
  // Function to calculate mode temperature
  const calculateModeTemperature = (data: any[]) => {
    if (data.length === 0) return 0;
    
    const frequencyMap: Record<string, number> = {};
    let maxCount = 0;
    let mode = data[0].temperature;
    
    data.forEach(item => {
      // Round to 1 decimal place for grouping
      const temp = item.temperature.toFixed(1);
      frequencyMap[temp] = (frequencyMap[temp] || 0) + 1;
      
      if (frequencyMap[temp] > maxCount) {
        maxCount = frequencyMap[temp];
        mode = parseFloat(temp);
      }
    });
    
    return mode;
  };
  
  // Get averages (using existing function for EC and voltage)
  const { avgEC, avgVoltage } = getAverages(data);
  const modeTemp = calculateModeTemperature(data);
  
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Water Quality Monitoring System</h1>
        <p className="text-muted-foreground">Monitor and analyze your water quality in real-time</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-water-600/30 to-water-900/50 backdrop-blur-sm -z-10" />
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white/90 mb-2">Real-time Monitoring</h2>
            <p className="text-white/70 mb-6 max-w-md">
              Your IoT-based water quality monitoring system is actively collecting data from EC and temperature sensors.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
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
            </div>
            
            <Link to="/dashboard">
              <Button className="gap-2 bg-white/20 hover:bg-white/30 border border-white/40">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border shadow-md">
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-2">System Overview</h2>
            <p className="text-muted-foreground mb-6">
              View key statistics and navigate to different sections of the application.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-auto">
              <div className="flex flex-col gap-2 p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Avg. Temperature</span>
                </div>
                <span className="text-2xl font-bold">
                  {modeTemp.toFixed(1)}°C
                </span>
                <span className="text-xs text-muted-foreground">(Most frequent value)</span>
              </div>
              
              <div className="flex flex-col gap-2 p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-emerald-500/10">
                    <Droplets className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">Avg. EC Value</span>
                </div>
                <span className="text-2xl font-bold">
                  {avgEC.toFixed(1)} μS/cm
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-6">
              <Link to="/data-analytics" className="flex flex-col items-center p-3 rounded-lg border hover:bg-accent transition-colors">
                <BarChart2 className="h-5 w-5 mb-1 text-primary" />
                <span className="text-xs text-center">Analytics</span>
              </Link>
              
              <Link to="/model-analysis" className="flex flex-col items-center p-3 rounded-lg border hover:bg-accent transition-colors">
                <BrainCircuit className="h-5 w-5 mb-1 text-primary" />
                <span className="text-xs text-center">ML Models</span>
              </Link>
              
              <Link to="/recent-data" className="flex flex-col items-center p-3 rounded-lg border hover:bg-accent transition-colors">
                <Database className="h-5 w-5 mb-1 text-primary" />
                <span className="text-xs text-center">Data</span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-4">About The System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads/c4e6fc9f-4872-4873-a162-d2ee25847c23.png" 
              alt="Circuit Diagram" 
              className="w-full h-auto object-cover"
            />
            <div className="p-4 bg-muted/30 backdrop-blur-sm">
              <h3 className="text-sm font-medium">Circuit Diagram</h3>
              <p className="text-xs text-muted-foreground">ESP32 connected with TDS and Temperature sensors</p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads/89d1b3f1-8280-449b-853c-aa3f28d9bb6a.png" 
              alt="Hardware Implementation" 
              className="w-full h-auto object-cover"
            />
            <div className="p-4 bg-muted/30 backdrop-blur-sm">
              <h3 className="text-sm font-medium">Hardware Implementation</h3>
              <p className="text-xs text-muted-foreground">The physical circuit on breadboard with sensors</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/20 rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Project Objective</h2>
        <p className="text-muted-foreground mb-4">
          The primary objective of this project is to design and implement a low-cost, real-time IoT-based system for monitoring drinking water quality.
          The system aims to ensure the safety and suitability of drinking water by continuously measuring critical parameters.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Key Components</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-card/30">
            <h4 className="font-medium">ESP32 Board</h4>
            <p className="text-sm text-muted-foreground">Microcontroller for processing sensor data</p>
          </div>
          <div className="p-4 border rounded-lg bg-card/30">
            <h4 className="font-medium">Analog TDS Sensor</h4>
            <p className="text-sm text-muted-foreground">Measures dissolved solids concentration</p>
          </div>
          <div className="p-4 border rounded-lg bg-card/30">
            <h4 className="font-medium">DS18B20 Temperature</h4>
            <p className="text-sm text-muted-foreground">Digital temperature sensor</p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            By integrating IoT and cloud technologies, the system ensures efficient monitoring, data accessibility, and improved awareness about water quality standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
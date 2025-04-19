import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchThingSpeakData, getWaterQuality } from '@/services/thingspeak';
import { predictWaterQuality } from '@/services/mlModels';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const RecentData = () => {
  const [exportType, setExportType] = useState<'csv' | 'json'>('csv');
  
  const { data = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['thingspeak-data'],
    queryFn: fetchThingSpeakData,
  });
  
  const handleRefresh = async () => {
    await refetch();
    toast.success('Data refreshed successfully');
  };
  
  const exportData = () => {
    let content = '';
    let filename = `water-quality-data-${new Date().toISOString().split('T')[0]}`;
    
    if (exportType === 'csv') {
      // Convert data to CSV
      const headers = ['ID', 'Timestamp', 'Temperature (°C)', 'Voltage (V)', 'EC Value (μS/cm)', 'Water Quality'];
      const csvData = data.map(item => [
        item.id,
        item.timestamp,
        item.temperature.toFixed(2),
        item.voltage.toFixed(3),
        item.ecValue.toFixed(2),
        predictWaterQuality(item.ecValue)
      ]);
      
      content = [headers, ...csvData].map(row => row.join(',')).join('\n');
      filename += '.csv';
    } else {
      // Convert data to JSON
      const jsonData = data.map(item => ({
        ...item,
        waterQuality: predictWaterQuality(item.ecValue)
      }));
      
      content = JSON.stringify(jsonData, null, 2);
      filename += '.json';
    }
    
    // Create and trigger download
    const blob = new Blob([content], { type: exportType === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Data exported as ${exportType.toUpperCase()}`);
  };
  
  // Get the latest data for status message
  const latestData = data.length > 0 ? data[data.length - 1] : null;
  const getStatusMessage = () => {
    if (!latestData) return { icon: AlertTriangle, color: 'text-muted-foreground', message: 'No data available' };
    
    const ec = latestData.ecValue;
    const { status, color } = getWaterQuality(ec);
    
    return { 
      icon: status === 'excellent' || status === 'good' ? CheckCircle2 : AlertTriangle, 
      color, 
      message: `Latest reading: ${ec.toFixed(1)} μS/cm (${status}) at ${latestData.timestamp}` 
    };
  };
  
  const { icon: StatusIcon, color: statusColor, message: statusMessage } = getStatusMessage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Recent Data</h1>
        <p className="text-muted-foreground">View and export the latest data from your water quality sensors</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${statusColor}`}>
          <StatusIcon className="h-5 w-5" />
          <span className="text-sm">{statusMessage}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-xs ${exportType === 'csv' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setExportType('csv')}
            >
              CSV
            </button>
            <button 
              className={`px-3 py-1.5 text-xs ${exportType === 'json' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setExportType('json')}
            >
              JSON
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={exportData}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <DataTable data={data} isLoading={isLoading} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">About the Data</h3>
            <p className="text-muted-foreground">
              This table shows readings from your water quality monitoring system. 
              Data is collected from EC and temperature sensors connected to an ESP32 microcontroller.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">ThingSpeak Integration</h3>
            <p className="text-muted-foreground">
              Data is stored in the ThingSpeak cloud platform. Channel ID: {2367586}, using API key for secure access.
              The system automatically uploads new readings every few minutes.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Data Interpretation</h3>
            <p className="text-muted-foreground">
              EC values below 300 μS/cm indicate very pure water. Values between 300-600 μS/cm are considered good for drinking water.
              Values above 900 μS/cm may suggest poor water quality that requires treatment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentData;

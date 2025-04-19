
interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1: string; // Temperature
  field2: string; // Voltage
  field3: string; // EC Value
}

interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: ThingSpeakFeed[];
}

export interface ProcessedData {
  timestamp: string;
  temperature: number;
  voltage: number;
  ecValue: number;
  id: number;
}

const CHANNEL_ID = "2866669"; // Replace with your actual channel ID
const API_KEY = "N6JIZCMY6UKZ0YDE"; // Your read API key from ThingSpeak
const RESULTS_LIMIT = 100;

export async function fetchThingSpeakData(): Promise<ProcessedData[]> {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&results=${RESULTS_LIMIT}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data: ThingSpeakResponse = await response.json();
    
    return data.feeds.map(feed => ({
      timestamp: new Date(feed.created_at).toLocaleString(),
      temperature: parseFloat(feed.field1) || 0,
      voltage: parseFloat(feed.field2) || 0,
      ecValue: parseFloat(feed.field3) || 0,
      id: feed.entry_id
    }));
  } catch (error) {
    console.error("Error fetching ThingSpeak data:", error);
    return [];
  }
}

export function getAverages(data: ProcessedData[]): { avgTemp: number; avgEC: number; avgVoltage: number } {
  if (data.length === 0) {
    return { avgTemp: 0, avgEC: 0, avgVoltage: 0 };
  }
  
  const avgTemp = data.reduce((sum, item) => sum + item.temperature, 0) / data.length;
  const avgEC = data.reduce((sum, item) => sum + item.ecValue, 0) / data.length;
  const avgVoltage = data.reduce((sum, item) => sum + item.voltage, 0) / data.length;
  
  return {
    avgTemp: parseFloat(avgTemp.toFixed(2)),
    avgEC: parseFloat(avgEC.toFixed(2)),
    avgVoltage: parseFloat(avgVoltage.toFixed(2))
  };
}

export function getWaterQuality(ecValue: number): {
  status: 'excellent' | 'good' | 'poor' | 'harmful';
  color: string;
  description: string;
} {
  if (ecValue < 800) {
    return {
      status: 'excellent',
      color: 'text-green-500',
      description: 'Very pure water suitable for drinking'
    };
  } else if (ecValue < 1200) {
    return {
      status: 'good',
      color: 'text-blue-500',
      description: 'Good quality drinking water'
    };
  } 
    else if (ecValue < 1800) {
    return {
      status: 'poor',
      color: 'text-orange-500',
      description: 'Poor quality, not recommended for drinking'
    };
  } else {
    return {
      status: 'harmful',
      color: 'text-red-500',
      description: 'Potentially harmful, avoid consumption'
    };
  }
}

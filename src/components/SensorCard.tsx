
import { Droplets, Thermometer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWaterQuality } from '@/services/thingspeak';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  type: 'ec' | 'temperature';
  delta?: number;
  isLoading?: boolean;
}

export function SensorCard({ title, value, unit, type, delta = 0, isLoading = false }: SensorCardProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [value]);
  
  const Icon = type === 'ec' ? Droplets : Thermometer;
  
  const getStatusInfo = () => {
    if (type === 'temperature') {
      if (value < 10) return { color: 'text-blue-500', text: 'Cold' };
      if (value > 35) return { color: 'text-red-500', text: 'Hot' };
      return { color: 'text-green-500', text: 'Normal' };
    }
    
    return getWaterQuality(value);
  };
  
  const statusInfo = getStatusInfo();
  const color = statusInfo.color;
  const text = type === 'ec' 
    ? statusInfo.status || statusInfo.text 
    : statusInfo.text;
  
  return (
    <div className="glass-card rounded-xl p-4 overflow-hidden relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={cn("h-5 w-5", type === 'ec' ? "text-water-500" : "text-amber-500")} />
      </div>
      
      <div className="relative">
        <div className={cn(
          "sensor-value",
          animate && "scale-105 text-primary/80",
          isLoading && "animate-pulse"
        )}>
          {isLoading ? "..." : value.toFixed(1)}
          <span className="text-base ml-1 font-normal text-muted-foreground">{unit}</span>
        </div>
        
        {delta !== 0 && (
          <div className={cn(
            "text-xs",
            delta > 0 ? "text-green-500" : "text-red-500"
          )}>
            {delta > 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)} from prev.
          </div>
        )}
      </div>
      
      <div className={cn("mt-2 px-2 py-1 text-xs rounded-full inline-block", color)}>
        {text}
      </div>
      
      {/* Animated background elements for visual effect */}
      {type === 'ec' && (
        <>
          <div className="water-drop left-[10%] bottom-[20%] animate-float" style={{ animationDelay: "0s" }} />
          <div className="water-drop right-[20%] bottom-[30%] animate-float" style={{ animationDelay: "0.5s" }} />
          <div className="water-drop left-[30%] bottom-[10%] animate-float" style={{ animationDelay: "1s" }} />
        </>
      )}
    </div>
  );
}

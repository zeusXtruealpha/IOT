
import { BrainCircuit, Layers, TrendingUp, BarChart2 } from 'lucide-react';
import type { MLModel } from '@/services/mlModels';
import { cn } from '@/lib/utils';

interface ModelCardProps {
  model: MLModel;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ModelCard({ model, isSelected = false, onClick }: ModelCardProps) {
  const accuracyColor = model.accuracy > 0.9 
    ? 'text-green-500' 
    : model.accuracy > 0.8 
      ? 'text-yellow-500' 
      : 'text-red-500';
  
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md",
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border bg-white/5 hover:bg-white/10"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-base font-medium">{model.name}</h3>
          <p className="text-xs text-muted-foreground">{model.algorithm}</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10">
          <BrainCircuit className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{model.description}</p>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className={cn("font-medium", accuracyColor)}>
            {(model.accuracy * 100).toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">Accuracy</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {(model.f1Score * 100).toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">F1</span>
        </div>
        
        <div className="flex items-center gap-1">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {model.trainingTime}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          Last updated: {model.lastUpdated}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchThingSpeakData } from '@/services/thingspeak';
import { availableModels, generatePredictions } from '@/services/mlModels';
import { ModelCard } from '@/components/ModelCard';
import { ModelPerformanceChart } from '@/components/ModelPerformanceChart';
import { BrainCircuit, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ModelAnalysis = () => {
  const [selectedModelId, setSelectedModelId] = useState(availableModels[0].id);
  const [chartType, setChartType] = useState<'comparison' | 'scatter' | 'metrics'>('comparison');
  const [isTraining, setIsTraining] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { data = [] } = useQuery({
    queryKey: ['thingspeak-data'],
    queryFn: fetchThingSpeakData,
  });
  
  const selectedModel = availableModels.find(model => model.id === selectedModelId) || availableModels[0];
  
  // Generate predictions for current data
  const predictions = generatePredictions(data, selectedModelId);
  
  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      await selectedModel.trainModel(data);
      toast.success(`${selectedModel.name} trained successfully`);
    } catch (error) {
      toast.error(`Failed to train model: ${error.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handleTestModel = async () => {
    setIsTesting(true);
    try {
      const metrics = await selectedModel.testModel(data);
      toast.success(
        `Model tested - Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%`
      );
    } catch (error) {
      toast.error(`Failed to test model: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Model Analysis</h1>
        <p className="text-muted-foreground">Evaluate machine learning models for water quality prediction</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
            <Info className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Select a model to view its performance details</span>
          </div>
          
          {availableModels.map(model => (
            <ModelCard 
              key={model.id}
              model={model}
              isSelected={model.id === selectedModelId}
              onClick={() => setSelectedModelId(model.id)}
            />
          ))}
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">{selectedModel.name}</h3>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleTrainModel}
                    disabled={isTraining || data.length === 0}
                  >
                    {isTraining ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Training...
                      </>
                    ) : 'Train Model'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleTestModel}
                    disabled={isTesting || data.length === 0}
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : 'Test Model'}
                  </Button>
                  
                  <button 
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${chartType === 'comparison' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    onClick={() => setChartType('comparison')}
                  >
                    Comparison
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${chartType === 'scatter' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    onClick={() => setChartType('scatter')}
                  >
                    Scatter
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${chartType === 'metrics' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    onClick={() => setChartType('metrics')}
                  >
                    Metrics
                  </button>
                </div>
              </div>
              
              <ModelPerformanceChart model={selectedModel} chartType={chartType} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Model Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Algorithm</h4>
                  <p className="text-sm">{selectedModel.algorithm}</p>
                </div>
                
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Training Time</h4>
                  <p className="text-sm">{selectedModel.trainingTime}</p>
                </div>
                
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Last Updated</h4>
                  <p className="text-sm">{selectedModel.lastUpdated}</p>
                </div>
                
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Real-time Accuracy</h4>
                  <p className="text-sm">{(predictions.accuracy * 100).toFixed(1)}%</p>
                </div>
              </div>
              
              <h4 className="text-xs text-muted-foreground mb-1">Description</h4>
              <p className="text-sm">{selectedModel.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Performance Metrics</h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Accuracy</h4>
                  <p className="text-xl font-bold">{(selectedModel.accuracy * 100).toFixed(1)}%</p>
                </div>
                
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Precision</h4>
                  <p className="text-xl font-bold">{(selectedModel.precision * 100).toFixed(1)}%</p>
                </div>
                
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">Recall</h4>
                  <p className="text-xl font-bold">{(selectedModel.recall * 100).toFixed(1)}%</p>
                </div>
                
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">F1 Score</h4>
                  <p className="text-xl font-bold">{(selectedModel.f1Score * 100).toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4">
                These metrics indicate how well the model performs in predicting water quality based on sensor data.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelAnalysis;
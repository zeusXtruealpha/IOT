import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchThingSpeakData } from '@/services/thingspeak';
import { availableModels, generatePredictions } from '@/services/mlModels';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AdvancedAnalysis = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    availableModels[0].id,
    availableModels[1].id
  ]);
  const [isTrainingAll, setIsTrainingAll] = useState(false);
  const [isTestingAll, setIsTestingAll] = useState(false);
  
  const { data = [] } = useQuery({
    queryKey: ['thingspeak-data'],
    queryFn: fetchThingSpeakData,
  });
  
  const toggleModelSelection = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      // Only remove if there would still be at least one model selected
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(id => id !== modelId));
      }
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };
  
  const handleTrainAllModels = async () => {
    setIsTrainingAll(true);
    try {
      await Promise.all(
        selectedModels.map(modelId => {
          const model = availableModels.find(m => m.id === modelId);
          return model?.trainModel(data);
        })
      );
      toast.success('All selected models trained successfully');
    } catch (error) {
      toast.error(`Failed to train models: ${error.message}`);
    } finally {
      setIsTrainingAll(false);
    }
  };

  const handleTestAllModels = async () => {
    setIsTestingAll(true);
    try {
      await Promise.all(
        selectedModels.map(modelId => {
          const model = availableModels.find(m => m.id === modelId);
          return model?.testModel(data);
        })
      );
      toast.success('All selected models tested successfully');
    } catch (error) {
      toast.error(`Failed to test models: ${error.message}`);
    } finally {
      setIsTestingAll(false);
    }
  };

  // Generate predictions for all selected models
  const modelPredictions = selectedModels.map(modelId => {
    const model = availableModels.find(m => m.id === modelId) || availableModels[0];
    const predictions = generatePredictions(data, modelId);
    return {
      modelId,
      modelName: model.name,
      accuracy: predictions.accuracy,
      predictions: predictions.predictedValues.slice(-10)  // Get last 10 predictions
    };
  });
  
  // Prepare comparison data for the models
  const comparisonData = availableModels.map(model => {
    return {
      name: model.name,
      accuracy: model.accuracy * 100,
      precision: model.precision * 100,
      recall: model.recall * 100,
      f1Score: model.f1Score * 100
    };
  });
  
  // Prepare radar chart data
  const radarData = availableModels.map(model => {
    return {
      subject: model.name,
      accuracy: model.accuracy * 100,
      precision: model.precision * 100,
      recall: model.recall * 100,
      f1Score: model.f1Score * 100,
      fullMark: 100
    };
  });
  
  // Prepare predictions comparison data
  const actualValues = data.slice(-10).map(item => item.ecValue);
  const predictionsComparisonData = actualValues.map((actual, index) => {
    const dataPoint: Record<string, number> = { 
      index,
      actual
    };
    
    modelPredictions.forEach(model => {
      dataPoint[model.modelName] = model.predictions[index] || 0;
    });
    
    return dataPoint;
  });
  
  // Calculate performance summary
  const performanceSummary = selectedModels.map(modelId => {
    const model = availableModels.find(m => m.id === modelId) || availableModels[0];
    const predictions = generatePredictions(data, modelId);
    
    // Calculate RMSE (Root Mean Square Error)
    const squaredDiffs = predictions.actualValues.map((actual, i) => 
      Math.pow(actual - predictions.predictedValues[i], 2)
    );
    const mse = squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length;
    const rmse = Math.sqrt(mse);
    
    return {
      modelId,
      modelName: model.name,
      accuracy: predictions.accuracy,
      rmse: rmse
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Advanced Model Analysis</h1>
        <p className="text-muted-foreground">Compare and evaluate multiple machine learning models</p>
      </div>
      
      <div className="p-4 border rounded-lg bg-muted/30">
        <h3 className="text-sm font-medium mb-3">Select Models for Comparison</h3>
        <div className="flex flex-wrap gap-2">
          {availableModels.map(model => (
            <button
              key={model.id}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedModels.includes(model.id) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50'
              }`}
              onClick={() => toggleModelSelection(model.id)}
            >
              {model.name}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTrainAllModels}
            disabled={isTrainingAll || data.length === 0}
          >
            {isTrainingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training All...
              </>
            ) : 'Train Selected Models'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTestAllModels}
            disabled={isTestingAll || data.length === 0}
          >
            {isTestingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing All...
              </>
            ) : 'Test Selected Models'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Model Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" />
                <YAxis domain={[75, 100]} label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" name="Accuracy" fill="#0EA5E9" />
                <Bar dataKey="precision" name="Precision" fill="#10B981" />
                <Bar dataKey="recall" name="Recall" fill="#F59E0B" />
                <Bar dataKey="f1Score" name="F1 Score" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Model Metrics Radar</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} />
                <Radar name="Precision" dataKey="precision" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                <Radar name="Recall" dataKey="recall" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                <Radar name="F1 Score" dataKey="f1Score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Prediction Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={predictionsComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="index" label={{ value: 'Data Point', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'EC Value (μS/cm)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" name="Actual Value" stroke="#10B981" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                {modelPredictions.map((model, index) => (
                  <Line
                    key={model.modelId}
                    type="monotone"
                    dataKey={model.modelName}
                    name={`${model.modelName} Prediction`}
                    stroke={["#0EA5E9", "#8B5CF6", "#F59E0B"][index % 3]}
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Accuracy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">RMSE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Algorithm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Strengths</th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-gray-200">
                  {performanceSummary.map((model, index) => {
                    const fullModel = availableModels.find(m => m.id === model.modelId);
                    return (
                      <tr key={model.modelId} className={index % 2 === 0 ? 'bg-white/5' : 'bg-muted/5'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{model.modelName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{(model.accuracy * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{model.rmse.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{fullModel?.algorithm}</td>
                        <td className="px-6 py-4 text-sm">
                          {model.modelId === 'rf-model' && 'Good balance of accuracy and speed, handles outliers well'}
                          {model.modelId === 'lstm-model' && 'Best for time-series prediction, captures temporal patterns'}
                          {model.modelId === 'xgb-model' && 'Fast training, high accuracy, resistant to overfitting'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p><strong>Analysis Insights:</strong></p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The LSTM model performs best for predicting trends over time, but requires more computational resources.</li>
                <li>Random Forest provides a good balance of accuracy and training speed, making it suitable for rapid deployment.</li>
                <li>XGBoost shows the highest accuracy on test data but may require more fine-tuning for optimal performance.</li>
                <li>For real-time monitoring applications, the Random Forest model is recommended due to its efficiency.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalysis;

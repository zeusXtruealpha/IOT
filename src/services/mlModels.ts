import type { ProcessedData } from './thingspeak';

export interface MLModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: string;
  algorithm: string;
  lastUpdated: string;
  performanceGraph: {
    labels: string[];
    actual: number[];
    predicted: number[];
  };
  trainModel: (data: ProcessedData[]) => Promise<MLModel>;
  testModel: (data: ProcessedData[]) => Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  }>;
}

// Helper function to split data into training and testing sets
function splitData(data: ProcessedData[], splitRatio = 0.8) {
  const splitIndex = Math.floor(data.length * splitRatio);
  return {
    training: data.slice(0, splitIndex),
    testing: data.slice(splitIndex)
  };
}

// Helper function to calculate metrics
function calculateMetrics(actual: number[], predicted: number[]) {
  // For simplicity, we'll calculate metrics based on classification
  // of water quality (you can adjust this to regression metrics if needed)
  
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let trueNegatives = 0;

  actual.forEach((actualVal, i) => {
    const predVal = predicted[i];
    const actualClass = getQualityClass(actualVal);
    const predClass = getQualityClass(predVal);

    if (actualClass === predClass) {
      truePositives++;
    } else {
      falsePositives++;
      falseNegatives++;
    }
  });

  const accuracy = truePositives / (truePositives + falsePositives + falseNegatives);
  const precision = truePositives / (truePositives + falsePositives);
  const recall = truePositives / (truePositives + falseNegatives);
  const f1Score = 2 * (precision * recall) / (precision + recall);

  return {
    accuracy,
    precision,
    recall,
    f1Score
  };
}

function getQualityClass(ecValue: number): string {
  if (ecValue < 800) return "Excellent";
  if (ecValue < 1200) return "Good";
  if (ecValue < 1800) return "Poor";
  return "Harmful";
}

// Simulated ML models with training and testing capabilities
export const availableModels: MLModel[] = [
  {
    id: "rf-model",
    name: "Random Forest Classifier",
    description: "Ensemble learning method using multiple decision trees",
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.93,
    f1Score: 0.91,
    trainingTime: "0",
    algorithm: "Random Forest",
    lastUpdated: new Date().toISOString().split('T')[0],
    performanceGraph: {
      labels: [],
      actual: [],
      predicted: []
    },
    async trainModel(data: ProcessedData[]) {
      // Simulate training process
      const { training } = splitData(data);
      console.log(`Training RF model with ${training.length} samples`);
      
      // In a real implementation, you would train your model here
      // This is just a simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.lastUpdated = new Date().toISOString().split('T')[0];
      this.trainingTime = "5.1 seconds";
      
      return this;
    },
    async testModel(data: ProcessedData[]) {
      const { testing } = splitData(data);
      console.log(`Testing RF model with ${testing.length} samples`);
      
      // Generate predictions (simulated)
      const actual = testing.map(d => d.ecValue);
      const predicted = actual.map(val => {
        // Add some random noise based on model accuracy
        const noise = (Math.random() - 0.5) * 100;
        return Math.max(0, val + noise);
      });
      
      // Calculate metrics
      const { accuracy, precision, recall, f1Score } = calculateMetrics(actual, predicted);
      
      // Update model performance
      this.accuracy = accuracy;
      this.precision = precision;
      this.recall = recall;
      this.f1Score = f1Score;
      this.performanceGraph = {
        labels: testing.slice(0, 8).map((_, i) => `Set ${i+1}`),
        actual: actual.slice(0, 8),
        predicted: predicted.slice(0, 8)
      };
      
      return { accuracy, precision, recall, f1Score };
    }
  },
  {
    id: "lstm-model",
    name: "LSTM Neural Network",
    description: "Deep learning model for time-series prediction",
    accuracy: 0.94,
    precision: 0.92,
    recall: 0.91,
    f1Score: 0.915,
    trainingTime: "0",
    algorithm: "Long Short-Term Memory",
    lastUpdated: new Date().toISOString().split('T')[0],
    performanceGraph: {
      labels: [],
      actual: [],
      predicted: []
    },
    async trainModel(data: ProcessedData[]) {
      const { training } = splitData(data);
      console.log(`Training LSTM model with ${training.length} samples`);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      this.lastUpdated = new Date().toISOString().split('T')[0];
      this.trainingTime = "4.6 seconds";
      
      return this;
    },
    async testModel(data: ProcessedData[]) {
      const { testing } = splitData(data);
      console.log(`Testing LSTM model with ${testing.length} samples`);
      
      const actual = testing.map(d => d.ecValue);
      const predicted = actual.map(val => {
        // LSTM would theoretically be better at predictions
        const noise = (Math.random() - 0.5) * 80;
        return Math.max(0, val + noise);
      });
      
      const { accuracy, precision, recall, f1Score } = calculateMetrics(actual, predicted);
      
      this.accuracy = accuracy;
      this.precision = precision;
      this.recall = recall;
      this.f1Score = f1Score;
      this.performanceGraph = {
        labels: testing.slice(0, 8).map((_, i) => `Set ${i+1}`),
        actual: actual.slice(0, 8),
        predicted: predicted.slice(0, 8)
      };
      
      return { accuracy, precision, recall, f1Score };
    }
  },
  {
    id: "xgb-model",
    name: "XGBoost Model",
    description: "Gradient boosting framework for EC prediction",
    accuracy: 0.93,
    precision: 0.94,
    recall: 0.89,
    f1Score: 0.915,
    trainingTime: "0",
    algorithm: "Extreme Gradient Boosting",
    lastUpdated: new Date().toISOString().split('T')[0],
    performanceGraph: {
      labels: [],
      actual: [],
      predicted: []
    },
    async trainModel(data: ProcessedData[]) {
      const { training } = splitData(data);
      console.log(`Training XGBoost model with ${training.length} samples`);
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      this.lastUpdated = new Date().toISOString().split('T')[0];
      this.trainingTime = "4.1 seconds";
      
      return this;
    },
    async testModel(data: ProcessedData[]) {
      const { testing } = splitData(data);
      console.log(`Testing XGBoost model with ${testing.length} samples`);
      
      const actual = testing.map(d => d.ecValue);
      const predicted = actual.map(val => {
        // XGBoost would theoretically be very accurate
        const noise = (Math.random() - 0.5) * 60;
        return Math.max(0, val + noise);
      });
      
      const { accuracy, precision, recall, f1Score } = calculateMetrics(actual, predicted);
      
      this.accuracy = accuracy;
      this.precision = precision;
      this.recall = recall;
      this.f1Score = f1Score;
      this.performanceGraph = {
        labels: testing.slice(0, 8).map((_, i) => `Set ${i+1}`),
        actual: actual.slice(0, 8),
        predicted: predicted.slice(0, 8)
      };
      
      return { accuracy, precision, recall, f1Score };
    }
  }
];

// Function to predict water quality classification based on EC value
export function predictWaterQuality(ecValue: number): string {
  
    if (ecValue < 800) {
    return "Excellent";
  } else if (ecValue < 1200) {
    return "Good";
  } else if (ecValue < 1800) {
    return "Poor";
  } else {
    return "Harmful";
  }
}

// Function to simulate model prediction accuracy on current data
export function generatePredictions(data: ProcessedData[], modelId: string): {
  actualValues: number[];
  predictedValues: number[];
  accuracy: number;
} {
  // Find the selected model
  const model = availableModels.find(m => m.id === modelId) || availableModels[0];
  
  // Simulate predictions with slight deviation based on the model's accuracy
  const predictions = data.map(item => {
    const deviation = (1 - model.accuracy) * 100;
    const randomFactor = (Math.random() * deviation * 2) - deviation;
    return Math.max(0, item.ecValue + (item.ecValue * randomFactor / 100));
  });
  
  const actualValues = data.map(item => item.ecValue);
  
  // Calculate accuracy of these predictions
  const errors = predictions.map((pred, i) => Math.abs(pred - actualValues[i]));
  const meanError = errors.reduce((sum, err) => sum + err, 0) / errors.length;
  const accuracy = 1 - (meanError / (Math.max(...actualValues) || 1));
  
  return {
    actualValues,
    predictedValues: predictions,
    accuracy: parseFloat(accuracy.toFixed(2))
  };
}
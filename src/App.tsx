
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DataAnalytics from "./pages/DataAnalytics";
import ModelAnalysis from "./pages/ModelAnalysis";
import AdvancedAnalysis from "./pages/AdvancedAnalysis";
import RecentData from "./pages/RecentData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 30, // 30 seconds
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/data-analytics" element={<Layout><DataAnalytics /></Layout>} />
          <Route path="/model-analysis" element={<Layout><ModelAnalysis /></Layout>} />
          <Route path="/advanced-analysis" element={<Layout><AdvancedAnalysis /></Layout>} />
          <Route path="/recent-data" element={<Layout><RecentData /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

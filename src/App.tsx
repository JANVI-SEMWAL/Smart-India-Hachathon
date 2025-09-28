import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Itinerary from "./pages/Itinerary";
import CulturalInsights from "./pages/CulturalInsights";
import Marketplace from "./pages/Marketplace";
import Events from "./pages/Events";
import Safety from "./pages/Safety";
import Journal from "./pages/Journal";
import Login from "./pages/Login";

import ARMap from "./pages/ARMap";

import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import TestPage from "./pages/TestPage";

import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/cultural-insights" element={<CulturalInsights />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/ar-map" element={<ARMap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/test" element={<TestPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import Compare from "./pages/Compare";
import ProductDetail from "./pages/ProductDetail";
import MyAlerts from "./pages/MyAlerts";
import VendorDashboard from "./pages/VendorDashboard";
import VendorOnboard from "./pages/VendorOnboard";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";

import NotFound from "./pages/NotFound";
import VendorProtectedRoute from "./components/VendorProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import VendorReviews from "./pages/VendorReviews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ComparisonProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={
              <ProtectedRoute>
                <Browse />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } />
            <Route path="/compare" element={
              <ProtectedRoute>
                <Compare />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/my-alerts" element={
              <ProtectedRoute>
                <MyAlerts />
              </ProtectedRoute>
            } />
            <Route path="/vendor/onboard" element={<VendorOnboard />} />
            <Route 
              path="/vendor" 
              element={
                <VendorProtectedRoute>
                  <VendorDashboard />
                </VendorProtectedRoute>
              } 
            />
            <Route path="/vendor/dashboard" element={
              <VendorProtectedRoute>
                <VendorDashboard />
              </VendorProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/vendor/:vendorId/reviews" element={<VendorReviews />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/documentation" element={<Documentation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </ComparisonProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


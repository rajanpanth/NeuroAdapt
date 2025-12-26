import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProductivityProvider } from "@/hooks/use-productivity";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NeuroDocs from "./pages/NeuroDocs";
import NeuroSheets from "./pages/NeuroSheets";
import NeuroSlides from "./pages/NeuroSlides";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <ProductivityProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/docs" element={<NeuroDocs />} />
                <Route path="/sheets" element={<NeuroSheets />} />
                <Route path="/slides" element={<NeuroSlides />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ProductivityProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;

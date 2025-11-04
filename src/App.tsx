
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import Index from "./pages/Index";
import CoinDetails from "./pages/CoinDetails";
import NotFound from "./pages/NotFound";
import TrendingCoins from "./pages/TrendingCoins";
import BiggestGainers from "./pages/BiggestGainers";
import RecentlyAdded from "./pages/RecentlyAdded";
import Swap from "./pages/Swap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/coin/:id" element={<CoinDetails />} />
              <Route path="/trending" element={<TrendingCoins />} />
              <Route path="/gainers" element={<BiggestGainers />} />
              <Route path="/recent" element={<RecentlyAdded />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

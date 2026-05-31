
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import CoinDetails from "./pages/CoinDetails";
import NotFound from "./pages/NotFound";
import TrendingCoins from "./pages/TrendingCoins";
import BiggestGainers from "./pages/BiggestGainers";
import RecentlyAdded from "./pages/RecentlyAdded";
import Swap from "./pages/Swap";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import Security from "./pages/Security";
import History from "./pages/History";
import Quests from "./pages/Quests";


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
      <AuthProvider>
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/security" element={<Security />} />
                <Route path="/history" element={<History />} />
                <Route path="/quests" element={<Quests />} />
                <Route path="*" element={<NotFound />} />

              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

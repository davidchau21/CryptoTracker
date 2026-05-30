import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownUp, Settings, HelpCircle, Activity } from "lucide-react";
import { useWallet } from "@/providers/WalletProvider";
import { toast } from "sonner";

const POPULAR_TOKENS = [
  { symbol: "ETH", name: "Ethereum", icon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png" },
  { symbol: "BTC", name: "Bitcoin", icon: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png" },
  { symbol: "USDT", name: "Tether", icon: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png" },
  { symbol: "USDC", name: "USD Coin", icon: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png" },
  { symbol: "BNB", name: "BNB", icon: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" },
  { symbol: "SOL", name: "Solana", icon: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png" },
];

const Swap = () => {
  const { isConnected, connect } = useWallet();
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [isRotating, setIsRotating] = useState(false);

  const handleSwapTokens = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success("Swap functionality coming soon!");
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simple mock conversion rate (1:1 for demo)
    if (value && !isNaN(parseFloat(value))) {
      setToAmount((parseFloat(value) * 0.99).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  return (
    <DashboardLayout hideSidebar={true}>
      <div className="w-full max-w-[1400px] mx-auto px-4 py-8 relative">
        {/* Futuristic glowing particles */}
        <div className="absolute top-1/4 left-1/3 size-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 right-1/3 size-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-md mx-auto">
          <Card className="glass-panel border-glow-indigo overflow-hidden shadow-2xl relative dark:bg-slate-950/40">
            {/* Glowing blobs inside card */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <CardHeader className="border-b border-white/5 dark:border-white/5 bg-white/30 dark:bg-white/5 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Activity className="size-5 text-indigo-500 animate-pulse" />
                    DEFI SWAP
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-gray-400 font-medium">Trade tokens instantly at best rates</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6 relative z-10">
              {/* From Token */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Pay From</span>
                  <span>Balance: 2,403.20</span>
                </div>
                <div className="flex gap-2 bg-slate-100/40 dark:bg-black/20 p-3 rounded-2xl border border-white/40 dark:border-white/5 focus-within:border-indigo-500/50 transition-all duration-300">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      className="text-3xl font-extrabold h-14 bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-slate-400 text-glow-indigo w-full"
                    />
                  </div>
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-32 h-14 bg-white/80 dark:bg-slate-900/80 border-none rounded-xl shadow-md font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/10">
                      {POPULAR_TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="font-semibold text-sm cursor-pointer hover:bg-indigo-500/10 focus:bg-indigo-500/10">
                          <div className="flex items-center gap-2">
                            <img src={token.icon} alt={token.name} className="w-5 h-5 rounded-full" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center -my-5 relative z-20">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full size-12 bg-white dark:bg-slate-900 border-glow-indigo dark:border-white/10 hover:border-indigo-500 hover:scale-110 active:scale-95 transition-all shadow-xl flex items-center justify-center`}
                  onClick={handleSwapTokens}
                >
                  <ArrowDownUp className={`h-5 w-5 text-indigo-500 transition-transform duration-500 ${isRotating ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Receive Est.</span>
                  <span className="flex items-center gap-1">Slippage Tolerance: <HelpCircle className="size-3" /></span>
                </div>
                <div className="flex gap-2 bg-slate-100/40 dark:bg-black/20 p-3 rounded-2xl border border-white/40 dark:border-white/5">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="text-3xl font-extrabold h-14 bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-slate-400 w-full"
                    />
                  </div>
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-32 h-14 bg-white/80 dark:bg-slate-900/80 border-none rounded-xl shadow-md font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/10">
                      {POPULAR_TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="font-semibold text-sm cursor-pointer hover:bg-indigo-500/10 focus:bg-indigo-500/10">
                          <div className="flex items-center gap-2">
                            <img src={token.icon} alt={token.name} className="w-5 h-5 rounded-full" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Slippage Settings */}
              <div className="bg-slate-100/30 dark:bg-black/10 p-4 rounded-2xl border border-white/30 dark:border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-gray-400">
                  <span>Slippage Tolerance</span>
                  <span className="font-bold text-indigo-500 dark:text-indigo-400">{slippage}%</span>
                </div>
                <div className="flex gap-2">
                  {["0.1", "0.5", "1.0"].map((value) => (
                    <Button
                      key={value}
                      variant={slippage === value ? "default" : "outline"}
                      size="sm"
                      className={`flex-1 rounded-xl font-bold transition-all ${
                        slippage === value 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20" 
                          : "bg-white/50 dark:bg-slate-900/50 hover:bg-indigo-500/5 border-white/50 dark:border-white/5 text-slate-700 dark:text-gray-300"
                      }`}
                      onClick={() => setSlippage(value)}
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Swap Button */}
              {isConnected ? (
                <Button
                  className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-98 flex justify-center items-center gap-2"
                  onClick={handleSwap}
                  disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                >
                  Confirm Swap
                </Button>
              ) : (
                <Button 
                  className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-98" 
                  onClick={connect}
                >
                  Connect Web3 Wallet
                </Button>
              )}

              {/* Swap Info */}
              {fromAmount && toAmount && (
                <div className="text-xs font-semibold text-slate-500 dark:text-gray-400 space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Exchange Rate</span>
                    <span className="text-slate-700 dark:text-gray-200">1 {fromToken} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Network Fee</span>
                    <span className="text-emerald-500 text-glow-success font-bold">~$5.00</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Swap;

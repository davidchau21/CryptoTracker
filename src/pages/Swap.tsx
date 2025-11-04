import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownUp, Settings } from "lucide-react";
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

  const handleSwapTokens = () => {
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
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Swap</CardTitle>
                  <CardDescription>Trade tokens instantly</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* From Token */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">From</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      className="text-2xl h-14"
                    />
                  </div>
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-32 h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <img src={token.icon} alt={token.name} className="w-5 h-5" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center -my-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background hover:bg-accent"
                  onClick={handleSwapTokens}
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">To</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="text-2xl h-14 bg-muted"
                    />
                  </div>
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-32 h-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <img src={token.icon} alt={token.name} className="w-5 h-5" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Slippage Settings */}
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Slippage tolerance</span>
                  <span className="font-medium">{slippage}%</span>
                </div>
                <div className="flex gap-2">
                  {["0.1", "0.5", "1.0"].map((value) => (
                    <Button
                      key={value}
                      variant={slippage === value ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
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
                  className="w-full h-12 text-base"
                  onClick={handleSwap}
                  disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                >
                  Swap
                </Button>
              ) : (
                <Button className="w-full h-12 text-base" onClick={connect}>
                  Connect Wallet
                </Button>
              )}

              {/* Swap Info */}
              {fromAmount && toAmount && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span>1 {fromToken} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network fee</span>
                    <span>~$5.00</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Swap;

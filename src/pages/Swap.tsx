import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ArrowDownUp, Settings, HelpCircle, Activity, Clock, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { useWallet } from "@/providers/WalletProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  fetchSwapRate,
  postSwapTransaction,
  fetchSwapHistory,
  fetchTokenInfo,
  fetchTokenBalance,
  BackendSwapTx,
} from "@/services/api";

const POPULAR_TOKENS = [
  { symbol: "ETH", name: "Ethereum", icon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png" },
  { symbol: "CTK", name: "CryptoTracker Token", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { symbol: "BTC", name: "Bitcoin", icon: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png" },
  { symbol: "USDT", name: "Tether", icon: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png" },
  { symbol: "USDC", name: "USD Coin", icon: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png" },
  { symbol: "BNB", name: "BNB", icon: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" },
  { symbol: "SOL", name: "Solana", icon: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png" },
];

const Swap = () => {
  const { isConnected, connect, address, tokens, nativeBalance, isLoadingTokens, chain, refetchBalances } = useWallet();
  
  // Tab controls
  const [activeMode, setActiveMode] = useState<"swap" | "transfer">("swap");
  
  // Input fields
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [isRotating, setIsRotating] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  // Live rates, tokens list, and history
  const [liveRate, setLiveRate] = useState<number>(3500);
  const [swapHistory, setSwapHistory] = useState<BackendSwapTx[]>([]);
  const [availableTokens, setAvailableTokens] = useState<Array<{ symbol: string; name: string; icon: string; balance: string }>>([]);

  // Swap Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapStep, setSwapStep] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [recentTxHash, setRecentTxHash] = useState("");

  // Transfer Dialog States
  const [isTransferConfirmOpen, setIsTransferConfirmOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferStep, setTransferStep] = useState(1);
  const [transferTxHash, setTransferTxHash] = useState("");
  const [showTransferReceipt, setShowTransferReceipt] = useState(false);

  // ─── Get Connected Chain Dynamic Details ──────────────────────────────────────
  const getChainDetails = () => {
    if (chain === 56) {
      return { symbol: "BNB", name: "Binance Smart Chain", icon: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" };
    }
    if (chain === 137) {
      return { symbol: "MATIC", name: "Polygon MATIC", icon: "https://coin-images.coingecko.com/coins/images/4713/large/polygon.png" };
    }
    if (chain === 11155111) {
      return { symbol: "SepoliaETH", name: "Sepolia Testnet", icon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png" };
    }
    if (chain === 97) {
      return { symbol: "tBNB", name: "BSC Testnet", icon: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" };
    }
    if (chain === 31337) {
      return { symbol: "ETH", name: "Hardhat Localhost", icon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png" };
    }
    return { symbol: "ETH", name: "Ethereum", icon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png" };
  };

  const chainDetails = getChainDetails();

  // ─── Construct Unified Dynamic Token List from Moralis EvmApi + CTK manual query ────────────────
  useEffect(() => {
    const loadTokensList = async () => {
      if (isConnected && address) {
        let ctkBal = "0.0000";
        try {
          ctkBal = await fetchTokenBalance(address);
        } catch (e) {
          console.warn("Failed to read CTK balance on swap:", e);
        }

        const list = [
          {
            symbol: chainDetails.symbol,
            name: chainDetails.name,
            icon: chainDetails.icon,
            balance: nativeBalance,
          },
          {
            symbol: "CTK",
            name: "CryptoTracker Token",
            icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            balance: parseFloat(ctkBal).toFixed(4),
          },
          ...(tokens || [])
            .filter((t) => t.symbol !== "CTK" && t.symbol !== chainDetails.symbol)
            .map((t) => ({
              symbol: t.symbol,
              name: t.name,
              icon: t.icon || "https://avatars.githubusercontent.com/u/37784886",
              balance: t.balance,
            })),
        ];
        
        setAvailableTokens(list);

        // Adjust active selections
        if (!list.find((t) => t.symbol === fromToken)) {
          setFromToken(list[0].symbol);
        }
        if (!list.find((t) => t.symbol === toToken) && list.length > 1) {
          setToToken(list[1]?.symbol ?? "USDT");
        }
      } else {
        // Offline/Fallback list
        setAvailableTokens(
          POPULAR_TOKENS.map((t) => ({
            ...t,
            balance: t.symbol === "ETH" ? "2.4032" : t.symbol === "CTK" ? "100.0000" : "0.0000",
          }))
        );
      }
    };

    loadTokensList();
  }, [isConnected, tokens, nativeBalance, chain, address]);

  const getSelectedTokenBalance = (symbol: string) => {
    const found = availableTokens.find((t) => t.symbol === symbol);
    return found ? found.balance : "0.0000";
  };

  const getSelectedTokenIcon = (symbol: string, defaultIdx: number) => {
    const found = availableTokens.find((t) => t.symbol === symbol);
    return found ? found.icon : POPULAR_TOKENS[defaultIdx].icon;
  };

  // ─── Fetch Backend Live Swap Rates ───────────────────────────────────────────
  useEffect(() => {
    const updateRate = async () => {
      try {
        const data = await fetchSwapRate(fromToken, toToken);
        setLiveRate(data.rate);
      } catch (err) {
        console.warn("Failed to fetch backend live rate:", err);
      }
    };

    updateRate();
    const interval = setInterval(updateRate, 10000); // 10s
    return () => clearInterval(interval);
  }, [fromToken, toToken]);

  // ─── Fetch MongoDB Persisted Swap History ────────────────────────────────────
  useEffect(() => {
    const loadHistory = async () => {
      if (isConnected && address) {
        try {
          const history = await fetchSwapHistory(address);
          setSwapHistory(history);
        } catch (err) {
          console.error("Failed to load history from backend:", err);
        }
      } else {
        // Local fallback
        const local = localStorage.getItem("swap_history");
        if (local) {
          try {
            setSwapHistory(JSON.parse(local) as BackendSwapTx[]);
          } catch (e) {}
        } else {
          setSwapHistory([]);
        }
      }
    };

    loadHistory();
  }, [isConnected, address]);

  // ─── Token Input Calculations ─────────────────────────────────────────────────
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const output = parseFloat(value) * liveRate;
      setToAmount(output.toFixed(6));
    } else {
      setToAmount("");
    }
  };

  // Recalculate amount if rate updates
  useEffect(() => {
    if (activeMode === "swap" && fromAmount && !isNaN(parseFloat(fromAmount))) {
      setToAmount((parseFloat(fromAmount) * liveRate).toFixed(6));
    }
  }, [liveRate, fromAmount, activeMode]);

  const handleSwapTokens = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // ─── Swap Confirmation Trigger ───────────────────────────────────────────────
  const triggerSwapDialog = () => {
    if (!isConnected) {
      toast.error("Vui lòng kết nối ví Web3 trước");
      return;
    }
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }
    const currentBalance = parseFloat(getSelectedTokenBalance(fromToken));
    if (parseFloat(fromAmount) > currentBalance) {
      toast.error("Số dư không đủ để thực hiện giao dịch");
      return;
    }
    setIsConfirmOpen(true);
  };

  const executeSimulatedSwap = () => {
    setIsSwapping(true);
    setSwapStep(1);

    setTimeout(() => {
      setSwapStep(2);
      setTimeout(() => {
        setSwapStep(3);
        setTimeout(async () => {
          const randomHash = "0x" + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");

          const payload = {
            address: address ?? "0x71c7656ec7ab88b098defb751b7401b5f6d8976f",
            fromToken,
            toToken,
            fromAmount,
            toAmount,
            hash: randomHash,
          };

          try {
            await postSwapTransaction(payload);
            if (address) {
              const updatedHistory = await fetchSwapHistory(address);
              setSwapHistory(updatedHistory);
              await refetchBalances();
            }
          } catch (err) {
            console.warn("Failed to save on backend, using local storage:", err);
            const localTx: BackendSwapTx = {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              ...payload,
            };
            const localHistory = [localTx, ...swapHistory];
            setSwapHistory(localHistory);
            localStorage.setItem("swap_history", JSON.stringify(localHistory));
          }

          setRecentTxHash(randomHash);
          setIsSwapping(false);
          setIsConfirmOpen(false);
          setShowReceipt(true);
          toast.success("Giao dịch Swap mô phỏng thành công!");

          setFromAmount("");
          setToAmount("");
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // ─── Transfer Mode Trigger & On-chain execution ──────────────────────────────
  const triggerTransferDialog = () => {
    if (!isConnected) {
      toast.error("Vui lòng kết nối ví Web3 trước");
      return;
    }
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Vui lòng nhập số lượng gửi hợp lệ");
      return;
    }
    if (!recipientAddress || !ethers.isAddress(recipientAddress)) {
      toast.error("Địa chỉ ví nhận không hợp lệ");
      return;
    }
    const currentBalance = parseFloat(getSelectedTokenBalance(fromToken));
    if (parseFloat(fromAmount) > currentBalance) {
      toast.error("Số dư không đủ để thực hiện chuyển khoản");
      return;
    }
    setIsTransferConfirmOpen(true);
  };

  const executeRealTransfer = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      toast.error("Không tìm thấy ví MetaMask");
      return;
    }

    setIsTransferring(true);
    setTransferStep(1); //gas estimation

    try {
      // 1. Switch network if sending CTK and not on Sepolia, BSC Testnet or Hardhat Localhost
      if (fromToken === "CTK" && chain !== 11155111 && chain !== 97 && chain !== 31337) {
        toast.info("Yêu cầu MetaMask chuyển sang mạng Hardhat Localhost...");
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7a69" }], // 31337 in hex is 0x7a69
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x7a69",
                  chainName: "Hardhat Localhost",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["http://127.0.0.1:8545"],
                  blockExplorerUrls: ["http://127.0.0.1:8545"],
                },
              ],
            });
          } else {
            throw new Error("Vui lòng đổi sang mạng Hardhat Localhost, BSC Testnet hoặc Sepolia để giao dịch CTK.");
          }
        }
      }

      // 2. Initialize provider and signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      let tx;

      if (fromToken === "CTK") {
        // Real on-chain CTK Transfer!
        setTransferStep(2); // Sending tx
        
        const tokenInfo = await fetchTokenInfo();
        if (!tokenInfo?.contractAddress) {
          throw new Error("Không thể lấy địa chỉ hợp đồng token CTK từ máy chủ.");
        }

        const ctkContract = new ethers.Contract(
          tokenInfo.contractAddress,
          ["function transfer(address to, uint256 amount) returns (bool)"],
          signer
        );

        const amountWei = ethers.parseEther(fromAmount);
        
        // Broadcast Solidity transfer transaction
        tx = await ctkContract.transfer(recipientAddress, amountWei);
      } else {
        // Native Token Transfer (ETH / BNB / MATIC depends on MetaMask active chain)
        setTransferStep(2); // Sending tx
        tx = await signer.sendTransaction({
          to: recipientAddress,
          value: ethers.parseEther(fromAmount),
        });
      }

      setTransferStep(3); // Waiting block confirmation
      toast.info("Đang đúc biên nhận giao dịch blockchain, vui lòng chờ...");
      
      const receipt = await tx.wait();
      
      // Update states
      setTransferTxHash(tx.hash);
      setIsTransferring(false);
      setIsTransferConfirmOpen(false);
      setShowTransferReceipt(true);
      toast.success("Chuyển khoản thành công lên blockchain!");

      // Update history list in memory
      const payload: BackendSwapTx = {
        address: address ?? "",
        fromToken,
        toToken: "TRANSFER",
        fromAmount,
        toAmount: recipientAddress.substring(0, 6) + "..." + recipientAddress.substring(38),
        hash: tx.hash,
        createdAt: new Date().toISOString(),
      };
      setSwapHistory([payload, ...swapHistory]);

      // Refetch wallet balances
      await refetchBalances();
      setFromAmount("");
      setRecipientAddress("");
    } catch (error: any) {
      console.error("Transfer failed:", error);
      toast.error(error.reason || error.message || "Giao dịch blockchain bị từ chối hoặc lỗi.");
      setIsTransferring(false);
    }
  };

  return (
    <DashboardLayout hideSidebar={true}>
      <div className="w-full max-w-[1400px] mx-auto px-4 py-8 relative">
        <div className="absolute top-1/4 left-1/3 size-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 right-1/3 size-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-md mx-auto">
          {/* Tabs Selector */}
          <div className="flex bg-slate-200/50 dark:bg-slate-900/60 p-1.5 rounded-2xl mb-4 border border-white/5 backdrop-blur-md">
            <button
              onClick={() => {
                setActiveMode("swap");
                setFromAmount("");
                setToAmount("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeMode === "swap"
                  ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-md"
                  : "text-slate-500 dark:text-gray-400 hover:text-indigo-500"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              Hoán Đổi Swap
            </button>
            <button
              onClick={() => {
                setActiveMode("transfer");
                setFromAmount("");
                setRecipientAddress("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeMode === "transfer"
                  ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-md"
                  : "text-slate-500 dark:text-gray-400 hover:text-indigo-500"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Chuyển On-Chain
            </button>
          </div>

          <Card className="glass-panel border-glow-indigo overflow-hidden shadow-2xl relative dark:bg-slate-950/40">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <CardHeader className="border-b border-white/5 dark:border-white/5 bg-white/30 dark:bg-white/5 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Activity className="size-5 text-indigo-500 animate-pulse" />
                    {activeMode === "swap" ? "DEFI SWAP" : "ON-CHAIN SEND"}
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-gray-400 font-medium">
                    {activeMode === "swap" 
                      ? "Hoán đổi token nhanh chóng với tỷ giá live" 
                      : "Chuyển ETH hoặc CTK trực tiếp giữa các ví qua MetaMask"}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6 relative z-10">
              
              {/* Pay From Token */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>{activeMode === "swap" ? "Pay From" : "Gửi Từ Ví"}</span>
                  <span className="flex items-center gap-1.5">
                    {isLoadingTokens && <Loader2 className="size-3 text-indigo-500 animate-spin" />}
                    Số dư: {getSelectedTokenBalance(fromToken)}
                  </span>
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
                    <SelectTrigger className="w-32 h-14 bg-white/80 dark:bg-slate-900/80 border-none rounded-xl shadow-md font-bold text-sm hover:scale-105 transition-transform flex items-center justify-between px-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={getSelectedTokenIcon(fromToken, 0)} 
                          className="w-5 h-5 rounded-full pointer-events-none" 
                          alt="" 
                        />
                        <span className="text-slate-800 dark:text-white truncate max-w-[50px]">{fromToken}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/10">
                      {availableTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="font-semibold text-sm cursor-pointer hover:bg-indigo-500/10 focus:bg-indigo-500/10">
                          <div className="flex items-center gap-2">
                            <img src={token.icon} alt={token.name} className="w-5 h-5 rounded-full pointer-events-none" />
                            <div className="flex flex-col items-start leading-none">
                              <span className="font-bold text-xs">{token.symbol}</span>
                              <span className="text-[9px] text-gray-500 truncate max-w-[60px]">{token.balance}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {activeMode === "swap" ? (
                <>
                  {/* Swap Direction Button */}
                  <div className="flex justify-center -my-5 relative z-20">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full size-12 bg-white dark:bg-slate-900 border-glow-indigo dark:border-white/10 hover:border-indigo-500 hover:scale-110 active:scale-95 transition-all shadow-xl flex items-center justify-center"
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
                        <SelectTrigger className="w-32 h-14 bg-white/80 dark:bg-slate-900/80 border-none rounded-xl shadow-md font-bold text-sm hover:scale-105 transition-transform flex items-center justify-between px-3">
                          <div className="flex items-center gap-2">
                            <img 
                              src={getSelectedTokenIcon(toToken, 2)} 
                              className="w-5 h-5 rounded-full pointer-events-none" 
                              alt="" 
                            />
                            <span className="text-slate-800 dark:text-white truncate max-w-[50px]">{toToken}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-white/10">
                          {availableTokens
                            .filter((t) => t.symbol !== fromToken)
                            .map((token) => (
                              <SelectItem key={token.symbol} value={token.symbol} className="font-semibold text-sm cursor-pointer hover:bg-indigo-500/10 focus:bg-indigo-500/10">
                                <div className="flex items-center gap-2">
                                  <img src={token.icon} alt={token.name} className="w-5 h-5 rounded-full pointer-events-none" />
                                  <div className="flex flex-col items-start leading-none">
                                    <span className="font-bold text-xs">{token.symbol}</span>
                                    <span className="text-[9px] text-gray-500 truncate max-w-[60px]">{token.balance}</span>
                                  </div>
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
                </>
              ) : (
                /* Transfer Mode Form Elements */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                      Địa Chỉ Ví Nhận (Recipient Address)
                    </label>
                    <Input
                      type="text"
                      placeholder="Nhập địa chỉ ví Ethereum (0x...)"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="h-14 px-4 rounded-2xl bg-slate-100/40 dark:bg-black/20 border border-white/40 dark:border-white/5 focus-visible:ring-indigo-500 focus-visible:ring-1 text-sm font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="text-xs text-slate-500 bg-indigo-500/5 p-3.5 rounded-xl border border-indigo-500/10 leading-relaxed">
                    ℹ️ Chuyển khoản token <strong className="text-indigo-500">CTK</strong> sẽ được thực hiện trực tiếp trên Sepolia Testnet bằng ví MetaMask của bạn. Hãy đảm bảo địa chỉ ví nhận là chính xác vì giao dịch blockchain không thể hoàn tác.
                  </div>
                </div>
              )}

              {/* Action Button */}
              {isConnected ? (
                activeMode === "swap" ? (
                  <Button
                    className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-2"
                    onClick={triggerSwapDialog}
                    disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                  >
                    Xác nhận Swap
                  </Button>
                ) : (
                  <Button
                    className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-2"
                    onClick={triggerTransferDialog}
                    disabled={!fromAmount || parseFloat(fromAmount) <= 0 || !recipientAddress}
                  >
                    Gửi Token On-chain
                  </Button>
                )
              ) : (
                <Button 
                  className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20" 
                  onClick={connect}
                >
                  Kết nối ví Web3
                </Button>
              )}

              {/* Swap Info Details */}
              {activeMode === "swap" && fromAmount && toAmount && (
                <div className="text-xs font-semibold text-slate-500 dark:text-gray-400 space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Tỷ giá Hoán đổi</span>
                    <span className="text-slate-700 dark:text-gray-200">
                      1 {fromToken} ≈ {liveRate.toFixed(6)} {toToken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí mạng ước lượng</span>
                    <span className="text-emerald-500 text-glow-success font-bold">~$5.24</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Swap / Transfer History List */}
        <div className="max-w-md mx-auto mt-8 relative z-10">
          <Card className="glass-panel border-glow-indigo overflow-hidden shadow-2xl relative dark:bg-slate-950/40">
            <CardHeader className="border-b border-white/5 dark:border-white/5 py-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <Clock className="size-4 text-indigo-500 animate-pulse" />
                LỊCH SỬ GIAO DỊCH (SWAP & SEND)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {swapHistory.length > 0 ? (
                <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                  {swapHistory.map((tx) => (
                    <div key={tx.id || tx.hash} className="flex justify-between items-center p-4 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0d121c] dark:text-white">
                            {tx.fromAmount} {tx.fromToken}
                          </span>
                          <span className="text-gray-400 text-xs">➔</span>
                          <span className="font-bold text-sm text-indigo-600 dark:text-cyan-400">
                            {tx.toToken === "TRANSFER" ? `Gửi tới ${tx.toAmount}` : `${tx.toAmount} ${tx.toToken}`}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {tx.createdAt || tx.timestamp ? new Date(tx.createdAt || tx.timestamp!).toLocaleString() : "Đang xử lý"}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Thành công
                        </span>
                        <a
                          href={tx.fromToken === "CTK" || tx.toToken === "TRANSFER"
                            ? `https://sepolia.etherscan.io/tx/${tx.hash}` 
                            : `https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-indigo-500 dark:text-cyan-500 hover:underline flex items-center gap-0.5 font-bold"
                        >
                          Etherscan <ExternalLink className="size-2.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Chưa có lịch sử giao dịch nào cho ví này
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── CONFIRM SWAP DIALOG ───────────────────────────────────────────────── */}
      <Dialog open={isConfirmOpen} onOpenChange={(open) => !isSwapping && setIsConfirmOpen(open)}>
        <DialogContent className="glass-panel border-glow-indigo text-slate-800 dark:text-white rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              Xác nhận Giao dịch Swap
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Vui lòng xem lại chi tiết trước khi hoán đổi.
            </DialogDescription>
          </DialogHeader>

          {isSwapping ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader2 className="size-10 text-indigo-500 animate-spin" />
              <div className="text-center space-y-1">
                <p className="font-bold text-sm">
                  {swapStep === 1 && "Đang ước tính gas & yêu cầu chữ ký..."}
                  {swapStep === 2 && "Đang gửi giao dịch lên blockchain..."}
                  {swapStep === 3 && "Đang chờ xác nhận khối..."}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {swapStep === 1 && "Vui lòng ký yêu cầu trong ví MetaMask của bạn"}
                  {swapStep === 2 && "Giao dịch đang được khai thác bởi các node mạng..."}
                  {swapStep === 3 && "Xác thực biên nhận giao dịch khối cuối cùng..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="bg-slate-100/50 dark:bg-black/20 p-3 rounded-2xl border border-white/40 dark:border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Bạn trả</span>
                  <span className="font-extrabold text-sm">{fromAmount} {fromToken}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Bạn nhận (ước lượng)</span>
                  <span className="font-extrabold text-sm text-indigo-600 dark:text-cyan-400">{toAmount} {toToken}</span>
                </div>
              </div>

              <div className="text-xs space-y-2 px-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tỷ giá Swap</span>
                  <span className="font-bold">1 {fromToken} ≈ {liveRate.toFixed(6)} {toToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Slippage Tolerance</span>
                  <span className="font-bold text-indigo-500">{slippage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Nhận tối thiểu</span>
                  <span className="font-bold">{(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Phí mạng ước lượng</span>
                  <span className="font-bold text-emerald-500">~$5.24</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              disabled={isSwapping}
              onClick={() => setIsConfirmOpen(false)}
              className="flex-1 rounded-xl font-bold dark:border-white/10"
            >
              Hủy
            </Button>
            <Button
              onClick={executeSimulatedSwap}
              disabled={isSwapping}
              className="flex-1 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              Ký & Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── SWAP RECEIPT DIALOG ────────────────────────────────────────────────────── */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="glass-panel border-glow-indigo text-slate-800 dark:text-white rounded-3xl max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle className="size-16 text-emerald-500 animate-bounce" />
            </div>
            <DialogTitle className="text-center text-xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Swap thành công!
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500 dark:text-slate-400">
              Giao dịch swap hoán đổi của bạn đã được lưu trữ thành công.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-slate-100/50 dark:bg-black/20 p-4 rounded-2xl border border-white/40 dark:border-white/5 space-y-3 my-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Mã giao dịch (TxHash)</span>
              <span className="font-mono text-[10px] text-gray-500 truncate w-32 text-right">{recentTxHash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Trạng thái</span>
              <span className="font-bold text-emerald-500">Thành công (MongoDB)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Gas tiêu tốn</span>
              <span className="font-bold">0.00148 ETH (~$5.24)</span>
            </div>
          </div>

          <DialogFooter className="flex sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => window.open(`https://etherscan.io/tx/${recentTxHash}`, "_blank")}
              className="flex-1 rounded-xl font-bold flex gap-1 items-center justify-center dark:border-white/10"
            >
              Etherscan <ExternalLink className="size-3.5" />
            </Button>
            <Button
              onClick={() => setShowReceipt(false)}
              className="flex-1 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── CONFIRM TRANSFER DIALOG ───────────────────────────────────────────── */}
      <Dialog open={isTransferConfirmOpen} onOpenChange={(open) => !isTransferring && setIsTransferConfirmOpen(open)}>
        <DialogContent className="glass-panel border-glow-indigo text-slate-800 dark:text-white rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              Xác nhận Gửi Blockchain
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Giao dịch này được gửi trực tiếp lên blockchain on-chain.
            </DialogDescription>
          </DialogHeader>

          {isTransferring ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader2 className="size-10 text-indigo-500 animate-spin" />
              <div className="text-center space-y-1">
                <p className="font-bold text-sm">
                  {transferStep === 1 && "Đang yêu cầu MetaMask ký số..."}
                  {transferStep === 2 && "Đang gửi giao dịch lên blockchain..."}
                  {transferStep === 3 && "Đang chờ thợ đào xác nhận khối..."}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {transferStep === 1 && "Vui lòng duyệt và ký chữ ký trên popup MetaMask."}
                  {transferStep === 2 && "Hệ thống đang phát sóng chữ ký của bạn lên các node..."}
                  {transferStep === 3 && "Đang chờ thợ đào hoàn thành giao dịch (mất vài giây)..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="bg-slate-100/50 dark:bg-black/20 p-3.5 rounded-2xl border border-white/40 dark:border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Số lượng chuyển</span>
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">{fromAmount} {fromToken}</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Địa chỉ ví nhận</span>
                  <span className="font-mono text-xs text-slate-800 dark:text-white break-all">{recipientAddress}</span>
                </div>
              </div>

              <div className="text-xs space-y-2 px-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Mạng lưới</span>
                  <span className="font-bold">{fromToken === "CTK" ? "Sepolia Testnet" : "Active Wallet Network"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Phí Gas ước lượng</span>
                  <span className="font-bold text-emerald-500">Tự động (MetaMask tính)</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              disabled={isTransferring}
              onClick={() => setIsTransferConfirmOpen(false)}
              className="flex-1 rounded-xl font-bold dark:border-white/10"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={executeRealTransfer}
              disabled={isTransferring}
              className="flex-1 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              Duyệt & Gửi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── TRANSFER RECEIPT DIALOG ───────────────────────────────────────────── */}
      <Dialog open={showTransferReceipt} onOpenChange={setShowTransferReceipt}>
        <DialogContent className="glass-panel border-glow-indigo text-slate-800 dark:text-white rounded-3xl max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle className="size-16 text-emerald-500 animate-bounce" />
            </div>
            <DialogTitle className="text-center text-xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Chuyển khoản thành công!
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500 dark:text-slate-400">
              Giao dịch blockchain đã hoàn tất và được xác thực on-chain thành công.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-slate-100/50 dark:bg-black/20 p-4 rounded-2xl border border-white/40 dark:border-white/5 space-y-3 my-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Mã giao dịch (TxHash)</span>
              <span className="font-mono text-[10px] text-gray-500 truncate w-32 text-right">{transferTxHash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Mạng lưới</span>
              <span className="font-bold">Sepolia Testnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Trạng thái</span>
              <span className="font-bold text-emerald-500">Confirmed (On-chain)</span>
            </div>
          </div>

          <DialogFooter className="flex sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${transferTxHash}`, "_blank")}
              className="flex-1 rounded-xl font-bold flex gap-1 items-center justify-center dark:border-white/10"
            >
              Sepolia Etherscan <ExternalLink className="size-3.5" />
            </Button>
            <Button
              onClick={() => setShowTransferReceipt(false)}
              className="flex-1 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              Đóng lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Swap;

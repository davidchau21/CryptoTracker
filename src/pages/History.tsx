import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useWallet } from "@/providers/WalletProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSwapHistory, BackendSwapTx } from "@/services/api";
import { Clock, ExternalLink, Loader2, Coins, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const History = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { address, isConnected } = useWallet();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // Dynamic MongoDB Swaps History for the User
  const [swaps, setSwaps] = useState<BackendSwapTx[]>([]);
  const [isLoadingSwaps, setIsLoadingSwaps] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Redirect if not authenticated ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để truy cập lịch sử giao dịch.");
      navigate("/login");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // ─── Fetch MongoDB Persisted Swap History for connected wallet ──────────────
  useEffect(() => {
    const loadSwaps = async () => {
      if (isConnected && address) {
        setIsLoadingSwaps(true);
        try {
          const list = await fetchSwapHistory(address);
          setSwaps(list);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoadingSwaps(false);
        }
      }
    };
    loadSwaps();
  }, [isConnected, address]);

  // Filter swaps based on token symbols in search query
  const filteredSwaps = swaps.filter(tx => 
    tx.fromToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.toToken.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAuthLoading || !user) {
    return (
      <DashboardLayout hideSidebar={true}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-8 text-indigo-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout hideSidebar={true}>
      <div className={`w-full max-w-[1300px] mx-auto px-4 py-8 space-y-8 relative transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}>
        
        {/* Glow background blobs */}
        <div className={`absolute top-1/4 left-1/4 size-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors ${isDark ? "bg-indigo-500/5" : "bg-indigo-500/2"}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 size-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors ${isDark ? "bg-purple-500/5" : "bg-purple-500/2"}`}></div>

        {/* ─── TRANSACTION LEDGER WELCOME BANNER ──────────────────────────────── */}
        <div className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0b1021]" : "bg-white border-slate-200/80 shadow-md"}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-spin-slow"></div>
              <div className="relative size-16 bg-[#0c1328] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl border border-white/10 shrink-0">
                <Clock className="size-8 text-indigo-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                  Nhật Ký Giao Dịch Swap
                </h1>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${isDark ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-indigo-50 border-indigo-200 text-indigo-600"}`}>
                  MONGO LEDGER ACTIVE
                </span>
              </div>
              <p className={`text-sm mt-1.5 font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Tra cứu, kiểm tra và truy vết chi tiết lịch sử hoán đổi token của bạn được đồng bộ trực tiếp từ MongoDB.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 relative z-10 shrink-0 text-right">
            <div className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs font-bold w-fit ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
              <ShieldCheck className="size-4 animate-pulse" />
              SYNCHRONIZED
            </div>
          </div>
        </div>

        {/* ─── TRANSACTION LEDGER LIST ───────────────────────────────────────── */}
        <Card className={`overflow-hidden shadow-xl border transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0a0f1d]/60" : "bg-white border-slate-200/80 shadow-md"}`}>
          <CardHeader className={`border-b py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
            <div>
              <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Coins className="size-4.5 text-indigo-500" />
                Dữ Liệu Khớp Lệnh Hệ Thống
              </CardTitle>
            </div>
            
            {/* Soft glass search bar */}
            {isConnected && swaps.length > 0 && (
              <input
                type="text"
                placeholder="Tìm kiếm theo mã token (e.g. USDT)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`px-3 py-1.5 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:max-w-xs transition-all ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400"}`}
              />
            )}
          </CardHeader>
          <CardContent className="p-0">
            {!isConnected ? (
              <div className="text-center py-24 text-sm space-y-3">
                <Clock className={`size-9 mx-auto animate-pulse ${isDark ? "text-gray-600" : "text-slate-400"}`} />
                <div className="space-y-1">
                  <p className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Yêu cầu kết nối ví Web3</p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-slate-500"}`}>Vui lòng kết nối ví ở trên Navbar để đồng bộ dữ liệu giao dịch từ MongoDB</p>
                </div>
              </div>
            ) : isLoadingSwaps ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="size-6 text-indigo-500 animate-spin" />
              </div>
            ) : filteredSwaps.length > 0 ? (
              <div className={`divide-y max-h-[600px] overflow-y-auto ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                {filteredSwaps.map((tx) => (
                  <div key={tx.id || tx.hash} className={`flex justify-between items-center p-4 hover:bg-slate-100/50 transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                          {tx.fromAmount} {tx.fromToken}
                        </span>
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-slate-400"}`}>➔</span>
                        <span className="font-bold text-sm text-indigo-600 dark:text-cyan-400">
                          {tx.toAmount} {tx.toToken}
                        </span>
                      </div>
                      <div className={`text-[10px] font-mono mt-1 ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString("vi-VN") : "Đang xử lý"}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                        Thành công
                      </span>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-indigo-500 dark:text-cyan-500 hover:underline flex items-center gap-0.5"
                      >
                        Chi tiết <ExternalLink className="size-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-sm space-y-3">
                <Coins className={`size-9 mx-auto ${isDark ? "text-gray-600" : "text-slate-400"}`} />
                <div className="space-y-1">
                  <p className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Không tìm thấy giao dịch nào</p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-slate-500"}`}>
                    {searchQuery ? "Thử tìm kiếm với mã token khác" : "Thực hiện lệnh Swap đầu tiên của bạn để lưu lịch sử giao dịch bảo mật vào MongoDB."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default History;

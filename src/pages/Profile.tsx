import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useWallet } from "@/providers/WalletProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Loader2, Wallet, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { address, isConnected } = useWallet();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // Mock Wallet asset allocations for premium portfolio visual display
  const mockAssets = [
    { symbol: "ETH", name: "Ethereum", amount: "4.82 ETH", value: "$18,386.40", percentage: 45, color: "bg-indigo-500 shadow-indigo-500/30" },
    { symbol: "WBTC", name: "Wrapped Bitcoin", amount: "0.25 WBTC", value: "$17,106.30", percentage: 42, color: "bg-amber-500 shadow-amber-500/30" },
    { symbol: "USDT", name: "Tether", amount: "5,120.00 USDT", value: "$5,120.00", percentage: 13, color: "bg-emerald-500 shadow-emerald-500/30" },
  ];

  // ─── Redirect if not authenticated ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để truy cập trang cá nhân.");
      navigate("/login");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

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
        
        {/* Dynamic Theme-aware Glow Blobs */}
        <div className={`absolute top-1/4 left-1/4 size-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors ${isDark ? "bg-indigo-500/5" : "bg-indigo-500/2"}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 size-80 rounded-full blur-3xl pointer-events-none -z-10 transition-colors ${isDark ? "bg-purple-500/5" : "bg-purple-500/2"}`}></div>

        {/* ─── GRAND WELCOME CENTRAL BANNER ───────────────────────────────────── */}
        <div className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0b1021]" : "bg-white border-slate-200/80 shadow-md"}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            {/* Spinning decorative avatar boundary */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-spin-slow"></div>
              <div className="relative size-16 bg-[#0c1328] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl border border-white/10 shrink-0">
                {user.displayName.slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                  Hi, {user.displayName}!
                </h1>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                  <CheckCircle2 className="size-3" /> SECURED
                </span>
              </div>
              <p className={`text-sm mt-1.5 font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Quản lý thiết lập Node bảo mật, cấu hình ví và theo dõi số dư tài sản DeFi Sandbox.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 relative z-10 shrink-0">
            <div className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs font-bold w-fit ${isDark ? "bg-indigo-500/10 border-indigo-500/20 text-cyan-400" : "bg-indigo-50 border-indigo-100 text-indigo-700"}`}>
              <Shield className="size-4 animate-pulse" />
              VAI TRÒ: {user.role.toUpperCase()}
            </div>
            <p className={`text-[10px] font-semibold uppercase tracking-wider font-mono ${isDark ? "text-gray-500" : "text-slate-400"}`}>
              Mã máy: {user.id.slice(0, 8)}...
            </p>
          </div>
        </div>

        {/* ─── GRID LAYOUT: HUB CONTENT ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: ACCOUNT INFO */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Account Information details */}
            <Card className={`overflow-hidden shadow-xl border transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0a0f1d]/60" : "bg-white border-slate-200/80 shadow-md"}`}>
              <CardHeader className={`border-b py-4 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
                <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <User className="size-4.5 text-indigo-500" />
                  Hồ Sơ Hệ Thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 text-sm">
                <div className={`flex justify-between items-center py-2.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                  <span className={isDark ? "text-gray-400" : "text-slate-500"}>Tên người dùng</span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{user.displayName}</span>
                </div>
                <div className={`flex justify-between items-center py-2.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                  <span className={isDark ? "text-gray-400" : "text-slate-500"}>Địa chỉ Email</span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>{user.email}</span>
                </div>
                <div className={`flex justify-between items-center py-2.5 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                  <span className={isDark ? "text-gray-400" : "text-slate-500"}>Thành viên từ</span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className={isDark ? "text-gray-400" : "text-slate-500"}>Trạng thái ví Web3</span>
                  <span className={`font-mono text-xs px-2.5 py-1 rounded-lg border font-bold truncate max-w-[180px] ${isConnected && address ? (isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600") : (isDark ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")}`}>
                    {isConnected && address ? address : "Chưa liên kết ví"}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT SIDE: PORTFOLIO ALLOCATION */}
          <div className="lg:col-span-6">
            
            {/* Real-time Wallet Portfolio Allocations Widget (Simulated Sandbox) */}
            {isConnected ? (
              <Card className={`overflow-hidden shadow-xl border transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0a0f1d]/60" : "bg-white border-slate-200/80 shadow-md"}`}>
                <CardHeader className={`border-b py-4 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
                  <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center justify-between ${isDark ? "text-white" : "text-slate-900"}`}>
                    <span className="flex items-center gap-2">
                      <Wallet className="size-4.5 text-indigo-500" />
                      Phân Bổ Tài Sản Ví Sandbox
                    </span>
                    <span className={`text-xs font-mono font-bold ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                      Tổng số dư: ~$40,612.70
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    
                    {/* SVG Doughnut Chart Representation */}
                    <div className="relative flex justify-center items-center py-2">
                      <svg width="180" height="180" viewBox="0 0 120 120" className="transform -rotate-90">
                        {/* Background track circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="40"
                          fill="transparent"
                          stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9"}
                          strokeWidth="10"
                        />
                        {/* ETH Segment (45%) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="40"
                          fill="transparent"
                          stroke="#6366f1"
                          strokeWidth="10"
                          strokeDasharray="251.327"
                          strokeDashoffset="0"
                          className="transition-all duration-1000 ease-out"
                        />
                        {/* WBTC Segment (42%) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="40"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="10"
                          strokeDasharray="251.327"
                          strokeDashoffset="-113.097"
                          className="transition-all duration-1000 ease-out"
                        />
                        {/* USDT Segment (13%) */}
                        <circle
                          cx="60"
                          cy="60"
                          r="40"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="10"
                          strokeDasharray="251.327"
                          strokeDashoffset="-218.654"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      {/* Absolute center label inside the hole */}
                      <div className="absolute text-center">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                          DEFI
                        </span>
                        <span className={`text-base font-black leading-none block mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                          45%
                        </span>
                        <span className={`text-[9px] font-medium block mt-0.5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                          ETH Dominant
                        </span>
                      </div>
                    </div>

                    {/* Detailed allocations breakdown list */}
                    <div className="space-y-4">
                      {mockAssets.map((asset) => (
                        <div key={asset.symbol} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${asset.color.split(" ")[0]}`}></span>
                              <span className={isDark ? "text-white" : "text-slate-800"}>
                                {asset.name} ({asset.symbol})
                              </span>
                            </div>
                            <span className={isDark ? "text-white font-mono" : "text-slate-800 font-mono"}>
                              {asset.percentage}%
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-[11px] font-semibold text-gray-500 font-mono pl-4">
                            <span>{asset.amount}</span>
                            <span>{asset.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className={`overflow-hidden shadow-xl border transition-all duration-300 p-8 text-center ${isDark ? "glass-panel border-white/5 bg-[#0a0f1d]/60 text-gray-400" : "bg-white border-slate-200/80 shadow-md text-slate-500"}`}>
                <Wallet className="size-12 mx-auto text-indigo-500/50 mb-3" />
                <h4 className={`font-bold text-sm mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>Ví Web3 chưa kết nối</h4>
                <p className="text-xs">Kết nối ví của bạn bằng nút phía bên phải Header để xem thông tin phân bổ tài sản tại đây.</p>
              </Card>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;

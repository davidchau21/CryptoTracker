import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Activity, Lock, Mail, Loader2, ArrowLeft, TrendingUp, TrendingDown, Coins, ShieldCheck, Zap } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // Live simulated pricing ticks for left column visual showcase
  const [prices, setPrices] = useState([
    { symbol: "BTC", name: "Bitcoin", price: 68425.20, change: 2.34, up: true },
    { symbol: "ETH", name: "Ethereum", price: 3814.65, change: 1.12, up: true },
    { symbol: "SOL", name: "Solana", price: 164.80, change: -1.45, up: false }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev =>
        prev.map(c => {
          const delta = (Math.random() - 0.48) * (c.price * 0.0005);
          const newPrice = Math.max(1, c.price + delta);
          const newChange = c.change + (Math.random() - 0.5) * 0.05;
          return {
            ...c,
            price: Number(newPrice.toFixed(2)),
            change: Number(newChange.toFixed(2)),
            up: delta >= 0
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className={`min-h-screen w-full flex relative overflow-hidden font-body transition-colors duration-300 ${isDark ? "bg-[#060913] text-white" : "bg-[#f8fafc] text-slate-900"}`}>
      
      {/* ─── LEFT COLUMN: FUTURISTIC CRYPTO PREVIEW SHOWCASE ─────────────────── */}
      <div className={`hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r transition-colors duration-300 ${isDark ? "border-white/5 bg-[#070c1a]" : "border-slate-200/60 bg-slate-100/60"}`}>
        {/* Animated Cyber Glowing Orbs */}
        <div className={`absolute top-[-10%] left-[-10%] size-96 rounded-full blur-3xl pointer-events-none transition-colors ${isDark ? "bg-indigo-500/10" : "bg-indigo-500/5"}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] size-96 rounded-full blur-3xl pointer-events-none transition-colors ${isDark ? "bg-purple-500/10" : "bg-purple-500/5"}`}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.02),transparent_70%)] pointer-events-none"></div>
        
        {/* Cyber grid overlay */}
        <div className={`absolute inset-0 bg-size-[30px_30px] pointer-events-none ${isDark ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)]"}`}></div>

        {/* Logo and Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="size-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-500/30">
            CT
          </div>
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              CryptoTracker
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-slate-400"}`}>Advanced DeFi Node</p>
          </div>
        </div>

        {/* Dynamic Center Visual: Simulated Crypto Ledger Board */}
        <div className="space-y-6 my-auto relative z-10 max-w-lg">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold w-fit animate-pulse-subtle border ${isDark ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-indigo-500/5 border-indigo-500/10 text-indigo-600"}`}>
            <Zap className="size-3.5" /> Live Sandbox Dashboard Connected
          </div>
          
          <h1 className={`text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] ${isDark ? "bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent" : "text-slate-900"}`}>
            Theo Dõi & Giao Dịch DeFi Theo Thời Gian Thực
          </h1>
          <p className={`text-sm font-medium leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}>
            Kết nối tài khoản của bạn để trải nghiệm trình theo dõi tiền mã hóa thông minh tích hợp biểu đồ trực tiếp, swap token đa chuỗi và lưu trữ lịch sử giao dịch trực tiếp trên MongoDB Ledger.
          </p>

          {/* Dynamic Price Widget Grid */}
          <div className="space-y-3 pt-4">
            <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-slate-400"}`}>Thị trường hiện tại</p>
            {prices.map((c) => (
              <div 
                key={c.symbol}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${isDark ? "glass-panel border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10" : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm border ${isDark ? "bg-white/5 text-indigo-400 border-white/5" : "bg-slate-50 text-indigo-600 border-slate-100"}`}>
                    {c.symbol.slice(0,2)}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{c.name}</h4>
                    <p className={`text-xs font-mono ${isDark ? "text-gray-500" : "text-slate-400"}`}>{c.symbol}/USD</p>
                  </div>
                </div>

                <div className="text-right">
                  <h4 className={`font-mono font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                    ${c.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </h4>
                  <div className={`flex items-center justify-end gap-1 text-xs font-bold font-mono mt-0.5 ${c.change >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {c.change >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {c.change >= 0 ? "+" : ""}{c.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cyber Trust Footer */}
        <div className={`flex items-center justify-between text-xs border-t pt-6 relative z-10 transition-colors ${isDark ? "text-gray-500 border-white/5" : "text-slate-400 border-slate-200/60"}`}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Mã hóa bảo mật JWT End-to-End</span>
          </div>
          <span>v2.4.0-Stable</span>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: MAGNIFICENT LOGIN FORM ─────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Glowing blobs */}
        <div className={`absolute top-1/4 left-1/4 size-72 rounded-full blur-3xl pointer-events-none lg:hidden -z-10 transition-colors ${isDark ? "bg-indigo-500/10" : "bg-indigo-500/5"}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 size-72 rounded-full blur-3xl pointer-events-none lg:hidden -z-10 transition-colors ${isDark ? "bg-purple-500/10" : "bg-purple-500/5"}`}></div>

        {/* Back Link floating */}
        <Link
          to="/"
          className={`absolute top-6 left-6 md:top-12 md:left-12 inline-flex items-center gap-2 text-xs font-semibold transition-colors group z-20 ${isDark ? "text-gray-400 hover:text-indigo-400" : "text-slate-500 hover:text-indigo-600"}`}
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Quay lại trang chủ
        </Link>

        {/* Login Form Container */}
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="space-y-3">
            <div className="size-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-2 lg:hidden">
              <Coins className="size-6 text-white" />
            </div>
            <h2 className={`text-3xl font-black tracking-tight ${isDark ? "bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent" : "text-slate-900"}`}>
              Chào mừng trở lại!
            </h2>
            <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>
              Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục phiên làm việc DeFi.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-white/[0.02]" : "bg-white border-slate-200/80 shadow-xl"}`}>
            {/* Inner neon border line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email address field */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="size-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm transition-all shadow-inner h-12 outline-none focus:ring-1 focus:ring-indigo-500 ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus:border-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"}`}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    Mật khẩu tài khoản
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="size-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm transition-all shadow-inner h-12 outline-none focus:ring-1 focus:ring-indigo-500 ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus:border-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"}`}
                  />
                </div>
              </div>

              <div className={`flex items-center justify-between text-xs pt-1 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className={`rounded focus:ring-indigo-500/20 size-4 cursor-pointer ${isDark ? "border-white/10 bg-black/40 text-indigo-600" : "border-slate-200 bg-slate-50 text-indigo-600"}`} 
                  />
                  <span className="group-hover:text-indigo-500 transition-colors">Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/" className="text-indigo-500 hover:text-indigo-600 font-semibold hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-98 flex justify-center items-center gap-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang xử lý tài khoản...
                  </>
                ) : (
                  <>
                    Đăng Nhập <Zap className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className={`mt-8 pt-6 border-t text-center text-xs ${isDark ? "border-white/5 text-gray-400" : "border-slate-100 text-slate-500"}`}>
              Chưa có tài khoản trên node?{" "}
              <Link to="/register" className="text-indigo-500 font-bold hover:text-indigo-600 hover:underline">
                Đăng ký tài khoản mới
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;



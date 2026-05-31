import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Activity, Lock, Mail, User, Loader2, ArrowLeft, Shield, CheckCircle, Database, Zap, Coins } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // Simulated node connection speed stats for visual showcase
  const [nodeSpeed, setNodeSpeed] = useState(99.4);
  useEffect(() => {
    const interval = setInterval(() => {
      setNodeSpeed(Number((99 + Math.random() * 0.9).toFixed(2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !displayName || !password) return;

    if (password !== confirmPassword) {
      toast.error("Đăng ký thất bại", {
        description: "Mật khẩu xác nhận không khớp.",
      });
      return;
    }

    setIsLoading(true);
    const success = await register(email, displayName, password);
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

        {/* Center Benefits Showcase */}
        <div className="space-y-8 my-auto relative z-10 max-w-lg">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold w-fit animate-pulse-subtle border ${isDark ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-indigo-500/5 border-indigo-500/10 text-indigo-600"}`}>
            <Zap className="size-3.5" /> Node Sync: {nodeSpeed}% (Optimized)
          </div>
          
          <h1 className={`text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] ${isDark ? "bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent" : "text-slate-900"}`}>
            Khám Phá Sức Mạnh DeFi Thế Hệ Mới
          </h1>
          <p className={`text-sm font-medium leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}>
            Khởi tạo tài khoản CryptoTracker để mở khóa toàn bộ tính năng phân tích biểu đồ nâng cao, quản lý danh mục đa tài sản và thực hiện swap sandbox không mất phí.
          </p>

          {/* Benefits Bullet Grid */}
          <div className="space-y-4 pt-2">
            
            {/* Benefit 1 */}
            <div className={`flex gap-4 p-4 rounded-2xl border ${isDark ? "glass-panel border-white/5 bg-white/[0.01]" : "bg-white border-slate-200/80 shadow-sm"}`}>
              <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}>
                <Shield className="size-5" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Bảo mật tuyệt đối cùng JWT</h4>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-slate-500"}`}>Mã hóa phiên giao dịch đầu cuối, bảo vệ thông tin tài khoản và kết nối ví an toàn.</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className={`flex gap-4 p-4 rounded-2xl border ${isDark ? "glass-panel border-white/5 bg-white/[0.01]" : "bg-white border-slate-200/80 shadow-sm"}`}>
              <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-50 text-purple-600 border-purple-100"}`}>
                <Database className="size-5" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Đồng bộ lịch sử Swap trên MongoDB</h4>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-slate-500"}`}>Toàn bộ giao dịch hoán đổi token của bạn được lưu trữ vĩnh viễn và hiển thị trực quan.</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className={`flex gap-4 p-4 rounded-2xl border ${isDark ? "glass-panel border-white/5 bg-white/[0.01]" : "bg-white border-slate-200/80 shadow-sm"}`}>
              <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-cyan-50 text-cyan-600 border-cyan-100"}`}>
                <CheckCircle className="size-5" />
              </div>
              <div>
                <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Giao diện Dashboard cao cấp</h4>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-slate-500"}`}>Biểu đồ TradingView chuyên sâu, thống kê tăng trưởng thị trường cập nhật liên tục.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Cyber Trust Footer */}
        <div className={`flex items-center justify-between text-xs border-t pt-6 relative z-10 transition-colors ${isDark ? "text-gray-500 border-white/5" : "text-slate-400 border-slate-200/60"}`}>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="size-4 text-emerald-500" />
            <span>Xác thực hai lớp (2FA Ready)</span>
          </div>
          <span>v2.4.0-Stable</span>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: MAGNIFICENT SIGNUP FORM ─────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
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

        {/* Signup Form Container */}
        <div className="w-full max-w-md space-y-6 relative z-10 py-12 lg:py-6">
          <div className="space-y-2">
            <div className="size-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-2 lg:hidden">
              <Coins className="size-6 text-white" />
            </div>
            <h2 className={`text-3xl font-black tracking-tight ${isDark ? "bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent" : "text-slate-900"}`}>
              Tạo tài khoản mới
            </h2>
            <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>
              Chỉ mất 30 giây để thiết lập và tham gia mạng lưới DeFi thông minh.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-white/[0.02]" : "bg-white border-slate-200/80 shadow-xl"}`}>
            {/* Inner neon border line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Họ và tên hiển thị
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="size-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className={`block w-full pl-10 pr-4 py-2.5 border rounded-2xl text-sm transition-all shadow-inner h-11 outline-none focus:ring-1 focus:ring-indigo-500 ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus:border-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"}`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
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
                    className={`block w-full pl-10 pr-4 py-2.5 border rounded-2xl text-sm transition-all shadow-inner h-11 outline-none focus:ring-1 focus:ring-indigo-500 ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus:border-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Mật khẩu tài khoản
                </label>
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
                    className={`block w-full pl-10 pr-4 py-2.5 border rounded-2xl text-sm transition-all shadow-inner h-11 outline-none focus:ring-1 focus:ring-indigo-500 ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus:border-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"}`}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Xác nhận Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="size-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`block w-full pl-10 pr-4 py-2.5 border rounded-2xl text-sm transition-all shadow-inner h-11 outline-none focus:ring-1 focus:ring-indigo-500 ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus:border-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"}`}
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !displayName || !password || !confirmPassword}
                className="w-full h-11 text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-98 flex justify-center items-center gap-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang thiết lập ví Node...
                  </>
                ) : (
                  <>
                    Khởi Tạo Tài Khoản <Zap className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className={`mt-6 pt-5 border-t text-center text-xs ${isDark ? "border-white/5 text-gray-400" : "border-slate-100 text-slate-500"}`}>
              Đã có tài khoản trên node?{" "}
              <Link to="/login" className="text-indigo-500 font-bold hover:text-indigo-300 hover:underline">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;

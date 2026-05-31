import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Shield, Loader2, CheckCircle2, Lock, Smartphone, RefreshCw, Bell, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PriceAlert, fetchPriceAlerts, createPriceAlert, deletePriceAlert } from "@/services/api";

const Security = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, changePassword } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Price alert system states
  const { token } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const [alertSymbol, setAlertSymbol] = useState("BTC");
  const [alertTargetPrice, setAlertTargetPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);

  const loadAlerts = async () => {
    if (!token) return;
    setIsAlertsLoading(true);
    try {
      const data = await fetchPriceAlerts(token);
      setAlerts(data);
    } catch (e) {
      console.error("Lỗi tải cảnh báo giá:", e);
      toast.error("Không thể tải danh sách cảnh báo giá.");
    } finally {
      setIsAlertsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      loadAlerts();
    }
  }, [isAuthenticated, token]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!alertSymbol || !alertTargetPrice) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const price = Number(alertTargetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Giá mục tiêu phải là một số dương.");
      return;
    }

    setIsCreatingAlert(true);
    try {
      await createPriceAlert(token, {
        symbol: alertSymbol.toUpperCase().trim(),
        targetPrice: price,
        condition: alertCondition,
      });
      toast.success(`Đã thiết lập cảnh báo ${alertSymbol.toUpperCase()} ${alertCondition === "above" ? "vượt trên" : "giảm dưới"} $${price.toLocaleString()}`);
      setAlertTargetPrice("");
      loadAlerts();
    } catch (e: any) {
      toast.error(e.message ?? "Lỗi khi tạo cảnh báo giá.");
    } finally {
      setIsCreatingAlert(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (!token) return;
    try {
      await deletePriceAlert(token, id);
      toast.success("Đã hủy cảnh báo giá thành công.");
      loadAlerts();
    } catch (e) {
      toast.error("Lỗi khi hủy cảnh báo giá.");
    }
  };

  // ─── Redirect if not authenticated ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để truy cập trang bảo mật.");
      navigate("/login");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // ─── Handle Password Change ──────────────────────────────────────────────────
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới xác nhận không khớp");
      return;
    }

    setIsChangingPassword(true);
    const success = await changePassword(oldPassword, newPassword);
    setIsChangingPassword(false);

    if (success) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

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

        {/* ─── SECURITY CENTER WELCOME BANNER ─────────────────────────────────── */}
        <div className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0b1021]" : "bg-white border-slate-200/80 shadow-md"}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-spin-slow"></div>
              <div className="relative size-16 bg-[#0c1328] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl border border-white/10 shrink-0">
                <Shield className="size-8 text-indigo-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                  Trung Tâm Bảo Mật
                </h1>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                  <CheckCircle2 className="size-3" /> ACTIVE SECURE
                </span>
              </div>
              <p className={`text-sm mt-1.5 font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Quản lý mật khóa tài khoản của bạn, theo dõi bảo mật JWT và lịch sử hoạt động phiên.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 relative z-10 shrink-0 text-right">
            <div className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs font-bold w-fit ${isDark ? "bg-indigo-500/10 border-indigo-500/20 text-cyan-400" : "bg-indigo-50 border-indigo-100 text-indigo-700"}`}>
              <Lock className="size-4 animate-pulse" />
              JWT ENCRYPTED
            </div>
          </div>
        </div>

        {/* ─── GRID LAYOUT: PASSWORD & METRICS ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Change Password Card */}
          <div className="lg:col-span-6">
            <Card className={`overflow-hidden shadow-xl border h-full transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0a0f1d]/60" : "bg-white border-slate-200/80 shadow-md"}`}>
              <CardHeader className={`border-b py-4 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
                <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <KeyRound className="size-4.5 text-indigo-500" />
                  Đổi Mật Khẩu Đăng Nhập
                </CardTitle>
                <CardDescription className={isDark ? "text-gray-500" : "text-slate-500"}>
                  Đề xuất thay đổi mật khẩu định kỳ 30 ngày để tăng tính bảo mật.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                      Mật khẩu hiện tại
                    </label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={`block w-full border rounded-xl text-xs h-10 outline-none ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus-visible:ring-1 focus-visible:ring-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-500"}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                      Mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={`block w-full border rounded-xl text-xs h-10 outline-none ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus-visible:ring-1 focus-visible:ring-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-500"}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                      Xác nhận mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={`block w-full border rounded-xl text-xs h-10 outline-none ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus-visible:ring-1 focus-visible:ring-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-500"}`}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingPassword || !oldPassword || !newPassword || !confirmPassword}
                    className="w-full h-10 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-xl shadow-indigo-500/20"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-1" />
                        Đang cập nhật mật khẩu...
                      </>
                    ) : (
                      "Cập Nhật Mật Khẩu"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Security Status Card & 2FA Info */}
          <div className="lg:col-span-6 space-y-8">
            <Card className={`overflow-hidden shadow-xl border transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0a0f1d]/60" : "bg-white border-slate-200/80 shadow-md"}`}>
              <CardHeader className={`border-b py-4 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
                <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <Shield className="size-4.5 text-indigo-500" />
                  Mức Độ Bảo Mật Tài Khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5 text-sm">
                
                {/* 2FA Mock */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5">
                  <div className="flex items-center gap-3">
                    <Smartphone className="size-5 text-indigo-500" />
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? "text-white" : "text-slate-800"}`}>Xác thực 2 lớp (2FA)</h4>
                      <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-slate-400"}`}>Mã OTP qua điện thoại hoặc ứng dụng Authenticator</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                    OFF
                  </span>
                </div>

                {/* Session token metadata */}
                <div className="space-y-2">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    Phiên Đăng Nhập Hiện Tại
                  </h4>
                  <div className={`p-4 rounded-2xl text-xs space-y-3.5 border ${isDark ? "bg-black/20 border-white/5 text-gray-300" : "bg-slate-50 border-slate-100 text-slate-600"}`}>
                    <div className="flex justify-between">
                      <span>Thiết bị:</span>
                      <span className="font-semibold">Trình duyệt Web (Windows OS)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cơ chế mã hóa:</span>
                      <span className="font-mono text-indigo-500 dark:text-cyan-400 font-bold">HS256 (JWT Token)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trạng thái kết nối:</span>
                      <span className="text-emerald-500 font-bold">Secure SSL Socket</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>

        {/* ─── PRICE ALERT SYSTEM (FULL-WIDTH GLASS CARD) ─────────────────────── */}
        <Card className={`overflow-hidden shadow-xl border transition-all duration-300 ${isDark ? "glass-panel border-white/5 bg-[#0a0f1d]/60" : "bg-white border-slate-200/80 shadow-md"}`}>
          <CardHeader className={`border-b py-5 flex flex-row items-center justify-between gap-4 flex-wrap ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
            <div>
              <CardTitle className={`text-sm font-bold tracking-wider uppercase flex items-center gap-2.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Bell className="size-5 text-indigo-500 animate-bounce" />
                Hệ Thống Thiết Lập Cảnh Báo Giá Tự Động (Price Alerts)
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-500" : "text-slate-500"}>
                Hệ thống backend sẽ chạy ngầm quét và tự động gửi thông báo chuông cho bạn khi giá coin chạm ngưỡng mục tiêu.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAlerts}
              disabled={isAlertsLoading}
              className={`rounded-xl text-xs gap-1.5 shrink-0 ${isDark ? "border-white/10 hover:bg-white/5 text-gray-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
            >
              <RefreshCw className={`size-3.5 ${isAlertsLoading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form setup */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Tạo Cảnh Báo Mới
                </h3>
                
                <form onSubmit={handleCreateAlert} className="space-y-4">
                  {/* Token selector/input */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                      Mã Token (Symbol)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={alertSymbol}
                        onChange={(e) => setAlertSymbol(e.target.value)}
                        className={`border rounded-xl text-xs px-3 h-10 outline-none flex-1 font-bold ${isDark ? "border-white/10 bg-black/40 text-white focus:ring-1 focus:ring-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 focus:ring-1 focus:ring-indigo-500"}`}
                      >
                        <option value="BTC">BTC (Bitcoin)</option>
                        <option value="ETH">ETH (Ethereum)</option>
                        <option value="SOL">SOL (Solana)</option>
                        <option value="BNB">BNB (Binance Coin)</option>
                        <option value="ADA">ADA (Cardano)</option>
                        <option value="DOGE">DOGE (Dogecoin)</option>
                        <option value="XRP">XRP (Ripple)</option>
                        <option value="DOT">DOT (Polkadot)</option>
                        <option value="CUSTOM">Mã tùy chọn...</option>
                      </select>
                      {alertSymbol === "CUSTOM" && (
                        <Input
                          type="text"
                          required
                          placeholder="Nhập mã (ví dụ: LINK)"
                          onChange={(e) => setAlertSymbol(e.target.value.toUpperCase().trim())}
                          className={`w-32 border rounded-xl text-xs h-10 outline-none ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus-visible:ring-1 focus-visible:ring-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-500"}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Condition segment selector */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                      Điều kiện kích hoạt
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-black/40 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setAlertCondition("above")}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          alertCondition === "above"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                            : isDark
                            ? "text-gray-400 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <ArrowUpRight className="size-3.5" />
                        Vượt trên (Above)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlertCondition("below")}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          alertCondition === "below"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/10"
                            : isDark
                            ? "text-gray-400 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <ArrowDownRight className="size-3.5" />
                        Thấp hơn (Below)
                      </button>
                    </div>
                  </div>

                  {/* Target Price input */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold block ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                      Giá mục tiêu (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        step="any"
                        value={alertTargetPrice}
                        onChange={(e) => setAlertTargetPrice(e.target.value)}
                        required
                        placeholder="68500"
                        className={`block w-full border rounded-xl text-xs h-10 pl-7 outline-none ${isDark ? "border-white/10 bg-black/40 text-white placeholder-gray-500 focus-visible:ring-1 focus-visible:ring-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-500"}`}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isCreatingAlert || !alertSymbol || !alertTargetPrice}
                    className="w-full h-10 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-xl shadow-indigo-500/20"
                  >
                    {isCreatingAlert ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-1.5" />
                        Đang tạo...
                      </>
                    ) : (
                      "Kích Hoạt Cảnh Báo"
                    )}
                  </Button>
                </form>

              </div>

              {/* Alerts List */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Danh Sách Cảnh Báo Hoạt Động ({alerts.length})
                </h3>

                {isAlertsLoading && alerts.length === 0 ? (
                  <div className="py-12 flex justify-center items-center">
                    <Loader2 className="size-6 text-indigo-500 animate-spin" />
                  </div>
                ) : alerts.length === 0 ? (
                  <div className={`py-12 text-center rounded-2xl border border-dashed flex flex-col items-center gap-3 ${isDark ? "border-white/5 bg-white/2" : "border-slate-200 bg-slate-50"}`}>
                    <Bell className="size-8 text-gray-400 dark:text-gray-600" />
                    <div className="space-y-1">
                      <p className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                        Không có cảnh báo hoạt động
                      </p>
                      <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                        Hãy thiết lập giá mục tiêu ở form bên trái để kích hoạt cảnh báo giá.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={`overflow-x-auto rounded-2xl border ${isDark ? "border-white/5 bg-black/20" : "border-slate-200 bg-white"}`}>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "border-white/5 bg-white/2 text-gray-400" : "border-slate-200 bg-slate-50/50 text-slate-500"}`}>
                          <th className="p-3.5">Mã Token</th>
                          <th className="p-3.5">Điều Kiện</th>
                          <th className="p-3.5">Giá Mục Tiêu</th>
                          <th className="p-3.5">Trạng Thái</th>
                          <th className="p-3.5">Thời Gian Tạo</th>
                          <th className="p-3.5 text-center">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.map((alert) => {
                          const date = new Date(alert.createdAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          });

                          return (
                            <tr
                              key={alert._id}
                              className={`border-b transition-colors hover:bg-slate-50/5 dark:hover:bg-white/2 ${isDark ? "border-white/5 text-gray-300" : "border-slate-200 text-slate-700"}`}
                            >
                              <td className="p-3.5 font-bold text-indigo-500 dark:text-cyan-400">
                                {alert.symbol}
                              </td>
                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full border ${
                                  alert.condition === "above"
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                }`}>
                                  {alert.condition === "above" ? (
                                    <>
                                      <ArrowUpRight className="size-3" /> Vượt trên
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDownRight className="size-3" /> Giảm dưới
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="p-3.5 font-bold">
                                ${alert.targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} USD
                              </td>
                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${
                                  alert.isTriggered
                                    ? "bg-slate-500/10 border-slate-500/20 text-gray-400"
                                    : "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse-subtle"
                                }`}>
                                  {alert.isTriggered ? "Đã Khớp" : "Đang Quét"}
                                </span>
                              </td>
                              <td className="p-3.5 text-gray-500 text-[10px]">
                                {date}
                              </td>
                              <td className="p-3.5 text-center">
                                <button
                                  onClick={() => handleDeleteAlert(alert._id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                                  title="Hủy cảnh báo này"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default Security;

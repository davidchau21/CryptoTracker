import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, displayName: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  changePassword: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch user details using token
  const fetchUserProfile = async (jwtToken: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        // Backend returns response inside data field due to TransformInterceptor
        const userData = json.data;
        setUser({
          id: userData.id ?? userData._id,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          createdAt: userData.createdAt,
        });
        setToken(jwtToken);
      } else {
        // Token expired or invalid
        logout();
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Check login on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ─── LOGIN ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error("Đăng nhập thất bại", {
          description: json.message || "Email hoặc mật khẩu không chính xác.",
        });
        return false;
      }

      const { accessToken } = json.data;
      localStorage.setItem("auth_token", accessToken);
      setToken(accessToken);
      
      // Fetch user profile immediately
      await fetchUserProfile(accessToken);
      toast.success("Đăng nhập thành công!", {
        description: `Chào mừng trở lại, ${json.data.user?.displayName || "User"}!`,
      });
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối", { description: "Không thể kết nối tới máy chủ." });
      return false;
    }
  };

  // ─── REGISTER ───────────────────────────────────────────────────────────────
  const register = async (email: string, displayName: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error("Đăng ký thất bại", {
          description: json.message || "Tài khoản email đã tồn tại.",
        });
        return false;
      }

      const { accessToken } = json.data;
      localStorage.setItem("auth_token", accessToken);
      setToken(accessToken);

      await fetchUserProfile(accessToken);
      toast.success("Đăng ký thành công!", {
        description: "Tài khoản của bạn đã được tạo lập thành công.",
      });
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối", { description: "Không thể kết nối tới máy chủ." });
      return false;
    }
  };

  // ─── LOGOUT ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setToken(null);
    toast.success("Đã đăng xuất thành công");
  };

  // ─── CHANGE PASSWORD ────────────────────────────────────────────────────────
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`${BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error("Đổi mật khẩu thất bại", {
          description: json.message || "Mật khẩu cũ không chính xác.",
        });
        return false;
      }

      toast.success("Đổi mật khẩu thành công!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối", { description: "Không thể kết nối tới máy chủ." });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

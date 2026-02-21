import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("zixo_token"));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("zixo_token");
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((jwtToken) => {
    localStorage.setItem("zixo_token", jwtToken);
    const decoded = decodeToken(jwtToken);
    setToken(jwtToken);
    if (decoded) {
      setUser({
        username: decoded.sub,
        role: decoded.role,
        exp: decoded.exp,
      });
      toast.success("IDENTITY_VERIFIED: Session established.");
    }
  }, []);

  // 🛡️ CROSS-TAB SYNC: Updates state if another tab changes the token
  useEffect(() => {
    const handleSync = (e) => {
      if (e.key === "zixo_token") {
        const newToken = e.newValue;
        if (!newToken) {
          logout();
        } else {
          setToken(newToken);
          const decoded = decodeToken(newToken);
          if (decoded) {
            setUser({
              username: decoded.sub,
              role: decoded.role,
              exp: decoded.exp,
            });
          }
        }
      }
    };

    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      logout();
      setAuthLoading(false);
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const remainingTime = expiryTime - Date.now();

    if (remainingTime <= 0) {
      logout();
      setAuthLoading(false);
      return;
    }

    setUser({
      username: decoded.sub,
      role: decoded.role,
      exp: decoded.exp,
    });

    setAuthLoading(false);

    const timeout = setTimeout(() => {
      logout();
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [token, logout]);

  const isAuthenticated = !!token;

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated,
      authLoading,
    }),
    [token, user, login, logout, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

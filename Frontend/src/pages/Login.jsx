import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [shake, setShake] = useState(0);
  const [isError, setIsError] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Helper to trigger the physical feedback
  const triggerError = (title, desc) => {
    setShake((prev) => prev + 1); // Increment to trigger animation
    setIsError(true);
    toast.error(title, { description: desc });

    // Haptic feedback for mobile devices (if supported)
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    setTimeout(() => setIsError(false), 600);
  };

  const validateEmail = (email) => {
    return String(email).includes("@");
  };

  const handleLoginLogic = async () => {
    if (loading) return;

    if (!email || !password) {
      triggerError("MISSING_DATA", "Both Email and Private Key are required.");
      return;
    }
    if (!validateEmail(email)) {
      triggerError("INVALID_FORMAT", "// Identity_ID must be a valid email.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ username: email, password });
      const token = data?.token || data?.accessToken;

      if (!token) throw new Error("VAULT_LOCKED: No token received.");
      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role !== selectedRole) {
        triggerError(
          "ACCESS_DENIED",
          `// Account is ${decoded.role}, not ${selectedRole}.`,
        );
        setLoading(false);
        return;
      }

      login(token);
      toast.success("ACCESS_GRANTED", {
        description: "Welcome back, operative.",
      });
      const paths = { ADMIN: "/admin", SELLER: "/seller", USER: "/" };
      navigate(paths[decoded.role] || "/", { replace: true });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Invalid credentials.";
      triggerError("AUTHENTICATION_FAILED", `// ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLoginLogic();
  };

  return (
    <div className="max-w-md mx-auto mt-10 relative">
      <div className="absolute -inset-1 bg-goth-blood/20 blur-xl rounded-none pointer-events-none" />
      <motion.div
        animate={{
          backgroundColor: isError
            ? "rgba(225, 29, 72, 0.4)"
            : "rgba(225, 29, 72, 0.1)",
          scale: isError ? 1.2 : 1,
        }}
        className="absolute -inset-4 blur-3xl rounded-full pointer-events-none transition-colors duration-300"
      />
      {/* 🔮 ANIMATED CONTAINER */}
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        key={shake} // Force re-mount or re-animation
        className="relative bg-goth-void border border-goth-blood/50 p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8 border-b border-goth-steel pb-4">
          <h1 className="font-heading text-2xl tracking-[0.2em] text-white uppercase">
            Login_Terminal
          </h1>
          <ShieldCheck className="text-goth-blood h-5 w-5 animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">
              Identity_Type
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-goth-black border border-goth-steel p-3 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white cursor-pointer"
            >
              <option value="USER">Citizen (USER)</option>
              <option value="SELLER">Merchant (SELLER)</option>
              <option value="ADMIN">Overseer (ADMIN)</option>
            </select>
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-goth-blood transition-colors" />
            <input
              type="email"
              placeholder="Identification_ID"
              className="w-full bg-goth-black border border-goth-steel p-3 pl-10 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-goth-blood transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Private_Key"
              className="w-full bg-goth-black border border-goth-steel p-3 pl-10 pr-12 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-600 hover:text-goth-blood transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleLoginLogic}
            disabled={loading}
            className="w-full bg-goth-blood hover:bg-red-700 text-white font-heading tracking-widest py-4 transition-all active:scale-95 disabled:opacity-50 group relative overflow-hidden"
          >
            <span className="relative z-10">
              {loading ? "VERIFYING..." : "INITIATE_SESSION"}
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>

          <p className="text-center font-cyber text-[10px] text-zinc-500 tracking-wider">
            NEW_RECRUIT?{" "}
            <Link
              to="/register"
              className="text-goth-blood hover:underline font-bold"
            >
              REGISTER_ACCOUNT
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;

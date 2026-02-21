import { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { UserPlus, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "", // New Field
    role: "USER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const [isError, setIsError] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const triggerError = (title, desc) => {
    setShake((prev) => prev + 1);
    setIsError(true);
    toast.error(title, { description: desc });

    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    setTimeout(() => setIsError(false), 600);
  };

  const validateEmail = (email) => email.includes("@");

  const handleRegisterLogic = async () => {
    if (loading) return;

    // 1. Check for empty fields
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      triggerError("MISSING_DATA", "All identity fields are required.");
      return;
    }

    // 2. Browser-style email check
    if (!validateEmail(formData.username)) {
      triggerError("INVALID_FORMAT", "// Identity_ID must be a valid email.");
      return;
    }

    // 3. Password Length check
    if (formData.password.length < 6) {
      triggerError("SECURITY_FLAW", "Password too short (min 6 chars)");
      return;
    }

    // 4. ⚔️ DUAL VERIFICATION CHECK
    if (formData.password !== formData.confirmPassword) {
      triggerError("MISMATCH_DETECTED", "// Private keys do not synchronize.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });
      toast.success("REGISTRATION_COMPLETE", {
        description: "Identity confirmed. Proceed to uplink.",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      let errorMessage =
        error?.response?.data?.message || "Identity creation failed.";
      if (error.response) {
        // ⚔️ Handle 409 Conflict (User already exists)
        if (error.response.status === 409) {
          errorMessage =
            "IDENTITY_EXISTS: This ID is already recorded in the master ledger.";
        }
        // ⚔️ Handle 400 Bad Request (Validation errors)
        else if (error.response.status === 400) {
          errorMessage =
            error.response.data?.message || "Invalid registration data.";
        }
        // ⚔️ Handle general server errors
        else {
          errorMessage =
            error.response.data?.message || "Internal Protocol Error.";
        }
      }
      triggerError("PROTOCOL_ERROR", `// ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegisterLogic();
  };

  return (
    <div className="max-w-md mx-auto mt-10 relative px-4">
      {/* 🔴 CRITICAL FAILURE GLOW */}
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
        key={shake}
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`relative bg-goth-void border ${isError ? "border-goth-blood" : "border-goth-blood/50"} p-8 shadow-2xl transition-colors duration-300`}
      >
        <div className="flex justify-between items-center mb-8 border-b border-goth-steel pb-4">
          <h1 className="font-heading text-2xl tracking-[0.2em] text-white uppercase">
            Register
          </h1>
          <UserPlus
            className={`${isError ? "text-white" : "text-goth-blood"} h-5 w-5 animate-pulse`}
          />
        </div>

        <div className="space-y-5">
          {/* Identity Selection */}
          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block font-bold">
              Assign Identity
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-goth-black border border-goth-steel p-3 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white cursor-pointer"
            >
              <option value="USER">Citizen (Buyer)</option>
              <option value="SELLER">Merchant (Seller)</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-goth-blood transition-colors" />
            <input
              name="username"
              type="text"
              placeholder="Email_Address"
              className="w-full bg-goth-black border border-goth-steel p-3 pl-10 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white transition-all"
              value={formData.username}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-goth-blood transition-colors" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create_Private_Key"
              className="w-full bg-goth-black border border-goth-steel p-3 pl-10 pr-12 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white transition-all"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-600 hover:text-goth-blood p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative group">
            <ShieldCheck
              className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${formData.password && formData.password === formData.confirmPassword ? "text-green-500" : "text-zinc-600 group-focus-within:text-goth-blood"}`}
            />
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Verify_Private_Key"
              className="w-full bg-goth-black border border-goth-steel p-3 pl-10 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white transition-all"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Submit Action */}
          <button
            type="button"
            onClick={handleRegisterLogic}
            disabled={loading}
            className="w-full bg-goth-blood hover:bg-red-700 text-white font-heading tracking-widest py-4 transition-all active:scale-95 disabled:opacity-50 group relative overflow-hidden"
          >
            <span className="relative z-10">
              {loading ? "INITIALIZING..." : "CREATE_IDENTITY"}
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>

          <p className="text-center font-cyber text-[10px] text-zinc-500 tracking-wider">
            ALREADY_KNOWN?{" "}
            <Link
              to="/login"
              className="text-goth-blood hover:underline font-bold uppercase"
            >
              Login_to_Session
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;

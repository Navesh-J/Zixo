import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Loader2, RefreshCcw, AlertCircle } from "lucide-react";

function AuthGate({ children }) {
  const { authLoading, token: currentToken } = useAuth();
  const [isDesynced, setIsDesynced] = useState(false);

  // Monitor for identity mismatches between tabs
  useEffect(() => {
    const checkSync = () => {
      const latestToken = localStorage.getItem("zixo_token");

      // If the token in storage changed while this tab was open, lockdown the UI
      if (latestToken !== currentToken) {
        setIsDesynced(true);
      }
    };

    window.addEventListener("storage", checkSync);
    window.addEventListener("focus", checkSync);

    return () => {
      window.removeEventListener("storage", checkSync);
      window.removeEventListener("focus", checkSync);
    };
  }, [currentToken]);

  const handleResync = () => {
    window.location.reload();
  };

  // 🚨 OVERRIDE: SESSION DESYNC DETECTED
  if (isDesynced) {
    return (
      <div className="fixed inset-0 bg-goth-black/95 backdrop-blur-xl flex items-center justify-center z-9999 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-goth-void border border-goth-blood p-10 text-center shadow-[0_0_100px_rgba(225,29,72,0.15)]"
        >
          <AlertCircle
            className="text-goth-blood mx-auto mb-6 animate-pulse"
            size={56}
          />

          <h2 className="font-heading text-3xl text-white tracking-[0.2em] uppercase mb-4">
            TERMINAL_DESYNC
          </h2>

          <p className="font-cyber text-[10px] text-zinc-500 uppercase tracking-[0.2em] leading-loose mb-10">
            Identity mismatch detected across active sectors.
            <br />
            Session integrity is compromised.
            <br />
            Manual re-initialization required.
          </p>

          <button
            onClick={handleResync}
            className="w-full bg-white text-black font-heading tracking-[0.3em] py-5 hover:bg-goth-blood hover:text-white transition-all flex items-center justify-center gap-3 group"
          >
            <RefreshCcw
              size={20}
              className="group-hover:rotate-180 transition-transform duration-700"
            />
            RE_INITIALIZE_SESSION
          </button>
        </motion.div>
      </div>
    );
  }

  // ⏳ SYSTEM BOOT
  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-goth-black flex flex-col items-center justify-center z-999">
        <div className="absolute w-64 h-64 bg-goth-blood/5 blur-[100px] rounded-full animate-pulse" />

        <div className="relative flex flex-col items-center">
          <Loader2
            className="h-12 w-12 text-goth-blood animate-spin mb-6"
            strokeWidth={1}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-cyber text-[10px] tracking-[0.5em] text-zinc-500 uppercase"
          >
            Synchronizing_Identity...
          </motion.div>

          <div className="w-32 h-px bg-goth-steel mt-4 relative overflow-hidden">
            <motion.div
              animate={{ x: [-128, 128] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full bg-goth-blood"
            />
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default AuthGate;

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Terminal, ShieldAlert, Cpu, Activity } from "lucide-react";

const gatewayUrl = "https://api-gateway-gelc.onrender.com/ping";

const directWakeUrls = [
  "https://discovery-server-2rg6.onrender.com/",
  "https://auth-service-6c0q.onrender.com/ping",
  "https://product-service-y01r.onrender.com/ping",
  "https://order-service-iyqj.onrender.com/ping",
  "https://inventory-service-9zoo.onrender.com/ping",
];

export default function WakeLoader({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIATING_BOOT_SEQUENCE...");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const addLog = (msg) => {
    setLogs((prev) => [...prev.slice(-5), `> ${msg}`]);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const wakeAll = async () => {
    const startTime = Date.now();
    setError(null);
    setProgress(5);
    addLog("Pinging all peripheral nodes...");

    // Fire-and-forget
    directWakeUrls.forEach((url) => {
      fetch(url, { mode: "no-cors" }).catch(() => {});
    });

    let ready = false;
    let attempts = 0;
    const maxAttempts = 50;

    while (!ready && attempts < maxAttempts) {
      try {
        const res = await fetch(gatewayUrl);
        if (res.ok) {
          ready = true;
          break;
        }
      } catch (err) {}

      attempts++;
      const currentProgress = Math.min(10 + attempts * 1.5, 70);
      setProgress(currentProgress);
      setStatus(`WAKING_GATEWAY [ATTEMPT_${attempts}]`);
      if (attempts % 3 === 0) addLog("Waiting for Gateway response...");
      await sleep(4000);
    }

    if (!ready) {
      setError("GATEWAY_TIMEOUT: Critical system failure.");
      return;
    }

    const duration = Date.now() - startTime;
    const isColdStart = duration > 10000; // If it took > 10s, it was definitely asleep

    if (isColdStart) {
      setIsFinishing(true);
      addLog("Gateway awake. Stabilizing micro-services...");

      // Secondary 30s Wait ONLY for Cold Start
      for (let i = 0; i <= 30; i++) {
        setStatus(`STABILIZING_NODES [${30 - i}s]`);
        setProgress(70 + i * 1); // Moves from 70% to 100%
        if (i === 10) addLog("Product_Service: Initializing...");
        if (i === 20) addLog("Inventory_Sync: Commencing...");
        await sleep(1000);
      }
    }

    setProgress(100);
    setStatus("UPLINK_STABILIZED");
    addLog("All systems operational. Access granted.");
    await sleep(1000);
    onReady();
  };

  useEffect(() => {
    wakeAll();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-goth-void text-white relative overflow-hidden font-cyber">
      {/* Visual Effects */}
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,29,72,0.05)_0%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex items-center justify-between mb-8 border-b border-goth-steel pb-4">
          <div className="flex items-center gap-3">
            <Cpu className="text-goth-blood animate-pulse" size={20} />
            <h1 className="text-xl font-heading tracking-[0.3em]">
              SYSTEM_BOOT
            </h1>
          </div>
          <Activity className="text-zinc-700" size={16} />
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-zinc-900 mb-4 overflow-hidden border border-zinc-800">
          <motion.div
            className="absolute top-0 left-0 h-full bg-goth-blood shadow-[0_0_15px_rgba(225,29,72,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-between text-[10px] tracking-widest text-zinc-500 mb-8">
          <span>{status}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Boot Logs Terminal */}
        <div className="bg-black/40 border border-goth-steel/30 p-4 h-32 mb-8">
          {logs.map((log, i) => (
            <p key={i} className="text-[10px] text-zinc-400 mb-1 leading-none">
              {log}
            </p>
          ))}
          {!error && (
            <span className="inline-block w-2 h-3 bg-goth-blood animate-pulse ml-1" />
          )}
        </div>

        <p className="text-[9px] text-center text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">
          Navesh_Terminal // Microservices are hosted on free-tier
          infrastructure.
          {isFinishing
            ? " Final synchronization in progress."
            : " Initial boot sequence takes 2-4 mins."}
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 border border-goth-blood bg-goth-blood/10 text-center"
          >
            <ShieldAlert className="mx-auto mb-2 text-goth-blood" size={24} />
            <p className="text-xs text-goth-blood font-bold mb-4">{error}</p>
            <button
              onClick={wakeAll}
              className="bg-goth-blood text-white text-[10px] px-6 py-2 tracking-widest hover:bg-red-700 transition-all uppercase"
            >
              Retry_Boot
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

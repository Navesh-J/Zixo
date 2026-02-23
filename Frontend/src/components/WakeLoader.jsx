import { useEffect, useState } from "react";

const gatewayUrl = "https://api-gateway-gelc.onrender.com/ping";

const directWakeUrls = [
  "https://discovery-server-2rg6.onrender.com/", // Eureka
  "https://auth-service-6c0q.onrender.com/ping",
  "https://product-service-y01r.onrender.com/ping",
  "https://order-service-iyqj.onrender.com/ping",
  "https://inventory-service-9zoo.onrender.com/ping",
];

export default function WakeLoader({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("Initializing services...");
  const [error, setError] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const wakeAll = async () => {
    setError(null);
    setProgress(5);

    // 🔥 Fire-and-forget wake calls (ignore CORS completely)
    directWakeUrls.forEach((url) => {
      fetch(url, { mode: "no-cors" }).catch(() => {});
    });

    setCurrent("Waking API Gateway...");
    setProgress(20);

    // 🎯 Wait for Gateway to actually be ready
    let ready = false;
    let attempts = 0;
    const maxAttempts = 60; // ~200 seconds max (5s * 60)

    while (!ready && attempts < maxAttempts) {
      try {
        const res = await fetch(gatewayUrl);
        if (res.ok) {
          ready = true;
          break;
        }
      } catch (err) {
        // ignore errors while waking
      }

      attempts++;
      setProgress(Math.min(20 + attempts * 2, 90));
      await sleep(5000);
    }

    if (!ready) {
      setError("Gateway failed to start. Please retry.");
      return;
    }

    setProgress(100);
    setCurrent("All services awake.");
    setTimeout(onReady, 800);
  };

  useEffect(() => {
    wakeAll();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl mb-6">Initializing Servers</h1>

      <div className="w-72 h-2 bg-gray-800 rounded overflow-hidden mb-4">
        <div
          className="h-full bg-red-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p>Servers are asleep so it can take around 2-4 minutes</p>
      <p className="text-sm text-gray-400 mt-2">{current}</p>

      {error && (
        <div className="mt-6 text-red-500 text-sm text-center">
          {error}
          <button
            onClick={wakeAll}
            className="mt-3 px-4 py-1 bg-red-700 hover:bg-red-600 rounded text-white text-xs uppercase tracking-widest"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
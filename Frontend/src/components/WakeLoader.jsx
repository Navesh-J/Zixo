import { useEffect, useState } from "react";

const services = [
  { name: "API Service", url: "https://api-gateway-gelc.onrender.com/ping" },
  { name: "Auth Service", url: "https://auth-service-6c0q.onrender.com/ping" },
  { name: "Product Service", url: "https://product-service-y01r.onrender.com/ping" },
  { name: "Order Service", url: "https://order-service-iyqj.onrender.com/ping" },
  { name: "Inventory Service", url: "https://inventory-service-9zoo.onrender.com/ping" },
];

export default function WakeLoader({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("Initializing services...");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const wakeService = async (service) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s max

    try {
      const res = await fetch(service.url, {
        method: "GET",
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`${service.name} failed`);
      }

      return { success: true };
    } catch (err) {
      return { success: false, service: service.name };
    } finally {
      clearTimeout(timeout);
    }
  };

  const wakeAll = async () => {
    setError(null);
    setLoading(true);
    setProgress(0);

    let completed = 0;

    const results = await Promise.all(
      services.map(async (service) => {
        setCurrent(`Waking ${service.name}...`);
        const result = await wakeService(service);
        completed++;
        setProgress(Math.round((completed / services.length) * 100));
        return result;
      })
    );

    const failed = results.filter((r) => !r.success);

    if (failed.length > 0) {
      setError(
        `Failed: ${failed.map((f) => f.service).join(", ")}`
      );
      setLoading(false);
      return;
    }

    setCurrent("All services awake.");
    setTimeout(onReady, 600);
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
      <p>Servers are asleep so it can take around 3-4 minutes</p>

      <p className="text-sm text-gray-400">{current}</p>

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

      {!error && !loading && (
        <p className="mt-4 text-green-500 text-sm">Ready</p>
      )}
    </div>
  );
}
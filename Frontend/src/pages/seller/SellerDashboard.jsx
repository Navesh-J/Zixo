import { useEffect, useState } from "react";
import { getSellerAnalytics } from "../../services/orderService";
import { motion } from "framer-motion";
import { Activity, Zap, TrendingUp, Package, Loader2 } from "lucide-react";

function SellerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getSellerAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-goth-blood" />
      </div>
    );

  if (!analytics)
    return (
      <p className="text-goth-blood font-cyber">
        ERROR_01: Analytics_Uplink_Failed
      </p>
    );

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-4 border-b border-goth-steel pb-6">
        <Activity className="text-goth-blood" />
        <h1 className="text-4xl font-heading tracking-widest uppercase text-white">
          Merchant_Terminal
        </h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total_Orders"
          value={analytics.totalOrders}
          icon={<Zap size={20} />}
          color="border-goth-blood"
        />
        <StatCard
          title="Total_Revenue"
          value={`₹${analytics.totalRevenue}`}
          icon={<TrendingUp size={20} />}
          color="border-white"
        />
        <StatCard
          title="Artifacts_Sold"
          value={analytics.totalItemsSold}
          icon={<Package size={20} />}
          color="border-goth-blood"
        />
      </div>

      {/* Top Products Table-style */}
      <div className="bg-goth-void border border-goth-steel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <TrendingUp size={100} />
        </div>
        <h2 className="font-heading text-xl tracking-[0.2em] text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 bg-goth-blood animate-pulse" />{" "}
          PERFORMANCE_LOGS
        </h2>

        <div className="space-y-4">
          {analytics.topProducts.length === 0 ? (
            <p className="font-cyber text-xs text-zinc-600 italic">
              // No trade data available yet.
            </p>
          ) : (
            analytics.topProducts.map((product) => (
              <div
                key={product.productId}
                className="flex justify-between items-center bg-goth-black/50 border border-goth-steel/30 p-4 hover:border-goth-blood/50 transition-colors group"
              >
                <span className="font-cyber text-sm text-zinc-300 group-hover:text-white uppercase tracking-widest">
                  {product.productName}
                </span>
                <div className="text-right">
                  <span className="font-cyber text-[10px] text-zinc-600 block uppercase">
                    Volume / Rev
                  </span>
                  <span className="font-cyber text-white text-sm font-bold tracking-tighter">
                    {product.quantitySold}{" "}
                    <span className="text-goth-blood">/</span> ₹
                    {product.revenue}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-goth-void p-8 border-l-4 ${color} shadow-2xl relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 p-4 text-zinc-800">{icon}</div>
    <p className="font-cyber text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
      {title}
    </p>
    <h2 className="font-heading text-3xl font-bold text-white tracking-tighter">
      {value}
    </h2>
  </motion.div>
);

export default SellerDashboard;

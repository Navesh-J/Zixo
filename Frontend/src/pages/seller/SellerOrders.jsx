import { useEffect, useState } from "react";
import { getSellerOrders } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { Terminal, Calendar, User, Hash, Loader2 } from "lucide-react";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getSellerOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load seller orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-goth-blood" />
      </div>
    );

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-4 border-b border-goth-steel pb-6">
        <Terminal className="text-goth-blood" />
        <h1 className="text-4xl font-heading tracking-widest uppercase text-white">
          Trade_Ledger
        </h1>
      </header>

      <div className="grid gap-6">
        {orders.map((order) => {
          const sellerItems = order.items.filter(
            (item) => item.sellerUsername === user.username,
          );
          if (sellerItems.length === 0) return null;

          return (
            <div
              key={order.id}
              className="bg-goth-void border border-goth-steel p-8 relative group"
            >
              {/* Status Badge */}
              <div className="absolute top-0 right-0 px-4 py-1 bg-goth-black border-l border-b border-goth-steel font-cyber text-[9px] uppercase tracking-[0.2em] text-goth-blood">
                {order.orderStatus}
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 border-b border-goth-steel/20 pb-4">
                <div className="space-y-1">
                  <h2 className="font-heading text-lg text-white tracking-[0.2em] flex items-center gap-2">
                    <Hash size={14} className="text-goth-blood" /> ORDER_
                    {order.id}
                  </h2>
                  <div className="flex items-center gap-4 text-[9px] font-cyber text-zinc-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={10} /> Client_ID: Hidden
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-cyber text-[9px] text-zinc-600 uppercase tracking-widest mb-2 border-b border-goth-steel/10 pb-1">
                  Manifest_Items
                </p>
                {sellerItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center font-cyber text-xs uppercase group/item"
                  >
                    <span className="text-zinc-300 group-hover/item:text-white transition-colors">
                      {item.productName}{" "}
                      <span className="text-zinc-600">x{item.quantity}</span>
                    </span>
                    <span className="text-white font-bold tracking-tighter">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-goth-steel/20 flex justify-between items-end">
                <div>
                  <p className="font-cyber text-[9px] text-zinc-600 uppercase tracking-widest">
                    Share_Revenue
                  </p>
                  <p className="font-cyber text-xl text-white font-bold tracking-tighter">
                    ₹
                    {sellerItems.reduce(
                      (acc, i) => acc + i.price * i.quantity,
                      0,
                    )}
                  </p>
                </div>
                <div className="h-2 w-16 bg-goth-blood/10 border border-goth-blood/20 animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SellerOrders;

import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder, payOrder } from "../services/orderService";
import CancelModal from "../components/CancelModal";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, XCircle, AlertCircle, Terminal } from "lucide-react";
import { toast } from "sonner";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      toast.error("DATA_RETRIEVAL_ERROR: Failed to fetch order logs.");
    }
  };

  const handleCancel = async (orderId, reason) => {
    try {
      setLoadingAction(orderId);
      const updated = await cancelOrder(orderId, reason);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(null);
      // Toast already handled in Modal, but good to have a backup if needed
    } catch (err) {
      toast.error("CANCELLATION_FAILED: Internal system error.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePay = async (orderId) => {
    try {
      setLoadingAction(orderId);
      const updated = await payOrder(orderId);
      toast.success("PAYMENT_SUCCESSFUL: Artifacts finalized.");
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      toast.error("PAYMENT_REJECTED: Check terminal balance.");
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "CANCELLED": return { style: "border-red-900 text-red-500 bg-red-500/5", icon: <XCircle size={14}/> };
      case "COMPLETED": return { style: "border-emerald-900 text-emerald-500 bg-emerald-500/5", icon: <CheckCircle2 size={14}/> };
      case "INVENTORY_RESERVED": return { style: "border-cyan-900 text-cyan-500 bg-cyan-500/5", icon: <AlertCircle size={14}/> };
      default: return { style: "border-amber-900 text-amber-500 bg-amber-500/5", icon: <Clock size={14}/> };
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex items-center gap-4 mb-10 border-b border-goth-steel pb-6">
        <Terminal className="text-goth-blood" />
        <h1 className="font-heading text-4xl tracking-widest uppercase text-white">Order_Archives</h1>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-goth-steel">
          <p className="font-cyber text-zinc-600 uppercase tracking-[0.2em]">No history found in database.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const config = getStatusConfig(order.orderStatus);
            return (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={order.id}
                className="bg-goth-void border border-goth-steel p-8 group hover:border-goth-blood/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-goth-steel/30 pb-4 mb-4">
                  <div>
                    <h2 className="font-heading text-xl text-white tracking-widest uppercase flex items-center gap-3">
                      Order_Sequence <span className="text-goth-blood">#{order.id}</span>
                    </h2>
                    <p className="font-cyber text-[9px] text-zinc-600 uppercase mt-1">Logged_At: {new Date(order.orderDate).toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 border font-cyber text-[10px] tracking-widest uppercase ${config.style}`}>
                    {config.icon}
                    {order.orderStatus}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between font-cyber text-xs uppercase text-zinc-400">
                      <span>{item.productName} <span className="text-zinc-600">× {item.quantity}</span></span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6 pt-4 border-t border-goth-steel/30">
                  <div className="font-cyber">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest block">Accumulated_Value</span>
                    <span className="text-2xl text-white font-bold tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-4">
                    {order.orderStatus === "INVENTORY_RESERVED" && (
                      <button onClick={() => handlePay(order.id)} disabled={loadingAction === order.id}
                        className="bg-white text-black font-heading text-[10px] tracking-widest px-6 py-2 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {loadingAction === order.id ? "SYNC..." : "PAY_NOW"}
                      </button>
                    )}
                    {order.orderStatus !== "COMPLETED" && order.orderStatus !== "CANCELLED" && (
                      <button onClick={() => setSelectedOrder(order)} disabled={loadingAction === order.id}
                        className="border border-goth-blood text-goth-blood font-heading text-[10px] tracking-widest px-6 py-2 hover:bg-goth-blood hover:text-white transition-all disabled:opacity-50"
                      >
                        TERMINATE
                      </button>
                    )}
                  </div>
                </div>

                {order.orderStatus === "CANCELLED" && order.cancellationReason && (
                  <div className="mt-4 p-3 bg-red-900/10 border-l-2 border-red-500 font-cyber text-[10px] text-red-400 italic">
                    VOID_REASON: {order.cancellationReason}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <CancelModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onConfirm={handleCancel} />
      )}
    </div>
  );
}

export default MyOrders;
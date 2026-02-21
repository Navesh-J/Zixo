import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { ShieldCheck, CreditCard } from "lucide-react";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const { cartItems, cartItemsForOrder, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || cartItems.length === 0) return null;

  const handlePlaceOrder = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const order = await createOrder(cartItemsForOrder);
      toast.success("TRANSACTION_INITIATED: Order placed successfully.");
      clearCart();
      navigate("/order-success", { replace: true, state: { orderId: order?.orderId } });
    } catch (error) {
      toast.error(error?.response?.data?.message || "TRANSACTION_FAILED: Sequence interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-goth-void border border-goth-blood/30 p-10 relative overflow-hidden">
        {/* Decorative scanline overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-goth-blood/5 to-transparent h-1 pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-10 border-b border-goth-steel pb-6">
          <ShieldCheck className="text-goth-blood" size={32} />
          <h1 className="font-heading text-3xl tracking-widest text-white uppercase">Checkout_Terminal</h1>
        </div>

        <div className="space-y-6 mb-10">
          <p className="font-cyber text-[10px] text-zinc-500 tracking-[0.3em] uppercase mb-4 border-b border-goth-steel/30 pb-2">Artifact_Manifest</p>
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between items-end border-b border-goth-steel/20 pb-2">
              <div className="font-cyber text-xs text-white uppercase tracking-wider">
                {item.productName} <span className="text-zinc-600">x{item.quantity}</span>
              </div>
              <div className="font-cyber text-zinc-400 text-xs">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-goth-black border border-goth-steel p-6 flex justify-between items-center mb-10">
          <span className="font-heading text-sm tracking-widest text-zinc-500 uppercase">Settlement_Amount</span>
          <span className="font-cyber text-3xl text-goth-blood font-bold tracking-tighter">${totalAmount.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-goth-blood hover:bg-red-700 text-white font-heading tracking-[0.4em] py-5 transition-all disabled:opacity-50 relative group flex items-center justify-center gap-3"
        >
          <CreditCard size={20} />
          <span>{loading ? "AUTHORIZING..." : "CONFIRM_TRANSACTION"}</span>
        </button>
        
        <p className="text-center mt-6 font-cyber text-[9px] text-zinc-600 tracking-widest uppercase italic">
          // Digital signature will be logged upon confirmation.
        </p>
      </div>
    </div>
  );
}

export default Checkout;
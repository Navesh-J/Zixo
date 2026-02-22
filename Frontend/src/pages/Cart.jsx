import { useCart } from "../context/CartContext";
import { BASE_URL } from "../services/constants";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Box } from "lucide-react";
import { motion } from "framer-motion";


function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();

  // Helper to resolve artifact visualization
  const getImageUrl = (url) => {
    if (!url) return "/placeholder.png";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <ShoppingBag size={48} className="text-zinc-800 animate-pulse" />
        <h2 className="font-heading text-2xl tracking-[0.2em] text-zinc-500 uppercase text-center">
          Manifest_Empty
        </h2>
        <Link
          to="/"
          className="text-goth-blood font-cyber text-xs border-b border-goth-blood pb-1 hover:text-white hover:border-white transition-all uppercase"
        >
          GO_TO_MARKET
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="font-heading text-4xl tracking-widest mb-10 border-l-4 border-goth-blood pl-6 uppercase text-white">
        Inventory_Logs
      </h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <motion.div
            layout
            key={item.productId}
            className="bg-goth-void border border-goth-steel p-4 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-goth-blood transition-all duration-300 shadow-xl"
          >
            <div className="flex items-center gap-6 flex-1 w-full">
              {/* 🖼️ ARTIFACT THUMBNAIL (STAGED) */}
              <div className="relative h-20 w-20 bg-goth-black border border-goth-steel shrink-0 overflow-hidden group-hover:border-goth-blood/50 transition-colors">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.productName}
                  className="h-full w-full object-cover opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=VOID";
                  }}
                />
                {/* Overlay Scanline for thumbnails */}
                <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-goth-blood/5 to-transparent h-px animate-[scanline_2s_linear_infinite]" />
              </div>

              <div className="space-y-1">
                <h2 className="font-heading text-xl text-white tracking-wider uppercase group-hover:text-goth-blood transition-colors">
                  {item.productName}
                </h2>
                <p className="font-cyber text-[10px] text-zinc-500 uppercase tracking-tighter">
                  Unit_Val: <span className="text-white">₹{item.price}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 border-goth-steel/20 pt-4 md:pt-0">
              {/* Quantity Controller */}
              <div className="flex items-center border border-goth-steel bg-goth-black overflow-hidden">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  className="p-2 hover:bg-goth-blood hover:text-white text-zinc-500 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-cyber text-sm font-bold border-x border-goth-steel py-1 text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  className="p-2 hover:bg-goth-blood hover:text-white text-zinc-500 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal Display */}
              <div className="text-right min-w-28">
                <p className="text-[9px] text-zinc-600 uppercase font-cyber mb-1">
                  Sub_Total
                </p>
                <p className="font-cyber text-goth-blood font-bold tracking-tighter text-lg">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Purge Action */}
              <button
                onClick={() => removeFromCart(item.productId)}
                className="p-2 text-zinc-700 hover:text-goth-blood transition-colors group/trash"
              >
                <Trash2
                  size={20}
                  className="group-hover/trash:scale-110 transition-transform"
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Checkout Matrix */}
      <div className="mt-10 pt-8 border-t border-goth-steel flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase font-cyber tracking-widest mb-1">
            Total_Resource_Value
          </p>
          <div className="font-cyber text-4xl text-white font-bold tracking-tighter">
            ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        <Link
          to="/checkout"
          className="bg-goth-blood text-white font-heading tracking-[0.3em] px-10 py-4 hover:bg-red-700 transition-all active:scale-95 text-center w-full md:w-auto uppercase shadow-[0_0_20px_rgba(225,29,72,0.2)]"
        >
          Proceed_To_Finalize
        </Link>
      </div>
    </div>
  );
}

export default Cart;

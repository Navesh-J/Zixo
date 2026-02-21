import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <ShoppingBag size={48} className="text-zinc-800" />
        <h2 className="font-heading text-2xl tracking-[0.2em] text-zinc-500 uppercase text-center">
          Manifest_Empty
        </h2>
        <Link to="/" className="text-goth-blood font-cyber text-xs border-b border-goth-blood pb-1 hover:text-white hover:border-white transition-all">
          GO_TO_MARKET
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-heading text-4xl tracking-widest mb-10 border-l-4 border-goth-blood pl-6 uppercase text-white">
        Inventory_Logs
      </h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <motion.div
            layout
            key={item.productId}
            className="bg-goth-void border border-goth-steel p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-goth-blood/50 transition-colors"
          >
            <div className="flex-1">
              <h2 className="font-heading text-xl text-white tracking-wider uppercase group-hover:text-goth-blood transition-colors">
                {item.productName}
              </h2>
              <p className="font-cyber text-xs text-zinc-500 mt-1 uppercase tracking-tighter">
                Unit_Val: <span className="text-white">${item.price}</span>
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-goth-steel bg-goth-black overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-2 hover:bg-goth-blood hover:text-white text-zinc-500 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-cyber text-sm font-bold border-x border-goth-steel py-2">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-2 hover:bg-goth-blood hover:text-white text-zinc-500 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-right min-w-25">
                <p className="text-[10px] text-zinc-600 uppercase font-cyber mb-1">Sub_Total</p>
                <p className="font-cyber text-goth-blood font-bold tracking-tighter">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="p-2 text-zinc-700 hover:text-red-500 transition-colors group/trash"
              >
                <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-goth-steel flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase font-cyber tracking-widest mb-1">Total_Resource_Value</p>
          <div className="font-cyber text-4xl text-white font-bold tracking-tighter">
            ${totalAmount.toFixed(2)}
          </div>
        </div>

        <Link
          to="/checkout"
          className="bg-goth-blood text-white font-heading tracking-[0.3em] px-10 py-4 hover:bg-red-700 transition-all active:scale-95 text-center w-full md:w-auto uppercase"
        >
          Proceed_To_Finalize
        </Link>
      </div>
    </div>
  );
}

export default Cart;
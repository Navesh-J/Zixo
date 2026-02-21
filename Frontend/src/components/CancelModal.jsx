import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const reasons = [
  "Ordered by mistake",
  "Found better price elsewhere",
  "Delivery taking too long",
  "Payment issue",
  "Other",
];

function CancelModal({ order, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const finalReason = selectedReason === "Other" ? otherReason : selectedReason;

    if (!finalReason) {
      toast.error("REQUIRED: Select a cancellation reason.");
      return;
    }

    try {
      setLoading(true);
      await onConfirm(order.id, finalReason);
      toast.success("ORDER_TERMINATED: Cancellation processed.");
      onClose();
    } catch (err) {
      toast.error("PROCESS_FAILED: Could not cancel order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-200 flex justify-center items-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-goth-void border border-goth-blood w-full max-w-md p-8 shadow-[0_0_50px_rgba(225,29,72,0.2)]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-goth-steel pb-4">
          <AlertTriangle className="text-goth-blood" size={24} />
          <h2 className="font-heading text-xl tracking-widest text-white uppercase">
            Cancel_Order #{order.id}
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          {reasons.map((reason) => (
            <label key={reason} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="reason"
                className="appearance-none w-4 h-4 border border-goth-steel checked:bg-goth-blood checked:border-white transition-all rounded-none cursor-pointer"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
              />
              <span className="font-cyber text-[11px] uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                {reason}
              </span>
            </label>
          ))}
        </div>

        {selectedReason === "Other" && (
          <motion.textarea
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="w-full bg-goth-black border border-goth-steel rounded-none p-3 mt-2 font-cyber text-xs text-white focus:border-goth-blood outline-none transition-all placeholder:text-zinc-700"
            placeholder="EXPLAIN_VOID_REASON..."
            rows={3}
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button 
            onClick={onClose} 
            className="font-heading text-[10px] tracking-[0.2em] text-zinc-500 hover:text-white transition-colors py-2 px-4 border border-transparent hover:border-goth-steel"
          >
            ABORT_CANCEL
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-goth-blood text-white font-heading text-[10px] tracking-[0.2em] px-6 py-3 hover:bg-red-700 transition-all disabled:opacity-50 relative overflow-hidden group"
          >
            <span className="relative z-10">{loading ? "PROCESSING..." : "CONFIRM_TERMINATION"}</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CancelModal;
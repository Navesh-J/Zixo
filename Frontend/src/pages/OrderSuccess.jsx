import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Hash } from "lucide-react";

function OrderSuccess() {
  const { state } = useLocation();

  return (
    <div className="max-w-2xl mx-auto py-10 md:py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        /* Adjusted p-6 for mobile and p-12 for larger screens to save X-axis space */
        className="relative overflow-hidden border bg-goth-void border-goth-blood/40 p-6 sm:p-12 text-center shadow-[0_0_60px_rgba(225,29,72,0.15)]"
      >
        {/* Subtle background "noise" or texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="relative z-10">
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="rounded-none border-2 border-goth-blood p-4 shadow-[0_0_20px_rgba(225,29,72,0.4)]">
              <CheckCircle2 size={48} className="text-goth-blood" />
            </div>
          </motion.div>

          <h1 className="mb-4 font-heading text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-widest sm:tracking-[0.2em] text-white">
            TRANSACTION_COMPLETE
          </h1>

          <div className="mb-10 space-y-6">
            {state?.orderId && (
              <div className="inline-flex items-center gap-2 border border-goth-steel bg-goth-black px-4 py-2">
                <Hash size={12} className="text-goth-blood" />
                <span className="font-cyber text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-400">
                  Log_ID: <span className="text-white">{state.orderId}</span>
                </span>
              </div>
            )}

            <p className="font-cyber text-[10px] sm:text-xs uppercase leading-loose tracking-widest text-zinc-500">
              The settlement has been logged in the master ledger.
              <br />
              Your artifacts are being prepared for transport.
            </p>
          </div>

          <div className="border-t border-goth-steel pt-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 bg-white px-6 md:px-8 py-4 font-heading text-xs md:text-sm uppercase tracking-[0.3em] text-black transition-all hover:bg-goth-blood hover:text-white"
            >
              Return_To_Void
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-center font-cyber text-[9px] uppercase tracking-[0.5em] text-zinc-700">
        // Zixo_Protocol_Active //
      </p>
    </div>
  );
}

export default OrderSuccess;
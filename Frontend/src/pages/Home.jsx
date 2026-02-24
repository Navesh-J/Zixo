import { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../services/productService.js";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { Loader2, Hash, Activity } from "lucide-react";
import { toast } from "sonner";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryStatus, setRetryStatus] = useState("");

  const fetchProductsWithRetry = useCallback(async (attempt = 1) => {
    const maxAttempts = 5;
    const baseDelay = 4000; // 4 seconds between retries

    try {
      if (attempt > 1) {
        setRetryStatus(`SYNCHRONIZING_ROUTE [ATTEMPT_${attempt}/${maxAttempts}]...`);
      }

      const data = await getAllProducts();
      
      // If we got here, the link is stable
      setProducts(data || []);
      setError("");
      setLoading(false);
    } catch (err) {
      if (attempt < maxAttempts) {
        // Log the failure silently in the terminal UI
        console.warn(`Link Failure on attempt ${attempt}. Re-scanning...`);
        
        // Wait and try again
        await new Promise((resolve) => setTimeout(resolve, baseDelay));
        return fetchProductsWithRetry(attempt + 1);
      }

      // If all attempts fail
      setError("THE_VOID_RETURNED_NULL: Product_Service unreachable.");
      setLoading(false);
      toast.error("CRITICAL_UPLINK_FAILURE", {
        description: "// Gateway cannot find an active instance of Product_Service."
      });
    }
  }, []);

  useEffect(() => {
    fetchProductsWithRetry();
  }, [fetchProductsWithRetry]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
           <Loader2 className="h-16 w-16 text-goth-blood animate-spin" />
           <Activity className="absolute inset-0 m-auto h-6 w-6 text-white animate-pulse" />
        </div>
        <div className="text-center">
          <p className="font-cyber text-[10px] uppercase tracking-[0.4em] text-white mb-2">
            Retrieving_Artifact_Matrix...
          </p>
          <p className="font-cyber text-[9px] uppercase tracking-[0.2em] text-zinc-600 animate-pulse">
            {retryStatus || "Waiting for signal stability..."}
          </p>
        </div>
      </div>
    );

  if (error) return (
    <div className="py-20 text-center flex flex-col items-center justify-center">
      <div className="p-8 border border-goth-blood bg-goth-blood/5 max-w-md">
        <p className="font-heading text-2xl text-goth-blood tracking-tighter mb-4">{error}</p>
        <p className="font-cyber text-[10px] text-zinc-500 uppercase leading-relaxed mb-6">
          // The API Gateway is awake, but it hasn't mapped the route to the product sector in Eureka yet.
        </p>
        <button 
          onClick={() => { setLoading(true); fetchProductsWithRetry(); }}
          className="bg-white text-black px-8 py-3 font-heading text-[10px] tracking-widest hover:bg-goth-blood hover:text-white transition-all uppercase"
        >
          RE_INITIATE_SCAN
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="border-b border-goth-steel/30 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Hash className="text-goth-blood h-8 w-8" />
          <h1 className="text-4xl font-heading tracking-widest uppercase text-white">
            All_Products
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-cyber text-zinc-500 uppercase tracking-widest">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Uplink_Active
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {products.length === 0 ? (
          <div className="col-span-full py-32 text-center border border-dashed border-goth-steel/30">
            <p className="text-zinc-600 font-cyber uppercase tracking-widest italic">
              // No artifacts detected in this sector.
            </p>
          </div>
        ) : (
          products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, ease: "easeOut" }}
              key={product.productId}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
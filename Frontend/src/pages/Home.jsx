import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService.js";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { Loader2, Hash } from "lucide-react";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError("THE_VOID_RETURNED_NULL: Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 text-goth-blood animate-spin mb-4" />
        <p className="font-cyber text-xs uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
          Retrieving Artifacts...
        </p>
      </div>
    );

  if (error) return (
    <div className="py-20 text-center">
      <p className="font-heading text-2xl text-goth-blood tracking-tighter">{error}</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="border-b border-goth-steel pb-6 flex items-center gap-4">
        <Hash className="text-goth-blood h-8 w-8" />
        <h1 className="text-4xl font-heading tracking-widest uppercase text-white">
          All_Products
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-zinc-600 font-cyber py-20 italic">
            // No artifacts found in this sector.
          </p>
        ) : (
          products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
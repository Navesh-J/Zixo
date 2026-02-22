import { useEffect, useRef, useState } from "react";
import {
  getMyProducts,
  deleteProduct,
  getStock,
} from "../../services/productService";
import { BASE_URL } from "../../services/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (user?.username && !hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts(user.username);
      const productsArray = Array.isArray(data) ? data : [];
      const productsWithStock = [];

      for (const product of productsArray) {
        try {
          const stockData = await getStock(product.productId);
          productsWithStock.push({
            ...product,
            stock: stockData?.availableStock ?? 0,
          });
        } catch (err) {
          productsWithStock.push({ ...product, stock: 0 });
        }
      }
      setProducts(productsWithStock);
    } catch (err) {
      toast.error("DATA_FAULT: Failed to sync inventory.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    const id = productToDelete.productId;
    setDeletingId(id);
    setProductToDelete(null);
    try {
      await deleteProduct(id);
      toast.success("PURGE_COMPLETE: Artifact removed.");
      setProducts((prev) => prev.filter((p) => p.productId !== id));
    } catch (err) {
      toast.error("DELETE_FAILED: Interference detected.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 font-cyber">
        <Loader2 className="animate-spin text-goth-blood" />
        <p className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase">
          Indexing_Inventory...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h1 className="text-4xl font-heading tracking-widest uppercase text-white">
          Inventory_Matrix
        </h1>
        <button
          onClick={() => navigate("/seller/products/new")}
          className="bg-white text-black font-heading text-xs tracking-widest px-6 py-3 hover:bg-goth-blood hover:text-white transition-all flex items-center gap-2"
        >
          <Plus size={16} /> ADD_NEW_ARTIFACT
        </button>
      </div>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <p className="py-20 text-center font-cyber text-zinc-600 uppercase tracking-widest border border-dashed border-goth-steel">
            // NO_ASSETS_DETECTED_IN_SECTOR
          </p>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.productId}
              product={product}
              onDelete={() => setProductToDelete(product)}
              onEdit={() =>
                navigate(`/seller/products/edit/${product.productId}`)
              }
              deletingId={deletingId}
            />
          ))
        )}
      </div>

      <AnimatePresence>
        {productToDelete && (
          <DeleteConfirmationModal
            product={productToDelete}
            onClose={() => setProductToDelete(null)}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductRow({ product, onDelete, onEdit, deletingId }) {
  // Image URL Resolver
  const getImageUrl = () => {
    if (!product.imageUrl) return "/placeholder.png";
    return product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${BASE_URL}${product.imageUrl}`;
  };

  return (
    <div className="bg-goth-void border border-goth-steel p-4 flex flex-col md:flex-row justify-between items-center group hover:border-goth-blood transition-all duration-300">
      <div className="flex items-center gap-6 flex-1 w-full">
        {/* 🖼️ THEMED IMAGE THUMBNAIL */}
        <div className="hidden sm:flex h-16 w-16 bg-goth-black border border-goth-steel items-center justify-center overflow-hidden shrink-0 group-hover:border-goth-blood/50 transition-colors">
          <img
            src={getImageUrl()}
            alt={product.productName}
            className="h-full w-full object-cover opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150?text=VOID";
            }}
          />
        </div>

        <div>
          <h2 className="font-heading text-lg text-white tracking-widest uppercase group-hover:text-goth-blood transition-colors">
            {product.productName}
          </h2>
          <div className="flex gap-4 mt-1 font-cyber text-[10px] uppercase tracking-tighter">
            <span className="text-zinc-500">
              Val:{" "}
              <span className="text-white font-bold">₹{product.price}</span>
            </span>
            <span
              className={`${product.stock === 0 ? "text-goth-blood" : "text-zinc-500"}`}
            >
              Stock:{" "}
              <span
                className={product.stock === 0 ? "animate-pulse" : "text-white"}
              >
                {product.stock}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6 md:mt-0 w-full md:w-auto">
        <button
          onClick={onEdit}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 font-cyber text-[10px] uppercase tracking-[0.2em] border border-goth-steel px-4 py-2 hover:bg-white hover:text-black transition-all"
        >
          <Edit3 size={14} /> EDIT
        </button>
        <button
          onClick={onDelete}
          disabled={deletingId === product.productId}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 font-cyber text-[10px] uppercase tracking-[0.2em] border border-goth-blood/30 text-goth-blood px-4 py-2 hover:bg-goth-blood hover:text-white transition-all disabled:opacity-50"
        >
          <Trash2 size={14} />{" "}
          {deletingId === product.productId ? "PURGING..." : "DELETE"}
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({ product, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-goth-void border border-goth-blood p-8 max-w-md w-full shadow-[0_0_50px_rgba(225,29,72,0.2)]"
      >
        <div className="flex items-center gap-4 mb-6 text-goth-blood border-b border-goth-steel pb-4">
          <AlertTriangle size={32} />
          <h2 className="font-heading text-xl tracking-widest uppercase text-white">
            Warning_Override
          </h2>
        </div>

        <p className="font-cyber text-xs text-zinc-400 leading-relaxed uppercase tracking-wider mb-8">
          You are about to purge{" "}
          <span className="text-white font-bold">"{product.productName}"</span>{" "}
          from the central ledger.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 font-heading text-[10px] tracking-widest py-3 border border-goth-steel text-zinc-500 hover:text-white transition-all"
          >
            ABORT_COMMAND
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 font-heading text-[10px] tracking-widest py-3 bg-goth-blood text-white hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)]"
          >
            CONFIRM_PURGE
          </button>
        </div>

        <div className="absolute top-0 right-0 p-2 opacity-20">
          <X size={40} className="text-goth-blood" />
        </div>
      </motion.div>
    </div>
  );
}

export default SellerProducts;

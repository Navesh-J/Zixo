import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import { BASE_URL } from "../services/constants";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Loader2, Zap, ArrowLeft, ShieldAlert, Cpu } from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setError("DECRYPT_ERROR: Artifact data corrupted or missing.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Image path resolver protocol
  const getProductImage = () => {
    if (!product?.imageUrl) return "/placeholder.png";
    return product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${BASE_URL}${product.imageUrl}`;
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-10 w-10 text-goth-blood animate-spin mb-4" />
        <span className="font-cyber text-[10px] tracking-[0.4em] uppercase text-zinc-500 animate-pulse">
          Scanning_Artifact...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="py-20 text-center">
        <ShieldAlert className="mx-auto text-goth-blood mb-4" size={40} />
        <p className="font-heading text-xl text-goth-blood uppercase tracking-widest">
          {error}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 text-zinc-500 font-cyber text-xs hover:text-white transition-colors uppercase"
        >
          Return_To_Safe_Sector
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-goth-blood transition-colors mb-8 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-cyber text-[10px] tracking-widest uppercase">
          Go_Back
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Artifact Visualization Container */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-goth-blood/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative aspect-square bg-goth-void border border-goth-steel flex items-center justify-center overflow-hidden">
            {/* 🤖 CYBER SCANNER LINES */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div className="w-full h-px bg-goth-blood/20 absolute top-1/4 animate-[scanline_4s_linear_infinite]" />
              <div className="w-full h-px bg-goth-blood/20 absolute top-3/4 animate-[scanline_6s_linear_infinite]" />
            </div>

            <img
              src={getProductImage()}
              alt={product.productName}
              className="h-full w-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 transform group-hover:scale-105"
            />

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-goth-steel p-2">
              <Cpu size={14} className="text-goth-blood animate-pulse" />
            </div>
          </div>
        </div>

        {/* Technical Specifications Area */}
        <div className="space-y-8">
          <header className="border-b border-goth-steel pb-6">
            <h1 className="font-heading text-5xl text-white tracking-widest uppercase mb-2">
              {product.productName}
            </h1>
            <div className="flex items-center gap-3 text-goth-blood">
              <Zap size={16} />
              <span className="font-cyber text-[10px] tracking-[0.3em] uppercase">
                Auth_Confirmed // Artifact_Class_A
              </span>
            </div>
          </header>

          <div className="space-y-4">
            <h3 className="font-cyber text-[11px] text-zinc-500 uppercase tracking-widest">
              Description_Log:
            </h3>
            <p className="font-cyber text-sm text-zinc-300 leading-relaxed border-l border-goth-steel pl-4 italic">
              // {product.productDescription}
            </p>
          </div>

          <div className="bg-goth-void border border-goth-steel p-6 flex justify-between items-center shadow-2xl">
            <div>
              <span className="block font-cyber text-[9px] text-zinc-600 uppercase tracking-widest mb-1">
                Exchange_Rate
              </span>
              <span className="font-cyber text-4xl text-white font-bold tracking-tighter">
                ₹{product.price}
              </span>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login", {
                    state: { from: `/product/${id}` },
                    replace: true,
                  });
                  return;
                }
                addToCart(product);
              }}
              className="bg-goth-blood text-white font-heading tracking-[0.3em] px-8 py-4 hover:bg-red-700 transition-all active:scale-95 group relative overflow-hidden"
            >
              <span className="relative z-10">
                {isAuthenticated ? "ACQUIRE_ARTIFACT" : "LOGIN_TO_TRADE"}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-goth-steel/30 p-4 font-cyber text-[9px] text-zinc-600 uppercase tracking-widest">
              Condition: <span className="text-zinc-400">Pristine</span>
            </div>
            <div className="border border-goth-steel/30 p-4 font-cyber text-[9px] text-zinc-600 uppercase tracking-widest">
              Origin: <span className="text-zinc-400">Sector_Zixo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

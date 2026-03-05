import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/constants"
import { motion } from "framer-motion";
import { Eye, Zap, Plus } from "lucide-react";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  // Logic to determine if the image is a full URL or a relative path from the backend
  const getProductImage = () => {
    if (!product.imageUrl)
      return "https://static.vecteezy.com/system/resources/thumbnails/001/618/355/original/computer-error-text-message-bad-glitch-effect-video.jpg";

    // If the imageUrl starts with http, it's an external link.
    // Otherwise, prepend the BASE_URL for uploaded files.
    return product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${BASE_URL}${product.imageUrl}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="group relative bg-goth-void border border-goth-steel hover:border-goth-blood transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer"
    >
      {/* 🔮 CYBER GLITCH CORNERS */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-goth-blood opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-goth-blood opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />

      {/* IMAGE CONTAINER */}
      <div className="relative h-48 bg-goth-black overflow-hidden flex items-center justify-center border-b border-goth-steel">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <img
          src={getProductImage()}
          alt={product.productName}
          className="h-full w-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
        />

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-goth-blood/20 backdrop-blur-md border border-goth-blood p-1">
            <Plus size={14} className="text-goth-blood" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-goth-void to-transparent" />
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="font-heading text-xl tracking-widest text-white group-hover:text-goth-blood transition-colors duration-300 uppercase">
              {product.productName}
            </h2>
            <div className="h-px w-0 group-hover:w-full bg-goth-blood transition-all duration-500" />
          </div>
          <Zap
            size={16}
            className="text-goth-blood group-hover:animate-pulse"
          />
        </div>

        <p className="font-cyber text-[10px] text-zinc-500 line-clamp-2 leading-relaxed uppercase tracking-widest">
          // {product.productDescription}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-goth-steel/30">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-cyber">
              Unit_Price
            </span>
            <span className="font-cyber text-goth-blood text-lg font-bold tracking-tighter">
              ₹{product.price}
            </span>
          </div>

          <div className="flex items-center gap-2 font-heading text-[10px] tracking-[0.3em] text-zinc-400 group-hover:text-white transition-colors py-1">
            <Eye
              size={16}
              className="group-hover:text-goth-blood transition-colors"
            />
            <span className="hidden sm:inline">ENGAGE_DETAILS</span>
          </div>
        </div>
      </div>

      {/* Scanning Line Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 bg-linear-to-b from-transparent via-goth-blood to-transparent h-[10%] w-full top-[-10%] group-hover:animate-[scanline_2s_linear_infinite]" />
    </motion.div>
  );
}

export default ProductCard;

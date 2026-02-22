import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProductWithImageUrl,
  createProductWithUpload,
} from "../../services/productService";
import ProductForm from "./ProductForm";
import { toast } from "sonner";
import { ArrowLeft, Terminal } from "lucide-react";

function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async ({ values, file }) => {
    try {
      setLoading(true);
      if (file) {
      await createProductWithUpload(values, file);
    } else {
      await createProductWithImageUrl(values);
    }
      toast.success("SYSTEM_UPDATE: New artifact registered successfully.");
      navigate("/seller/products");
    } catch {
      toast.error("UPLINK_ERROR: Failed to register artifact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 font-cyber text-[10px] tracking-widest transition-colors uppercase"
      >
        <ArrowLeft size={14} /> Back_To_Inventory
      </button>

      <header className="flex items-center gap-4 mb-10">
        <Terminal className="text-goth-blood" />
        <h1 className="text-4xl font-heading tracking-widest uppercase text-white">
          Create_Product
        </h1>
      </header>

      <ProductForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}

export default CreateProduct;

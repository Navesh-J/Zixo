import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateProduct, getProductById, updateStock, getStock } from "../../services/productService";
import ProductForm from "./ProductForm";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Edit3 } from "lucide-react";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProduct(); }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      const stockData = await getStock(id);
      setProduct({ ...data, initialStock: stockData?.availableStock ?? 0 });
    } catch (err) {
      toast.error("RETRIEVAL_ERROR: Failed to load artifact data.");
      navigate("/seller/products");
    }
  };

  const handleUpdate = async (data) => {
    try {
      setLoading(true);
      await updateProduct(id, {
        productName: data.productName,
        productDescription: data.productDescription,
        price: data.price,
      });
      await updateStock(id, data.initialStock);
      toast.success("SYSTEM_UPDATE: Artifact parameters modified.");
      navigate("/seller/products");
    } catch (err) {
      toast.error("OVERWRITE_ERROR: Data commit failed.");
    } finally { 
      setLoading(false);
    }
  };

  if (!product) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-goth-blood" />
      <span className="font-cyber text-[10px] tracking-[0.4em] text-zinc-500 uppercase">Accessing_Entry...</span>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 font-cyber text-[10px] tracking-widest transition-colors uppercase">
        <ArrowLeft size={14} /> Cancel_Editing
      </button>

      <header className="flex items-center gap-4 mb-10">
        <Edit3 className="text-goth-blood" />
        <h1 className="text-4xl font-heading tracking-widest uppercase text-white">Edit_Product // {id}</h1>
      </header>

      <ProductForm initialData={product} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
}

export default EditProduct;
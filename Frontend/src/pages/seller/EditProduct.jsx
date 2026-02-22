import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateProduct,
  getProductById,
  updateStock,
  getStock,
} from "../../services/productService";
import ProductForm from "./ProductForm";
import { BASE_URL } from "../../services/constants";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Edit3 } from "lucide-react";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      const stockData = await getStock(id);

      // 🖼️ IMAGE RESOLUTION PROTOCOL
      // We ensure the ProductForm receives a full URL for the preview
      // const resolvedImageUrl = data.imageUrl
      //   ? data.imageUrl.startsWith("http")
      //     ? data.imageUrl
      //     : `${BASE_URL}${data.imageUrl}`
      //   : "";

      setProduct({
        ...data,
        initialStock: stockData?.availableStock ?? 0,
      });
    } catch (err) {
      toast.error("RETRIEVAL_ERROR: Failed to load artifact data.");
      navigate("/seller/products");
    }
  };

  const handleUpdate = async ({ values, file }) => {
    try {
      setLoading(true);

      // 1. Update Product Metadata and Image
      // We pass the 'file' to the service. Your service should handle
      // the FormData conversion if 'file' is present.
      await updateProduct(
        id,
        {
          productName: values.productName,
          productDescription: values.productDescription,
          price: values.price,
          imageUrl: values.imageUrl, // This handles the URL case
        },
        file,
      );

      // 2. Sync Stock Reserve
      await updateStock(id, values.initialStock);

      toast.success("SYSTEM_UPDATE: Artifact parameters modified.");
      navigate("/seller/products");
    } catch (err) {
      toast.error("OVERWRITE_ERROR: Data commit failed.");
      console.error("Update Fault:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!product)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 font-cyber">
        <Loader2 className="animate-spin text-goth-blood" />
        <span className="font-cyber text-[10px] tracking-[0.4em] text-zinc-500 uppercase">
          Accessing_Entry...
        </span>
      </div>
    );

  return (
    <div className="max-w-4xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 font-cyber text-[10px] tracking-widest transition-colors uppercase group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Cancel_Editing
      </button>

      <header className="flex items-center gap-4 mb-10 border-b border-goth-steel/20 pb-6">
        <Edit3 className="text-goth-blood" />
        <h1 className="text-4xl font-heading tracking-widest uppercase text-white">
          Edit_Product <span className="text-zinc-600 text-lg">//</span> {id}
        </h1>
      </header>

      {/* ProductForm now correctly receives the resolved image in initialData */}
      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  );
}

export default EditProduct;

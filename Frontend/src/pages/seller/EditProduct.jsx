import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateProduct,
  getProductById,
  updateStock, // ✅ NEW
  getStock, // ✅ NEW
} from "../../services/productService";
import ProductForm from "./ProductForm";

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

      // ✅ NEW: fetch stock separately
      const stockData = await getStock(id);

      setProduct({
        ...data,
        initialStock: stockData?.availableStock ?? 0, // ✅ IMPORTANT
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
      navigate("/seller/products");
    }
  };

  const handleUpdate = async (data) => {
    try {
      setLoading(true);

      // ✅ UPDATED: remove stock from product update
      await updateProduct(id, {
        productName: data.productName,
        productDescription: data.productDescription,
        price: data.price,
      });

      // ✅ NEW: update stock separately
      await updateStock(id, data.initialStock);

      alert("Product updated successfully");
      navigate("/seller/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally { 
      setLoading(false);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <ProductForm
        initialData={product} // ✅ now includes initialStock
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  );
}

export default EditProduct;

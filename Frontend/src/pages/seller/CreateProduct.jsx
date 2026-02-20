import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";
import ProductForm from "./ProductForm";

function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      await createProduct(data);
      alert("Product created successfully");
      navigate("/seller/products");
    } catch {
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Product</h1>

      <ProductForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}

export default CreateProduct;

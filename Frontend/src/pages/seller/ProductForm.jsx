import { useState } from "react";

function ProductForm({ initialData = {}, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    productName: initialData.productName || "",
    productDescription: initialData.productDescription || "",
    price: initialData.price || "",
    initialStock: initialData.initialStock || initialData.stock || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      alert("Product name is required");
      return;
    }

    if (Number(formData.price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (Number(formData.initialStock) < 0) {
      alert("Stock cannot be negative");
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      initialStock: Number(formData.initialStock),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow max-w-lg"
    >
      <div className="mb-4">
        <label>Product Name</label>
        <input
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label>Description</label>
        <textarea
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label>Stock</label>
        <input
          type="number"
          name="initialStock"
          value={formData.initialStock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}

export default ProductForm;

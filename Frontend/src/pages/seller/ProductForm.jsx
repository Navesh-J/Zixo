import { useState } from "react";
import { toast } from "sonner";
import {
  PackagePlus,
  FileText,
  IndianRupee,
  Database,
  Save,
} from "lucide-react";

function ProductForm({ initialData = {}, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    productName: initialData.productName || "",
    productDescription: initialData.productDescription || "",
    price: initialData.price || "",
    initialStock: initialData.initialStock || initialData.stock || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      toast.error("VALIDATION_ERROR: Artifact designation is required.");
      return;
    }
    if (Number(formData.price) <= 0) {
      toast.error("VALIDATION_ERROR: Value must be positive.");
      return;
    }
    if (Number(formData.initialStock) < 0) {
      toast.error("VALIDATION_ERROR: Inventory count cannot be negative.");
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      initialStock: Number(formData.initialStock),
    });
  };

  const inputClasses =
    "w-full bg-goth-black border border-goth-steel p-3 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white placeholder:text-zinc-700 transition-all";
  const labelClasses =
    "flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-goth-void border border-goth-steel p-8 max-w-xl relative overflow-hidden group"
    >
      {/* Decorative scanline for the form */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-goth-blood/5 to-transparent h-px group-hover:animate-[scanline_3s_linear_infinite]" />

      <div className="space-y-6">
        <div>
          <label className={labelClasses}>
            <PackagePlus size={12} /> Artifact_Name
          </label>
          <input
            name="productName"
            placeholder="DESIGNATION_01"
            value={formData.productName}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>
            <FileText size={12} /> Description_Log
          </label>
          <textarea
            name="productDescription"
            placeholder="// Enter technical specifications..."
            rows={3}
            value={formData.productDescription}
            onChange={handleChange}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              <IndianRupee size={12} /> Market_Value
            </label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>
              <Database size={12} /> Stock_Reserve
            </label>
            <input
              type="number"
              name="initialStock"
              placeholder="0"
              value={formData.initialStock}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full mt-4 bg-white text-black font-heading tracking-[0.3em] py-4 hover:bg-goth-blood hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <Save size={18} />
          <span>{loading ? "COMMITTING_DATA..." : "SAVE_ARTIFACT"}</span>
        </button>
      </div>
    </form>
  );
}

export default ProductForm;

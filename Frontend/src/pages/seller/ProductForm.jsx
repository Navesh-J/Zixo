import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  PackagePlus,
  FileText,
  IndianRupee,
  Database,
  Save,
  ImageIcon,
  UploadCloud,
  Link2,
} from "lucide-react";
import { motion } from "framer-motion";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function ProductForm({ initialData = {}, onSubmit, loading }) {
  const [useUpload, setUseUpload] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    price: "",
    initialStock: "",
    imageUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ FIX: only sync when editing (not when creating)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        productName: initialData.productName || "",
        productDescription: initialData.productDescription || "",
        price: initialData.price || "",
        initialStock: initialData.initialStock || initialData.stock || "",
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("PROTOCOL_ERROR", {
        description: "Invalid format. Only JPG, PNG, WEBP allowed.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("SIZE_OVERFLOW", {
        description: "Visual data packet exceeds 2MB limit.",
      });
      return;
    }

    setSelectedFile(file);
    toast.success("DATA_STAGED", {
      description: `File [${file.name}] ready for uplink.`,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      toast.error("VALIDATION_ERROR", {
        description: "Artifact designation is required.",
      });
      return;
    }
    if (Number(formData.price) <= 0) {
      toast.error("VALIDATION_ERROR", {
        description: "Market value must be a positive integer.",
      });
      return;
    }
    if (Number(formData.initialStock) < 0) {
      toast.error("VALIDATION_ERROR", {
        description: "Inventory count cannot be negative.",
      });
      return;
    }
    if (useUpload && !selectedFile) {
      toast.error("MISSING_DATA", {
        description: "Visual uplink required. Please attach a file.",
      });
      return;
    }

    onSubmit({
      values: {
        ...formData,
        price: Number(formData.price),
        initialStock: Number(formData.initialStock),
      },
      file: useUpload ? selectedFile : null,
    });
  };

  const inputClasses =
    "w-full bg-goth-black border border-goth-steel p-3 font-cyber text-sm focus:border-goth-blood focus:outline-none text-white placeholder:text-zinc-700 transition-all";
  const labelClasses =
    "flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-goth-void border border-goth-steel p-8 max-w-xl relative overflow-hidden group shadow-2xl"
    >
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-goth-blood/5 to-transparent h-px group-hover:animate-[scanline_3s_linear_infinite]" />

      <div className="space-y-6">
        {/* Name Field */}
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

        {/* Description Field */}
        <div>
          <label className={labelClasses}>
            <FileText size={12} /> Description_Log
          </label>
          <textarea
            name="productDescription"
            placeholder="// Technical specifications..."
            rows={3}
            value={formData.productDescription}
            onChange={handleChange}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Price & Stock Grid */}
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

        {/* Image Source Toggle */}
        <div className="border-t border-goth-steel/30 pt-4">
          <label className={labelClasses}>
            <ImageIcon size={12} /> Visual_Uplink_Method
          </label>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setUseUpload(false)}
              className={`flex-1 py-2 text-[10px] font-cyber tracking-widest transition-all border ${!useUpload ? "bg-goth-blood text-white border-goth-blood" : "bg-transparent text-zinc-500 border-goth-steel"}`}
            >
              EXTERNAL_URL
            </button>
            <button
              type="button"
              onClick={() => setUseUpload(true)}
              className={`flex-1 py-2 text-[10px] font-cyber tracking-widest transition-all border ${useUpload ? "bg-goth-blood text-white border-goth-blood" : "bg-transparent text-zinc-500 border-goth-steel"}`}
            >
              LOCAL_UPLOAD
            </button>
          </div>

          {!useUpload ? (
            <div className="relative">
              <Link2 className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600" />
              <input
                name="imageUrl"
                placeholder="HTTPS://DATA_LINK.IMAGE"
                value={formData.imageUrl}
                onChange={handleChange}
                className={`${inputClasses} pl-10`}
              />
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-goth-steel/50 p-4 hover:border-goth-blood/50 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <UploadCloud size={24} />
                <span className="text-[10px] font-cyber uppercase">
                  {selectedFile ? selectedFile.name : "Select_File_to_Scan"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full mt-4 bg-white text-black font-heading tracking-[0.3em] py-4 hover:bg-goth-blood hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
        >
          <Save size={18} className="group-hover:animate-pulse" />
          <span>{loading ? "COMMITTING_DATA..." : "SAVE_ARTIFACT"}</span>
        </button>
      </div>
    </form>
  );
}

export default ProductForm;

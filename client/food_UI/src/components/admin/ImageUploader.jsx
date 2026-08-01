import { useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

function ImageUploader({
  label = "Hình ảnh",
  value,
  onChange,
  multiple = false,
  folder = "foodhub",
  accept = "image/*",
  maxFiles = 8,
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const images = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;

    const endpoint = multiple ? "/upload/images" : "/upload/image";
    const fd = new FormData();
    if (multiple) {
      list.slice(0, maxFiles).forEach((f) => fd.append("files", f));
    } else {
      fd.append("file", list[0]);
    }
    fd.append("folder", folder);

    try {
      setUploading(true);
      const res = await api.post(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (multiple) {
        const urls = res.data.data.map((r) => r.url);
        const merged = [...(value || []), ...urls].slice(0, maxFiles);
        onChange(merged);
      } else {
        onChange(res.data.url);
      }
      toast.success("Tải ảnh lên thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAddUrl = (url) => {
    const trimmed = url?.trim();
    if (!trimmed) return;
    if (multiple) {
      onChange([...(value || []), trimmed]);
    } else {
      onChange(trimmed);
    }
  };

  return (
    <div>
      {label && <label className="mb-2 block font-semibold">{label}</label>}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-xl border-2 border-dashed border-blue-300 px-4 py-2 font-semibold text-blue-500 transition hover:bg-blue-50 disabled:opacity-50"
        >
          {uploading ? "Đang tải lên..." : multiple ? "📁 Tải ảnh lên (nhiều)" : "📁 Tải ảnh lên"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {!multiple && (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hoặc dán URL hình ảnh..."
          className="mt-3 w-full rounded-xl border p-3"
        />
      )}

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div key={`${img}-${idx}`} className="relative">
              <img src={img} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => {
                  if (multiple) onChange(images.filter((_, i) => i !== idx));
                  else onChange("");
                }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

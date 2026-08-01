import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import ImageUploader from "../../components/admin/ImageUploader";

const initialForm = {
  name: "",
  description: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch {
      toast.error("Không tải được danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setErrors({ name: "Tên danh mục là bắt buộc" });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      if (editing) {
        await api.put(`/categories/${editing._id}`, payload);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await api.post("/categories", payload);
        toast.success("Tạo danh mục thành công!");
      }

      handleClose();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      await api.put(`/categories/${cat._id}`, { isActive: !cat.isActive });
      fetchCategories();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Đã xóa danh mục");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Danh mục</h1>
          <p className="mt-1 text-sm text-gray-500">{categories.length} danh mục</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-blue-500 px-5 py-2 font-semibold text-white transition hover:bg-blue-600"
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Danh mục</th>
              <th className="p-4 text-left">Mô tả</th>
              <th className="p-4 text-center">Sản phẩm</th>
              <th className="p-4 text-center">Thứ tự</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400">Đang tải...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400">Chưa có danh mục.</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt="" className="h-10 w-10 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">📦</div>
                      )}
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="max-w-xs truncate p-4 text-gray-500">{cat.description || "—"}</td>
                  <td className="p-4 text-center">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                      {cat.foodCount}
                    </span>
                  </td>
                  <td className="p-4 text-center">{cat.sortOrder}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${cat.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {cat.isActive ? "Hoạt động" : "Ẩn"}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setEditing(cat);
                        setForm({
                          name: cat.name,
                          description: cat.description || "",
                          image: cat.image || "",
                          sortOrder: cat.sortOrder ?? 0,
                          isActive: cat.isActive,
                        });
                        setOpen(true);
                      }}
                      className="mr-3 font-semibold text-blue-500 hover:underline"
                    >
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="font-semibold text-red-500 hover:underline">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-[520px] rounded-3xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold">{editing ? "Sửa danh mục" : "Thêm danh mục"}</h2>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Tên danh mục *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <ImageUploader
                label="Ảnh (upload file hoặc dán URL)"
                value={form.image}
                onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                folder="categories"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Mô tả</label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <label className="flex items-center gap-2 font-semibold">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Hoạt động
              </label>
              <div>
                <label className="mr-2 text-sm font-semibold text-gray-600">Thứ tự</label>
                <input
                  type="number"
                  name="sortOrder"
                  value={form.sortOrder}
                  onChange={handleChange}
                  className="w-24 rounded-xl border p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={handleClose} className="rounded-xl border px-5 py-2 font-semibold hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : editing ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;

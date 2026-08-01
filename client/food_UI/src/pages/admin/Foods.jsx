import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import FoodTable from "../../components/admin/FoodTable";
import ImageUploader from "../../components/admin/ImageUploader";

const initialForm = {
  name: "",
  price: "",
  category: "",
  restaurant: "",
  brand: "",
  description: "",
  image: "",
  images: [],
  stock: 0,
  discountPrice: "",
  isFeatured: false,
  isAvailable: true,
};

function Foods() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [restaurants, setRestaurants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [reload, setReload] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [editingFood, setEditingFood] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    api.get("/restaurants").then((res) => setRestaurants(res.data.data || [])).catch(() => {});
    api.get("/brands").then((res) => setBrands(res.data.data || [])).catch(() => {});
    api.get("/categories").then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [keyword, category, lowStockOnly]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Tên sản phẩm là bắt buộc";
    if (!form.price || Number(form.price) <= 0) next.price = "Giá phải > 0";
    if (!form.category) next.category = "Vui lòng chọn danh mục";
    if (!form.restaurant) next.restaurant = "Vui lòng chọn cửa hàng";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFood(null);
    setForm(initialForm);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.images?.[0] || form.image.trim(),
        images: form.images?.length ? form.images : form.image.trim() ? [form.image.trim()] : [],
        category: form.category,
        brand: form.brand || null,
        restaurant: form.restaurant,
        stock: Number(form.stock) || 0,
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        isFeatured: form.isFeatured,
        isAvailable: form.isAvailable,
      };

      if (editingFood) {
        await api.put(`/foods/${editingFood._id}`, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await api.post("/foods", payload);
        toast.success("Tạo sản phẩm thành công!");
      }

      setReload((prev) => !prev);
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/foods/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `products-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Xuất Excel thành công!");
    } catch {
      toast.error("Xuất Excel thất bại");
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const restaurantId = form.restaurant;
    if (!restaurantId) {
      toast.error("Vui lòng chọn cửa hàng mặc định trước khi import");
      e.target.value = "";
      return;
    }

    try {
      setImporting(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("restaurant", restaurantId);

      const res = await api.post("/foods/import", fd);
      const { created, skipped, errors } = res.data.data;
      toast.success(`Import xong: ${created} tạo mới, ${skipped} bỏ qua, ${errors.length} lỗi`);
      setReload((prev) => !prev);
    } catch (err) {
      toast.error(err.response?.data?.message || "Import thất bại");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setForm({
      name: food.name,
      price: food.price,
      category: food.category,
      brand: food.brand?._id || "",
      restaurant: food.restaurant?._id || food.restaurant,
      description: food.description || "",
      image: "",
      images: food.images?.length ? food.images : food.image ? [food.image] : [],
      stock: food.stock ?? 0,
      discountPrice: food.discountPrice ?? "",
      isFeatured: food.isFeatured || false,
      isAvailable: food.isAvailable ?? true,
    });
    setOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="w-56 rounded-xl border px-4 py-2"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((item) => (
              <option key={item._id} value={item.name}>{item.name}</option>
            ))}
          </select>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
            />
            Chỉ sắp hết
          </label>
          <button
            onClick={handleExport}
            className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            ⬇️ Xuất Excel
          </button>
          <label className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700">
            {importing ? "Đang import..." : "📤 Import Excel"}
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportFile} />
          </label>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-blue-500 px-5 py-2 text-white transition hover:bg-blue-600"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <FoodTable
        reload={reload}
        keyword={keyword}
        category={category}
        page={page}
        setPage={setPage}
        lowStockOnly={lowStockOnly}
        onEdit={handleEdit}
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-[680px] overflow-y-auto rounded-3xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold">
              {editingFood ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Tên sản phẩm *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-semibold">Giá (VND) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-3 ${errors.price ? "border-red-500" : ""}`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
              <div>
                <label className="mb-2 block font-semibold">Giá khuyến mãi</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  placeholder="Để trống nếu không KM"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-semibold">Danh mục *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-3 ${errors.category ? "border-red-500" : ""}`}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
              <div>
                <label className="mb-2 block font-semibold">Thương hiệu</label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">Không có</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Cửa hàng *</label>
              <select
                name="restaurant"
                value={form.restaurant}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 ${errors.restaurant ? "border-red-500" : ""}`}
              >
                <option value="">Chọn cửa hàng</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              {errors.restaurant && <p className="mt-1 text-sm text-red-500">{errors.restaurant}</p>}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-semibold">Tồn kho</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  min="0"
                />
              </div>
              <div>
                <label className="mb-2 block font-semibold">Ảnh chính (URL)</label>
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mb-4">
              <ImageUploader
                label="Thư viện ảnh (upload file hoặc dán URL)"
                value={form.images}
                onChange={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
                multiple
                folder="foods"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Mô tả</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="mb-6 flex gap-6">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                />
                ⭐ Nổi bật
              </label>
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                />
                👁️ Hiển thị
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="rounded-xl border px-5 py-2 font-semibold transition hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-blue-500 px-6 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : editingFood ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Foods;

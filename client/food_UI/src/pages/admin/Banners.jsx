import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import ImageUploader from "../../components/admin/ImageUploader";

const initialForm = {
  title: "",
  subtitle: "",
  image: "",
  link: "",
  position: "hero",
  sortOrder: 0,
  isActive: true,
};

const positionLabels = { hero: "Banner chính", promo: "Khuyến mãi", footer: "Chân trang" };

function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [positionFilter, setPositionFilter] = useState("");

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const params = positionFilter ? `?position=${positionFilter}` : "";
      const res = await api.get(`/banners${params}`);
      setBanners(res.data.data || []);
    } catch {
      toast.error("Không tải được banner");
    } finally {
      setLoading(false);
    }
  }, [positionFilter]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setErrors({ title: "Tiêu đề là bắt buộc" });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        image: form.image.trim(),
        link: form.link.trim(),
        position: form.position,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      if (editing) {
        await api.put(`/banners/${editing._id}`, payload);
        toast.success("Cập nhật banner thành công!");
      } else {
        await api.post("/banners", payload);
        toast.success("Tạo banner thành công!");
      }

      handleClose();
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner._id}`, { isActive: !banner.isActive });
      fetchBanners();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa banner này?")) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success("Đã xóa banner");
      fetchBanners();
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Banner</h1>
          <p className="mt-1 text-sm text-gray-500">{banners.length} banner</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            <option value="">Tất cả vị trí</option>
            <option value="hero">Banner chính</option>
            <option value="promo">Khuyến mãi</option>
            <option value="footer">Chân trang</option>
          </select>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-blue-500 px-5 py-2 font-semibold text-white transition hover:bg-blue-600"
          >
            + Thêm banner
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Banner</th>
              <th className="p-4 text-left">Vị trí</th>
              <th className="p-4 text-center">Thứ tự</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400">Đang tải...</td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400">Chưa có banner.</td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner._id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {banner.image ? (
                        <img src={banner.image} alt="" className="h-14 w-24 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-14 w-24 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">🖼️</div>
                      )}
                      <div>
                        <p className="font-medium">{banner.title}</p>
                        {banner.subtitle && <p className="text-sm text-gray-500">{banner.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                      {positionLabels[banner.position] || banner.position}
                    </span>
                  </td>
                  <td className="p-4 text-center">{banner.sortOrder}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${banner.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {banner.isActive ? "Hiển thị" : "Ẩn"}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setEditing(banner);
                        setForm({
                          title: banner.title,
                          subtitle: banner.subtitle || "",
                          image: banner.image || "",
                          link: banner.link || "",
                          position: banner.position,
                          sortOrder: banner.sortOrder ?? 0,
                          isActive: banner.isActive,
                        });
                        setOpen(true);
                      }}
                      className="mr-3 font-semibold text-blue-500 hover:underline"
                    >
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(banner._id)} className="font-semibold text-red-500 hover:underline">
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
          <div className="w-[540px] rounded-3xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold">{editing ? "Sửa banner" : "Thêm banner"}</h2>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Tiêu đề *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Phụ đề</label>
              <input
                type="text"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="mb-4">
              <ImageUploader
                label="Hình ảnh (upload file hoặc dán URL)"
                value={form.image}
                onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                folder="banners"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Liên kết</label>
              <input
                type="text"
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                placeholder="/menu hoặc https://..."
              />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-semibold">Vị trí</label>
                <select name="position" value={form.position} onChange={handleChange} className="w-full rounded-xl border p-3">
                  <option value="hero">Banner chính</option>
                  <option value="promo">Khuyến mãi</option>
                  <option value="footer">Chân trang</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block font-semibold">Thứ tự</label>
                <input
                  type="number"
                  name="sortOrder"
                  value={form.sortOrder}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-semibold">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Hiển thị
              </label>
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

export default Banners;

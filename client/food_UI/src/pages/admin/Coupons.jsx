import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const initialForm = {
  code: "",
  type: "percent",
  value: "",
  minOrder: 0,
  maxDiscount: 0,
  expiresAt: "",
  usageLimit: 0,
  description: "",
  isActive: true,
};

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [keyword, setKeyword] = useState("");

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("keyword", keyword.trim());
      const res = await api.get(`/coupons?${params.toString()}`);
      setCoupons(res.data.data || []);
    } catch {
      toast.error("Không tải được mã giảm giá");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    const t = setTimeout(fetchCoupons, 300);
    return () => clearTimeout(t);
  }, [fetchCoupons]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      setErrors({ code: "Mã giảm giá là bắt buộc" });
      return;
    }
    if (!form.value || Number(form.value) <= 0) {
      setErrors({ value: "Giá trị phải > 0" });
      return;
    }
    if (form.type === "percent" && Number(form.value) > 100) {
      setErrors({ value: "Giảm % không thể vượt quá 100" });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minOrder: Number(form.minOrder) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        usageLimit: Number(form.usageLimit) || 0,
        description: form.description.trim(),
        isActive: form.isActive,
      };

      if (editing) {
        await api.put(`/coupons/${editing._id}`, payload);
        toast.success("Cập nhật mã giảm giá thành công!");
      } else {
        await api.post("/coupons", payload);
        toast.success("Tạo mã giảm giá thành công!");
      }

      handleClose();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await api.put(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      fetchCoupons();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa mã giảm giá này?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Đã xóa mã giảm giá");
      fetchCoupons();
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

  const formatValue = (coupon) => (coupon.type === "percent" ? `${coupon.value}%` : `${Number(coupon.value).toLocaleString("vi-VN")}đ`);

  const isExpired = (coupon) => {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt) < new Date();
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mã giảm giá</h1>
          <p className="mt-1 text-sm text-gray-500">{coupons.length} mã giảm giá</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm mã..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-56 rounded-xl border px-4 py-2"
          />
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-blue-500 px-5 py-2 font-semibold text-white transition hover:bg-blue-600"
          >
            + Thêm mã
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Mã</th>
              <th className="p-4 text-left">Giảm giá</th>
              <th className="p-4 text-left">Đơn tối thiểu</th>
              <th className="p-4 text-center">Đã dùng</th>
              <th className="p-4 text-center">Hạn dùng</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">Đang tải...</td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">Chưa có mã giảm giá.</td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t">
                  <td className="p-4">
                    <span className="rounded-lg bg-indigo-50 px-3 py-1 font-mono font-bold tracking-wider text-indigo-600">
                      {coupon.code}
                    </span>
                    {coupon.description && (
                      <p className="mt-1 max-w-xs truncate text-xs text-gray-400">{coupon.description}</p>
                    )}
                  </td>
                  <td className="p-4 font-semibold">{formatValue(coupon)}</td>
                  <td className="p-4">{Number(coupon.minOrder).toLocaleString("vi-VN")}đ</td>
                  <td className="p-4 text-center">
                    {coupon.usageLimit > 0
                      ? `${coupon.usedCount}/${coupon.usageLimit}`
                      : coupon.usedCount}
                  </td>
                  <td className="p-4 text-center">
                    {coupon.expiresAt ? (
                      <span className={isExpired(coupon) ? "text-red-500" : ""}>
                        {new Date(coupon.expiresAt).toLocaleDateString("vi-VN")}
                      </span>
                    ) : (
                      "Vô hạn"
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${coupon.isActive && !isExpired(coupon) ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {coupon.isActive && !isExpired(coupon) ? "Hoạt động" : "Không hoạt động"}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setEditing(coupon);
                        setForm({
                          code: coupon.code,
                          type: coupon.type,
                          value: coupon.value,
                          minOrder: coupon.minOrder ?? 0,
                          maxDiscount: coupon.maxDiscount ?? 0,
                          expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
                          usageLimit: coupon.usageLimit ?? 0,
                          description: coupon.description || "",
                          isActive: coupon.isActive,
                        });
                        setOpen(true);
                      }}
                      className="mr-3 font-semibold text-blue-500 hover:underline"
                    >
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(coupon._id)} className="font-semibold text-red-500 hover:underline">
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
          <div className="max-h-[90vh] w-[560px] overflow-y-auto rounded-2xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold">{editing ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}</h2>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Mã giảm giá *</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                className={`w-full rounded-lg border p-3 font-mono uppercase ${errors.code ? "border-red-500" : ""}`}
                placeholder="WELCOME10"
              />
              {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-semibold">Loại</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-lg border p-3">
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block font-semibold">Giá trị *</label>
                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-3 ${errors.value ? "border-red-500" : ""}`}
                />
                {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-semibold">Đơn tối thiểu (VND)</label>
                <input
                  type="number"
                  name="minOrder"
                  value={form.minOrder}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="mb-2 block font-semibold">Giảm tối đa (VND)</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={form.maxDiscount}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-semibold">Hạn dùng</label>
                <input
                  type="date"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="mb-2 block font-semibold">Số lượt dùng tối đa</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold">Mô tả</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-semibold">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Hoạt động
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={handleClose} className="rounded-lg border px-5 py-2 font-semibold hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
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

export default Coupons;

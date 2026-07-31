import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import CurvedInput from "../components/bits/CurvedInput";
import SpecularButton from "../components/bits/SpecularButton";
import { FaPlus, FaTrash, FaMapMarkerAlt, FaBoxOpen, FaHeart } from "react-icons/fa";

function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", gender: "", birthday: "" });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      address: user.address || "",
      gender: user.gender || "",
      birthday: user.birthday ? user.birthday.slice(0, 10) : "",
    });
    setAddresses(user.addresses || []);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put("/auth/profile", {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        birthday: form.birthday || undefined,
        addresses,
      });
      login(response.data.data, localStorage.getItem("token"), localStorage.getItem("refreshToken"));
      setSaved(true);
      toast.success("Đã cập nhật hồ sơ.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể cập nhật hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  const addAddress = () => {
    const trimmed = newAddress.trim();
    if (!trimmed) return;
    if (addresses.includes(trimmed)) {
      toast.info("Địa chỉ đã tồn tại.");
      return;
    }
    setAddresses((prev) => [...prev, trimmed]);
    setNewAddress("");
    setSaved(false);
  };

  const removeAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  return (
    <section className="container mx-auto min-h-screen px-6 pb-24 pt-28 lg:pt-32">
      <h1 className="font-display mb-10 text-4xl font-bold lg:text-5xl">Hồ sơ của tôi</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sidebar nav */}
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-2xl font-bold text-white">
              {(user?.fullName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link to="/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-600 transition hover:bg-sunny/30">
              <FaBoxOpen /> Đơn hàng của tôi
            </Link>
            <Link to="/wishlist" className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-600 transition hover:bg-sunny/30">
              <FaHeart /> Yêu thích
            </Link>
            <span className="flex items-center gap-3 rounded-xl bg-coral/10 px-4 py-3 font-semibold text-coral">
              <FaMapMarkerAlt /> Hồ sơ & địa chỉ
            </span>
          </nav>
        </aside>

        {/* Profile form */}
        <div className="space-y-8 lg:col-span-2">
          <form onSubmit={handleSave} className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="font-display mb-6 text-2xl font-bold">Thông tin cá nhân</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold">Họ và tên</label>
                <CurvedInput name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nhập họ tên" />
              </div>
              <div>
                <label className="mb-2 block font-semibold">Số điện thoại</label>
                <CurvedInput name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <label className="mb-2 block font-semibold">Giới tính</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-ink bg-white px-5 py-3.5 font-semibold shadow-chunky-sm outline-none transition focus:shadow-chunky"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block font-semibold">Ngày sinh</label>
                <CurvedInput name="birthday" type="date" value={form.birthday} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block font-semibold">Địa chỉ mặc định</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="2"
                placeholder="Nhập địa chỉ mặc định"
                className="w-full rounded-2xl border-2 border-ink bg-white px-5 py-3.5 font-semibold shadow-chunky-sm outline-none transition focus:shadow-chunky placeholder:text-ink/40 resize-none"
              />
            </div>

            <div className="mt-8">
              <SpecularButton type="submit" disabled={saving} className="w-full justify-center sm:w-auto">
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </SpecularButton>
              {saved && <p className="mt-3 text-sm font-semibold text-emerald-600">✓ Hồ sơ đã được lưu.</p>}
            </div>
          </form>

          {/* Saved addresses */}
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="font-display mb-6 text-2xl font-bold">Sổ địa chỉ</h2>

            <div className="mb-6 flex gap-2">
              <input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Nhập địa chỉ mới..."
                className="flex-1 rounded-2xl border-2 border-gray-100 px-5 py-3 font-semibold outline-none transition focus:border-coral"
              />
              <button
                type="button"
                onClick={addAddress}
                className="flex shrink-0 items-center gap-2 rounded-2xl bg-teal px-5 py-3 font-bold text-white transition hover:bg-teal/90"
              >
                <FaPlus /> Thêm
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
                Chưa có địa chỉ nào được lưu.
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address, index) => (
                  <div key={`${address}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="mt-1 text-coral" />
                      <p className="font-semibold">{address}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="shrink-0 rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white"
                      aria-label="Xóa địa chỉ"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm text-gray-500">
              Sổ địa chỉ được dùng để điền nhanh khi thanh toán.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;

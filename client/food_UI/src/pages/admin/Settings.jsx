import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import ImageUploader from "../../components/admin/ImageUploader";

const groupTitles = {
  general: "Cửa hàng",
  shipping: "Vận chuyển",
  payment: "Thanh toán",
  email: "Email",
  social: "Mạng xã hội",
  seo: "SEO",
};

const groupFields = {
  general: ["storeName", "storePhone", "storeEmail", "storeAddress", "storeDescription"],
  shipping: ["freeShippingThreshold", "shippingFee", "estimatedDeliveryTime"],
  payment: ["currency", "vnpayEnabled", "momoEnabled"],
  email: ["contactEmail", "notificationEmail"],
  social: ["facebookUrl", "instagramUrl", "tiktokUrl", "zaloPhone"],
  seo: ["metaTitle", "metaDescription", "ogImage"],
};

const fieldLabels = {
  storeName: "Tên cửa hàng",
  storePhone: "Số điện thoại",
  storeEmail: "Email liên hệ",
  storeAddress: "Địa chỉ",
  storeDescription: "Mô tả cửa hàng",
  freeShippingThreshold: "Đơn tối thiểu để miễn phí ship (VND)",
  shippingFee: "Phí ship mặc định (VND)",
  estimatedDeliveryTime: "Thời gian giao dự kiến (phút)",
  currency: "Đơn vị tiền tệ",
  vnpayEnabled: "Bật VNPay",
  momoEnabled: "Bật MoMo",
  contactEmail: "Email liên hệ",
  notificationEmail: "Email nhận thông báo",
  facebookUrl: "Facebook",
  instagramUrl: "Instagram",
  tiktokUrl: "TikTok",
  zaloPhone: "Zalo (SĐT)",
  metaTitle: "Meta title",
  metaDescription: "Meta description",
  ogImage: "OG Image (URL)",
};

function Settings() {
  const [form, setForm] = useState({});
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/settings");
      const map = res.data.data?.map || {};
      setForm(map);
      setOriginal(map);
    } catch {
      toast.error("Không tải được cài đặt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const changed = {};
      Object.keys(form).forEach((key) => {
        if (form[key] !== original[key]) changed[key] = form[key];
      });

      if (Object.keys(changed).length === 0) {
        toast.info("Không có thay đổi nào");
        return;
      }

      await api.put("/settings", changed);
      toast.success("Đã lưu cài đặt!");
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key, value) => {
    if (value === true || value === false || value === "true" || value === "false") {
      const checked = value === true || value === "true";
      return (
        <label key={key} className="flex items-center justify-between rounded-xl border p-4">
          <span className="font-semibold">{fieldLabels[key] || key}</span>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => handleChange(key, e.target.checked)}
            className="h-5 w-5"
          />
        </label>
      );
    }

    if (key === "ogImage") {
      return (
        <div key={key} className="rounded-xl border p-4">
          <ImageUploader
            label="OG Image (upload file hoặc dán URL)"
            value={value ?? ""}
            onChange={(url) => handleChange(key, url)}
            folder="settings"
          />
        </div>
      );
    }

    return (
      <div key={key} className="rounded-xl border p-4">
        <label className="mb-2 block font-semibold">{fieldLabels[key] || key}</label>
        <textarea
          rows={key === "metaDescription" || key === "storeDescription" ? 3 : 1}
          value={value ?? ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-full resize-none rounded-lg border p-3"
        />
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt</h1>
          <p className="mt-1 text-sm text-gray-500">Cấu hình chung cho cửa hàng</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-xl bg-blue-500 px-6 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {Object.entries(groupFields).map(([group, keys]) => (
            <div key={group} className="rounded-2xl border bg-white p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {group === "general" ? "🏪" : group === "shipping" ? "🚚" : group === "payment" ? "💳" : group === "email" ? "📧" : group === "social" ? "🌐" : "🔍"}
                </span>
                {groupTitles[group]}
              </h2>
              <div className="space-y-4">
                {keys.map((key) => renderField(key, form[key]))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Settings;

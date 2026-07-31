import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Aurora from "../components/bits/Aurora";
import CurvedInput from "../components/bits/CurvedInput";
import SpecularButton from "../components/bits/SpecularButton";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!token) {
      setError("Link không hợp lệ. Vui lòng yêu cầu gửi lại.");
      return;
    }
    if (!form.newPassword || form.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/auth/reset-password", { token, newPassword: form.newPassword });
      alert("🎉 Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-28">
      <Aurora className="fixed inset-0 -z-10" />
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-10 shadow-lift backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sunny to-amber-300 text-3xl shadow-card ring-1 ring-black/5">
          🛡️
        </div>

        <h1 className="text-center text-4xl font-bold">Đặt lại mật khẩu</h1>
        <p className="mt-2 text-center text-ink/60">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-display font-bold">Mật khẩu mới</label>
            <CurvedInput
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="********"
            />
          </div>

          <div>
            <label className="mb-2 block font-display font-bold">Xác nhận mật khẩu</label>
            <CurvedInput
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="********"
            />
          </div>

          {error && <p className="text-sm font-bold text-coral">{error}</p>}

          <SpecularButton onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </SpecularButton>
        </div>

        <p className="mt-8 text-center text-ink/60">
          <Link to="/login" className="font-display font-bold text-coral underline decoration-2 underline-offset-4 hover:text-teal">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </section>
  );
}

export default ResetPassword;

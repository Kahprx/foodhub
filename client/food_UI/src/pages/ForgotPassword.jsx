import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Aurora from "../components/bits/Aurora";
import CurvedInput from "../components/bits/CurvedInput";
import SpecularButton from "../components/bits/SpecularButton";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/forgot-password", { email });
      setResetLink(res.data?.data?.resetLink || "");
      setSent(true);
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
          🔑
        </div>

        <h1 className="text-center text-4xl font-bold">Quên mật khẩu</h1>
        <p className="mt-2 text-center text-ink/60">
          Nhập email để nhận link đặt lại mật khẩu
        </p>

        {sent ? (
          <div className="mt-8 rounded-3xl border-2 border-teal bg-teal/10 p-6 text-center">
            <p className="text-4xl">📬</p>
            <p className="mt-3 font-display font-bold text-teal">
              Đã gửi email đặt lại mật khẩu!
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Vui lòng kiểm tra hộp thư <strong>{email}</strong>. Link có hiệu lực trong 15 phút.
            </p>

            {resetLink && (
              <div className="mt-4 rounded-xl bg-white/80 p-3 text-left">
                <p className="text-xs font-bold uppercase text-ink/50">
                  Chưa cấu hình SMTP — dùng link này (dev mode)
                </p>
                <p className="mt-1 break-all text-sm font-mono text-coral">{resetLink}</p>
              </div>
            )}

            <Link to="/login" className="mt-6 inline-block font-display font-bold text-coral underline decoration-2 underline-offset-4">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-display font-bold">Email</label>
              <CurvedInput
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Nhập email"
              />
              {error && <p className="mt-2 text-sm font-bold text-coral">{error}</p>}
            </div>

            <SpecularButton onClick={handleSubmit} className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </SpecularButton>
          </div>
        )}

        <p className="mt-8 text-center text-ink/60">
          Nhớ mật khẩu?
          <Link to="/login" className="ml-2 font-display font-bold text-coral underline decoration-2 underline-offset-4 hover:text-teal">
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  );
}

export default ForgotPassword;

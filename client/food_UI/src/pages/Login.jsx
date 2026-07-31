import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Aurora from "../components/bits/Aurora";
import CurvedInput from "../components/bits/CurvedInput";
import SpecularButton from "../components/bits/SpecularButton";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await api.post("/auth/login", form);

      const { token, user } = response.data.data;

      login(user, token);

      alert("🎉 Đăng nhập thành công!");

      navigate(user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message || "Đăng nhập thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-28">
      <Aurora className="fixed inset-0 -z-10" />
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-10 shadow-lift backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sunny to-amber-300 text-3xl shadow-card ring-1 ring-black/5">
          🧸
        </div>

        <h1 className="text-center text-4xl font-bold">Đăng nhập</h1>

        <p className="mt-2 text-center text-ink/60">
          Chào mừng bạn quay lại HAPPYHOMES
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-display font-bold">Email</label>
            <CurvedInput
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email"
            />

            {errors.email && (
              <p className="mt-2 text-sm font-bold text-coral">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-display font-bold">Mật khẩu</label>
            <CurvedInput
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
            />

            {errors.password && (
              <p className="mt-2 text-sm font-bold text-coral">{errors.password}</p>
            )}
          </div>

          <SpecularButton onClick={handleLogin} className="w-full">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </SpecularButton>
        </div>

        <p className="mt-8 text-center text-ink/60">
          Chưa có tài khoản?

          <Link to="/register" className="ml-2 font-display font-bold text-coral underline decoration-2 underline-offset-4 hover:text-teal">
            Đăng ký
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;

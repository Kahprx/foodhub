import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Aurora from "../components/bits/Aurora";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const verify = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
      } catch {
        setStatus("invalid");
      }
    };

    verify();
  }, [token]);

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-28">
      <Aurora className="fixed inset-0 -z-10" />
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-10 text-center shadow-lift backdrop-blur-xl">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-teal border-t-transparent" />
            <h1 className="text-3xl font-bold">Đang xác thực...</h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-emerald-400 text-3xl shadow-card ring-1 ring-black/5">
              ✅
            </div>
            <h1 className="text-3xl font-bold">Xác thực thành công!</h1>
            <p className="mt-3 text-ink/60">Email của bạn đã được xác thực.</p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-3xl bg-teal px-8 py-3 font-display font-bold text-white shadow-chunky transition hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-chunky-sm"
            >
              Đăng nhập
            </Link>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-red-400 text-3xl shadow-card ring-1 ring-black/5">
              ❌
            </div>
            <h1 className="text-3xl font-bold">Link không hợp lệ</h1>
            <p className="mt-3 text-ink/60">
              Link xác thực không hợp lệ hoặc đã hết hạn.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-block font-display font-bold text-coral underline decoration-2 underline-offset-4"
            >
              Đăng ký tài khoản mới
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

export default VerifyEmail;

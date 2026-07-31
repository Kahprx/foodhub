import { Link } from "react-router-dom";
import Aurora from "../components/bits/Aurora";

function ServerError() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center">
      <Aurora className="fixed inset-0 -z-10" />
      <p className="text-[8rem] font-black leading-none tracking-tight text-ink/10 sm:text-[12rem]">500</p>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Lỗi máy chủ</h1>
      <p className="mt-4 max-w-md text-ink/60">
        Xe đồ chơi của chúng tôi đang được sửa. Vui lòng thử lại sau!
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-2xl bg-coral px-8 py-3 font-display font-bold text-white shadow-chunky transition hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-chunky-sm"
      >
        🔧 Về trang chủ
      </Link>
    </section>
  );
}

export default ServerError;

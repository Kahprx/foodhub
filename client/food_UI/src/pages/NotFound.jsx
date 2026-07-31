import { Link } from "react-router-dom";
import Aurora from "../components/bits/Aurora";

function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center">
      <Aurora className="fixed inset-0 -z-10" />
      <p className="text-[8rem] font-black leading-none tracking-tight text-ink/10 sm:text-[12rem]">404</p>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Trang không tồn tại</h1>
      <p className="mt-4 max-w-md text-ink/60">
        Có vẻ con gấu bông của bạn đã giấu trang này đi mất rồi!
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-2xl bg-teal px-8 py-3 font-display font-bold text-white shadow-chunky transition hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-chunky-sm"
      >
        🧸 Về trang chủ
      </Link>
    </section>
  );
}

export default NotFound;

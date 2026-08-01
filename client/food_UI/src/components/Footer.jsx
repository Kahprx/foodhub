import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold">
              <span className="-rotate-6 rounded-2xl border-2 border-cream bg-sunny px-2 py-1 text-ink">🧸</span> HAPPYHOMES
            </h3>
            <p className="mt-4 text-sm leading-7 text-cream/70">
              Nhà của những niềm vui. Đồ chơi chất lượng cho mọi lứa tuổi,
              giao tận nhà nhanh chóng.
            </p>
            <div className="mt-5 flex gap-3">
              {[FaFacebookF, FaInstagram, FaTiktok, FaYoutube].map((Icon, index) => (
                <a key={index} href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-cream/40 text-cream transition hover:border-sunny hover:text-sunny">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold text-sunny">Khám phá</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li><Link to="/foods" className="hover:text-sunny">Cửa hàng</Link></li>
              <li><Link to="/foods" className="hover:text-sunny">Sản phẩm mới</Link></li>
              <li><Link to="/foods" className="hover:text-sunny">Bán chạy nhất</Link></li>
              <li><Link to="/foods" className="hover:text-sunny">Bộ sưu tập</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold text-sunny">Hỗ trợ</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li><a href="#" className="hover:text-sunny">Chính sách giao hàng</a></li>
              <li><a href="#" className="hover:text-sunny">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-sunny">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-sunny">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold text-sunny">Nhận ưu đãi</h4>
            <p className="mt-4 text-sm text-cream/70">Đăng ký để nhận mã giảm giá mỗi tuần.</p>
            <form className="mt-4 flex overflow-hidden rounded-3xl border-2 border-cream/40">
              <input type="email" placeholder="Email của bạn" className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-cream/40" />
              <button type="submit" className="bg-sunny px-5 font-display text-sm font-bold text-ink transition hover:bg-cream">Gửi</button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t-2 border-cream/20 pt-6 text-center text-sm text-cream/60 md:flex-row">
          <span>© {new Date().getFullYear()} HAPPYHOMES. Tất cả quyền được bảo lưu.</span>
          <span className="font-display font-bold text-cream/80">Làm bằng ❤️ cho trẻ em 🧸</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

import { Link } from "react-router-dom";
import Aurora from "./bits/Aurora";
import SplitText from "./bits/SplitText";
import SpecularButton from "./bits/SpecularButton";
import TiltedCard from "./bits/TiltedCard";
import Counter from "./bits/Counter";

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-10 lg:pt-36">
      <Aurora>
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 font-display text-sm font-bold text-ink/70 shadow-card backdrop-blur">
              🧸 Nhà của những niềm vui
            </span>

            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
              <SplitText text="Đồ chơi hay," perWord />
              <br />
              <span className="text-coral">
                <SplitText text="trẻ cười to." perWord delay={0.35} />
              </span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-ink/70">
              LEGO, robot, thú bông và hàng nghìn món đồ chơi từ các thương hiệu
              uy tín — giao nhanh tận nhà, an toàn cho bé.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/foods">
                <SpecularButton>Mua sắm ngay</SpecularButton>
              </Link>
              <Link
                to="/foods"
                className="font-display font-bold text-ink/70 underline decoration-coral decoration-2 underline-offset-8 transition hover:text-coral"
              >
                Xem bộ sưu tập →
              </Link>
            </div>

            <div className="mt-11 flex flex-wrap gap-3">
              {["🚚 Giao trong 24h", "🔄 Đổi trả 30 ngày", "🛡️ An toàn cho bé"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-bold text-ink/70 shadow-card backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -top-8 -left-8 h-28 w-28 rounded-full bg-gradient-to-br from-coral to-sunny opacity-90 shadow-soft"
              style={{
                backgroundImage: "radial-gradient(#fff6 2px, transparent 2px)",
                backgroundSize: "12px 12px",
              }}
            />
            <TiltedCard>
              <img
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=900"
                alt="Đồ chơi trẻ em"
                className="w-full rounded-[2rem] object-cover shadow-lift ring-8 ring-white/70"
              />
            </TiltedCard>
            <div className="absolute -bottom-7 right-4 rounded-2xl border border-white/70 bg-white/95 px-5 py-3 shadow-lift backdrop-blur">
              <p className="font-display text-2xl font-bold text-coral">
                <Counter end={10000} suffix="+" />
              </p>
              <p className="text-xs font-bold text-ink/50">sản phẩm đồ chơi</p>
            </div>
          </div>
        </div>
      </Aurora>
    </section>
  );
}

export default Hero;

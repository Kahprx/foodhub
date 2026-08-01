import { FaPuzzlePiece, FaRobot, FaBabyCarriage, FaCarSide, FaGraduationCap, FaPaw } from "react-icons/fa";
import { Link } from "react-router-dom";
import FadeContent from "./bits/FadeContent";
import GlassIcon from "./bits/GlassIcon";

const categories = [
  { icon: <FaPuzzlePiece className="text-red-500" />, name: "LEGO", glow: "bg-red-500/30" },
  { icon: <FaRobot className="text-teal" />, name: "Action Figures", glow: "bg-teal/30" },
  { icon: <FaBabyCarriage className="text-pink-500" />, name: "Dolls", glow: "bg-pink-500/30" },
  { icon: <FaCarSide className="text-amber-500" />, name: "RC Cars", glow: "bg-amber-400/40" },
  { icon: <FaGraduationCap className="text-lilac" />, name: "Educational", glow: "bg-lilac/40" },
  { icon: <FaPaw className="text-coral" />, name: "Plush Toys", glow: "bg-coral/30" },
];

function Category() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <FadeContent>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
              Chọn theo sở thích
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Bé thích gì, <span className="text-coral">có ngay</span> nấy
            </h2>
          </div>
          <Link to="/foods" className="font-display font-bold text-ink/70 underline decoration-coral decoration-2 underline-offset-8 transition hover:text-coral">
            Xem tất cả →
          </Link>
        </div>
      </FadeContent>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
        {categories.map((item, index) => (
          <FadeContent key={item.name} delay={index * 0.05}>
            <Link
              to="/foods"
              className="group flex h-full flex-col items-center justify-center rounded-3xl border border-black/5 bg-white/80 p-6 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <GlassIcon glow={item.glow}>{item.icon}</GlassIcon>
              <p className="mt-4 text-center font-display text-sm font-bold">{item.name}</p>
            </Link>
          </FadeContent>
        ))}
      </div>
    </section>
  );
}

export default Category;

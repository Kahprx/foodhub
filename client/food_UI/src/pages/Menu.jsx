import FoodList from "../components/Food/FoodList";

function Menu() {
  return (
    <div className="min-h-screen bg-cream pt-28">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">Cửa hàng đồ chơi</h1>
        <p className="mb-9 font-semibold text-ink-soft">Khám phá những món đồ chơi tuyệt vời cho bé.</p>
        <FoodList />
      </div>
    </div>
  );
}

export default Menu;

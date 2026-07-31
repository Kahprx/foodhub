import Counter from "../bits/Counter";

function StatCard({ title, value, icon, color, suffix = "" }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">
            <Counter
              end={typeof value === "number" ? value : 0}
              suffix={suffix || (title === "Revenue" ? "đ" : "")}
            />
          </h2>
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-xl text-3xl text-white shadow-lg ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;

import Counter from "../bits/Counter";
import BorderGlow from "../bits/BorderGlow";

function StatCard({ title, value, icon, color, suffix = "", sub = "" }) {
  const isNumber = typeof value === "number";

  return (
    <BorderGlow
      className="rounded-2xl"
      gradient="from-coral via-sunny to-teal"
      innerClassName="relative rounded-2xl"
    >
      <div className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">{title}</p>

            <h2 className="mt-2 text-3xl font-bold">
              {isNumber ? (
                <Counter end={value} suffix={suffix} />
              ) : (
                <span>{value}</span>
              )}
            </h2>

            {sub && <p className="mt-1 text-sm text-gray-400">{sub}</p>}
          </div>

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-xl text-3xl text-white shadow-lg ${color}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

export default StatCard;

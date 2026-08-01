import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function HourlyOrdersChart({ data }) {
  const chartData = (data || []).map((item) => ({
    ...item,
    revenue: Math.round(item.revenue || 0),
  }));

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/10 text-lg">
          🕐
        </div>
        <div>
          <h2 className="text-xl font-bold">Đơn hàng theo giờ</h2>
          <p className="text-sm text-gray-500">Hôm nay (giờ Việt Nam)</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="orders" name="Đơn hàng" fill="#17a398" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HourlyOrdersChart;

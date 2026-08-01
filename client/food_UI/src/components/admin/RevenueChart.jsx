
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function RevenueChart({data}){
    const chartData = data.map((item) => ({
        date: `${item._id.day}/${item._id.month}`,
        revenue: item.revenue,
        orders: item.orders,

    }));
    return(
         <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-lg">📈</div>
            <div>
              <h2 className="text-xl font-bold mb-0">
                Tổng quan doanh thu
              </h2>
              <p className="text-sm text-gray-500">Doanh thu theo ngày (đơn hoàn thành)</p>
            </div>
          </div>
         <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            dataKey="revenue"
            stroke="#f97316"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
        </div>
    );
}
export default RevenueChart;
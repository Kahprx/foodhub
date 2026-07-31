
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
         <div className="bg-white rounded-2xl p-6 mt-8">
          <h2 className="text-xl font-bold mb-6">
             Revenue Overview
         </h2>
         <ResponsiveContainer width="100%" height={350}>
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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

import StatCard from "../../components/admin/StatCard";
import OrderStatusChart from "../../components/admin/OrderStatusChart";
import RevenueChart from "../../components/admin/RevenueChart";
import BorderGlow from "../../components/bits/BorderGlow";

import {
  FaPuzzlePiece,
  FaUsers,
  FaClipboardList,
  FaMoneyBillWave,
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [chart, setChart] = useState([]);
  const [statusChart, setStatusChart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    const dashboardRes = await api.get("/dashboard");
    setStats(dashboardRes.data.data);

    const statusRes = await api.get("/orders/status/chart");

    setStatusChart(statusRes.data.data);
    const chartRes = await api.get("/orders/revenue/chart");
    setChart(chartRes.data.data);
    const recentRes = await api.get("/orders/recent");
    setRecentOrders(recentRes.data.data);
  } catch (err) {
    console.log(err);
  }
};

 return (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-8">
      Dashboard
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {[
        { title: "Toys", value: stats.totalFoods, icon: <FaPuzzlePiece />, color: "bg-blue-500" },
        { title: "Users", value: stats.totalUsers, icon: <FaUsers />, color: "bg-blue-500" },
        { title: "Orders", value: stats.totalOrders, icon: <FaClipboardList />, color: "bg-green-500" },
        { title: "Revenue", value: stats.revenue, icon: <FaMoneyBillWave />, color: "bg-purple-500" },
      ].map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <BorderGlow>
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          </BorderGlow>
        </motion.div>
      ))}
    </div>


    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <RevenueChart data={chart} />

          <OrderStatusChart data={statusChart} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
  <h2 className="text-xl font-bold mb-6">
    Recent Orders
  </h2>

  <table className="w-full">
    <thead>
      <tr className="text-left border-b">
        <th className="pb-3">Customer</th>
        <th className="pb-3">Total</th>
        <th className="pb-3">Status</th>
      </tr>
    </thead>

    <tbody>
      {recentOrders.map((order) => (
        <tr key={order._id} className="border-b">
          <td className="py-3">
            {order.user?.fullName || "Unknown"}
          </td>

          <td>
            {order.totalPrice.toLocaleString()}đ
          </td>

          <td>
            {order.status}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  </div>
  
);
}

export default Dashboard;

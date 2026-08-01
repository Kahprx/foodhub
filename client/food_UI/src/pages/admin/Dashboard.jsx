import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { Link } from "react-router-dom";

import StatCard from "../../components/admin/StatCard";
import OrderStatusChart from "../../components/admin/OrderStatusChart";
import RevenueChart from "../../components/admin/RevenueChart";
import HourlyOrdersChart from "../../components/admin/HourlyOrdersChart";
import BorderGlow from "../../components/bits/BorderGlow";
import { getSocket } from "../../services/socket";

import {
  FaPuzzlePiece,
  FaUsers,
  FaClipboardList,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaFire,
  FaStar,
  FaChartLine,
  FaTrophy,
  FaBan,
  FaCheckCircle,
} from "react-icons/fa";

const fmtVND = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

function Dashboard() {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStock: 0,
    pendingReviews: 0,
    revenue: 0,
    avgOrderValue: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    orderToday: 0,
    orderThisWeek: 0,
    orderThisMonth: 0,
    cancelledOrders: 0,
    cancelRate: 0,
  });
  const [chart, setChart] = useState([]);
  const [statusChart, setStatusChart] = useState([]);
  const [hourlyChart, setHourlyChart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [conversion, setConversion] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join:admin");
    const refresh = () => fetchDashboard();
    socket.on("order:new", refresh);
    socket.on("order:status", refresh);
    return () => {
      socket.off("order:new", refresh);
      socket.off("order:status", refresh);
    };
  }, []);

  const fetchDashboard = async () => {
    try {
      const dashboardRes = await api.get("/dashboard");
      setStats(dashboardRes.data.data);

      const [statusRes, chartRes, recentRes, topRes, lowRes, custRes, brandsRes, convRes, hourlyRes] =
        await Promise.all([
          api.get("/orders/status/chart"),
          api.get("/orders/revenue/chart"),
          api.get("/orders/recent"),
          api.get("/dashboard/top-selling"),
          api.get("/dashboard/low-stock"),
          api.get("/dashboard/top-customers"),
          api.get("/dashboard/top-brands"),
          api.get("/dashboard/conversion"),
          api.get("/orders/hourly-chart"),
        ]);

      setStatusChart(statusRes.data.data);
      setChart(chartRes.data.data);
      setHourlyChart(hourlyRes.data.data || []);
      setRecentOrders(recentRes.data.data);
      setTopSelling(topRes.data.data || []);
      setLowStockItems(lowRes.data.data || []);
      setTopCustomers(custRes.data.data || []);
      setTopBrands(brandsRes.data.data || []);
      setConversion(convRes.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const statusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-700",
      Confirmed: "bg-blue-100 text-blue-700",
      Preparing: "bg-purple-100 text-purple-700",
      Delivering: "bg-indigo-100 text-indigo-700",
      Completed: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${colors[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
          <p className="mt-1 text-sm text-gray-500">
            Hôm nay: {stats.orderToday} đơn · {fmtVND(stats.revenueToday)} · Tuần: {fmtVND(stats.revenueThisWeek)} · Tháng: {fmtVND(stats.revenueThisMonth)} · Hủy: {stats.cancelRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: "Sản phẩm", value: stats.totalFoods, icon: <FaPuzzlePiece />, color: "bg-blue-500", sub: `${stats.lowStock} sắp hết` },
          { title: "Người dùng", value: stats.totalUsers, icon: <FaUsers />, color: "bg-teal-500", sub: "tổng tài khoản" },
          { title: "Đơn hàng", value: stats.totalOrders, icon: <FaClipboardList />, color: "bg-green-500", sub: `${stats.pendingOrders} đang chờ` },
          { title: "Doanh thu", value: fmtVND(stats.revenue), icon: <FaMoneyBillWave />, color: "bg-purple-500", sub: `TB/đơn ${fmtVND(stats.avgOrderValue)}` },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <BorderGlow>
              <StatCard title={card.title} value={card.value} icon={card.icon} color={card.color} sub={card.sub} />
            </BorderGlow>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6">
        {stats.pendingOrders > 0 && (
          <Link
            to="/admin/orders?status=Pending"
            className="flex items-center gap-3 rounded-3xl border-2 border-yellow-300 bg-yellow-50 p-4 font-semibold text-yellow-800 transition hover:bg-yellow-100"
          >
            <FaExclamationTriangle className="text-xl" />
            Có {stats.pendingOrders} đơn hàng đang chờ xử lý — nhấn để xem
          </Link>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart data={chart} />
        <OrderStatusChart data={statusChart} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <HourlyOrdersChart data={hourlyChart} />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-lg">
              <FaBan className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Tỷ lệ hủy đơn</h2>
              <p className="text-sm text-gray-500">Tổng cộng</p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-black text-red-500">{stats.cancelRate}%</p>
              <p className="mt-1 text-sm text-gray-500">
                {stats.cancelledOrders}/{stats.totalOrders} đơn đã hủy
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                stats.cancelRate > 10 ? "bg-red-500" : stats.cancelRate > 5 ? "bg-amber-400" : "bg-teal"
              }`}
              style={{ width: `${Math.min(stats.cancelRate, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-gray-400">
            {stats.cancelRate > 10
              ? "Tỷ lệ hủy cao — cân nhắc kiểm tra giá/phí ship"
              : stats.cancelRate > 5
                ? "Tỷ lệ hủy ở mức trung bình"
                : "Tỷ lệ hủy thấp — rất tốt 🎉"}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
            <div className="rounded-2xl bg-teal/5 p-3">
              <p className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                <FaCheckCircle className="text-teal" /> Đơn hôm nay
              </p>
              <p className="mt-1 text-2xl font-bold">{stats.orderToday}</p>
            </div>
            <div className="rounded-2xl bg-coral/5 p-3">
              <p className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                <FaBan className="text-coral" /> Đơn tuần này
              </p>
              <p className="mt-1 text-2xl font-bold">{stats.orderThisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      {conversion && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Lượt truy cập (30 ngày)", value: conversion.sessions?.toLocaleString("vi-VN"), icon: <FaChartLine className="text-blue-500" /> },
            { label: "Đơn hàng (30 ngày)", value: conversion.totalOrders, icon: <FaClipboardList className="text-green-500" /> },
            { label: "Tỷ lệ chốt đơn", value: `${conversion.checkoutRate}%`, icon: <FaFire className="text-orange-500" /> },
            { label: "Hoàn thành", value: `${conversion.completionRate}%`, icon: <FaTrophy className="text-amber-500" /> },
          ].map((card, index) => (
            <div key={card.label} className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-2xl">{card.icon}</div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top selling */}
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center gap-2">
            <FaFire className="text-orange-500" />
            <h2 className="text-xl font-bold">Sản phẩm bán chạy</h2>
          </div>
          <div className="space-y-4">
            {topSelling.length === 0 && <p className="text-gray-400">Chưa có dữ liệu</p>}
            {topSelling.map((f, i) => (
              <div key={f._id} className="flex items-center gap-4">
                <span className="w-6 font-black text-gray-300">#{i + 1}</span>
                <img src={f.image || f.images?.[0]} alt={f.name} className="h-12 w-12 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-sm text-gray-500">{f.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal">{f.soldCount} đã bán</p>
                  <p className="text-sm text-gray-500">còn {f.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-500" />
            <h2 className="text-xl font-bold">Sản phẩm sắp hết hàng</h2>
          </div>
          <div className="space-y-4">
            {lowStockItems.length === 0 && <p className="text-gray-400">Tồn kho ổn định 🎉</p>}
            {lowStockItems.map((f) => (
              <div key={f._id} className="flex items-center gap-4">
                <img src={f.image || f.images?.[0]} alt={f.name} className="h-12 w-12 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-sm text-gray-500">{f.category}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${f.stock === 0 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                  {f.stock === 0 ? "Hết hàng" : `Còn ${f.stock}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {topBrands.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center gap-2">
              <FaTrophy className="text-amber-500" />
              <h2 className="text-xl font-bold">Thương hiệu bán chạy</h2>
            </div>
            <div className="space-y-4">
              {topBrands.map((b, i) => (
                <div key={b._id} className="flex items-center gap-4">
                  <span className="w-6 font-black text-gray-300">#{i + 1}</span>
                  <img src={b.logo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(b.name || "?")} alt="" className="h-10 w-10 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-sm text-gray-500">{b.sold} đã bán</p>
                  </div>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-coral to-amber-400"
                      style={{ width: `${topBrands.length ? (b.sold / topBrands[0].sold) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="w-24 text-right font-bold text-teal">{Number(b.revenue || 0).toLocaleString("vi-VN")}đ</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center gap-2">
              <FaStar className="text-amber-400" />
              <h2 className="text-xl font-bold">Khách hàng VIP</h2>
            </div>
            <div className="space-y-4">
              {topCustomers.length === 0 && <p className="text-gray-400">Chưa có dữ liệu</p>}
              {topCustomers.map((c, i) => (
                <div key={c.userId} className="flex items-center gap-4">
                  <span className="w-6 font-black text-gray-300">#{i + 1}</span>
                  <img src={c.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.fullName || "?")} alt="" className="h-10 w-10 rounded-full bg-gray-100 object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{c.fullName || "Khách"}</p>
                    <p className="text-sm text-gray-500">{c.orderCount} đơn hàng</p>
                  </div>
                  <p className="font-bold text-teal">{Number(c.totalSpent || 0).toLocaleString("vi-VN")}đ</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <h2 className="mb-6 text-xl font-bold">Đơn hàng gần đây</h2>
          <div className="space-y-3">
            {recentOrders.length === 0 && <p className="text-gray-400">Chưa có đơn hàng</p>}
            {recentOrders.map((order) => (
              <Link key={order._id} to={`/admin/orders/${order._id}`} className="flex items-center justify-between rounded-2xl border p-3 transition hover:bg-gray-50">
                <div>
                  <p className="font-semibold">{order.user?.fullName || "Khách"}</p>
                  <p className="text-xs text-gray-500">#{order._id.toString().slice(-6)} · {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{order.totalPrice?.toLocaleString("vi-VN")}đ</p>
                  {statusBadge(order.status)}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

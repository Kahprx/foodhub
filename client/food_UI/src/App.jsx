import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./layouts/MainLayout";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Client Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import FoodDetail from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Success from "./pages/Success";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminFoods from "./pages/admin/Foods";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminUsers from "./pages/admin/Users";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= CLIENT ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/menu" element={<Menu />} />

          <Route path="/foods/:id" element={<FoodDetail />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route path="/success" element={<Success />} />
        </Route>

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout showHeader={false} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="foods" element={<AdminFoods />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
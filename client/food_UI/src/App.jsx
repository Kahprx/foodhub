import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import FoodDetail from "./pages/FoodDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Success from "./pages/Success";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/success" element={<Success />}
/>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/foods/:id" element={<FoodDetail />} />
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
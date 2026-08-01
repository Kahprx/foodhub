import { createContext, useContext, useEffect, useState } from "react";
import {toast} from "react-toastify";
import api from "../services/api"
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
const { user } = useAuth();
const [cartItems, setCartItems] = useState([]);
const [loading, setLoading] = useState(false);
const fetchCart = async () =>{
  if (!user) {
    setCartItems([]);
    return;
  }
  try {
    setLoading(true);
      const response = await api.get("/cart");

        setCartItems((response.data.data?.items || []).map((item) => ({
          _id: item.food?._id || item.food,
          name: item.food?.name || "Unknown",
          price: item.food?.discountPrice > 0 ? item.food?.discountPrice : item.food?.price || 0,
          image: item.food?.image || "",
          quantity: item.quantity,
          stock: item.food?.stock ?? Infinity,
          isAvailable: item.food?.isAvailable ?? true,
        })));

  } catch (err) {

        console.log(err);

    } finally {

        setLoading(false);

    }
};
useEffect(() => {

    fetchCart();

}, [user]);

  const addToCart = (food, quantity) => {
    const maxStock = food.stock ?? Infinity;
    const exist = cartItems.find((item) => item._id === food._id);
    if (exist && exist.quantity + quantity > maxStock) {
      toast.error(`"${food.name}" chỉ còn ${maxStock} sản phẩm trong kho`);
      return;
    }

    toast.success(`${food.name} đã được thêm vào giỏ!`);

    if (user) {
      api.post("/cart", { foodId: food._id, quantity }).catch(() => {});
    }

    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === food._id);

      if (exist) {
        return prev.map((item) =>
          item._id === food._id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...food,
          price: Number(food.discountPrice) > 0 ? Number(food.discountPrice) : food.price,
          quantity,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    const item = cartItems.find((i) => i._id === id);
    const maxStock = item?.stock ?? Infinity;
    if (item && item.quantity >= maxStock) {
      toast.error("Không thể thêm quá số lượng trong kho");
      return;
    }

    if (user) {
      const current = cartItems.find((i) => i._id === id);
      if (current) {
        api.put("/cart", { foodId: id, quantity: current.quantity + 1 }).catch(() => {});
      }
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    if (user) {
      const item = cartItems.find((i) => i._id === id);
      if (item) {
        if (item.quantity - 1 <= 0) {
          api.delete(`/cart/${id}`).catch(() => {});
        } else {
          api.put("/cart", { foodId: id, quantity: item.quantity - 1 }).catch(() => {});
        }
      }
    }

    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    if (user) {
      api.delete(`/cart/${id}`).catch(() => {});
    }

    setCartItems((prev) => prev.filter((item) => item._id !== id));
    toast.info("🗑 Đã xóa món đồ chơi");
    
  };

  const clearCart = () => {
    if (user) {
      api.delete("/cart").catch(() => {});
    }

    setCartItems([]);
    localStorage.removeItem("cart");
    toast.error("Đã xóa toàn bộ giỏ hàng");
  };

  return (
    <CartContext.Provider
value={{
    cartItems,
    loading,
    fetchCart,

    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
}}
>
    
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
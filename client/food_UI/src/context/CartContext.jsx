import { createContext, useContext, useEffect, useState } from "react";
import {toast} from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
const [cartItems , setCartItems] = useState(() => {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
});
useEffect (() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cartItems)
  );
} , [cartItems]);

  const addToCart = (food, quantity) => {
    toast.success(`${food.name} đã được thêm vào giỏ!`);

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
          quantity,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
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
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    toast.info("🗑 Đã xóa món ăn");
    
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.error("Đã xóa toàn bộ giỏ hàng");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
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
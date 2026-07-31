import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.data || []);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const removeWishlist = async (id) => {
    await api.delete(`/wishlist/${id}`);
    await fetchWishlist();
  };

  const addWishlist = async (foodId) => {
    await api.post("/wishlist", { foodId });
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, addWishlist, removeWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

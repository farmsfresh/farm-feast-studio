import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  cart: Record<string, number>;
  cartItems: CartItem[];
  menuItems: MenuItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : {};
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .order("display_order");
      
      if (data) {
        setMenuItems(data);
      }
    };

    fetchMenuItems();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: quantity };
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const cartItems: CartItem[] = Object.entries(cart)
    .map(([id, quantity]) => {
      const item = menuItems.find((i) => i.id === id);
      if (!item) return null;
      return { ...item, quantity };
    })
    .filter((item): item is CartItem => item !== null);

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        menuItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

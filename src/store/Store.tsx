import { create } from "zustand";

// 🧾 Product type
type Product = {
  id: string;
  title: string;
  leadCount: string;
  description: number;
  category: "small" | "medium" | "large" | "bonus" | "premium";
  price: number;
  quantity: number;
};

// 💳 Store type definition
type PaymentStore = {
  // 🛒 Cart system
  cart: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;

  // 💰 Payment states
  paymentStatus: "idle" | "processing" | "success" | "error";
  setPaymentStatus: (
    status: "idle" | "processing" | "success" | "error"
  ) => void;

  // 🧾 Transaction info
  transactionId: string;
  setTransactionId: (id: string) => void;
};

// 🧠 Zustand store
export const usePaymentStore = create<PaymentStore>((set) => ({
  // 🛒 Initialize empty cart
  cart: [],

  // ✅ Add product to cart (prevent duplicates by ID)
  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.some((p) => p.id === item.id);
      if (exists) return state; // prevent duplicate add
      return { cart: [...state.cart, item] };
    }),

  // ❌ Remove product by ID
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  // 🔄 Update quantity for a specific product
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  // 🧹 Clear the cart
  clearCart: () => set({ cart: [] }),

  // 💳 Manage payment status
  paymentStatus: "idle",
  setPaymentStatus: (status) => set({ paymentStatus: status }),

  // 🧾 Transaction ID handler
  transactionId: "",
  setTransactionId: (id) => set({ transactionId: id }),
}));

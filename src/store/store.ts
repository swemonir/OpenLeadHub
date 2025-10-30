import { create } from "zustand";

type Product = {
  id: string;
  title: string;
  leadCount: string;
  description: number;
  category: "small" | "medium" | "large" | "bonus" | "premium";
  price: number;
  quantity: number;
};

type PaymentStore = {
  cart: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;

  paymentStatus: "idle" | "processing" | "success" | "error";
  setPaymentStatus: (
    status: "idle" | "processing" | "success" | "error"
  ) => void;

  transactionId: string;
  setTransactionId: (id: string) => void;
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.some((p) => p.id === item.id);
      if (exists) return state;
      return { cart: [...state.cart, item] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  paymentStatus: "idle",
  setPaymentStatus: (status) => set({ paymentStatus: status }),

  transactionId: "",
  setTransactionId: (id) => set({ transactionId: id }),
}));

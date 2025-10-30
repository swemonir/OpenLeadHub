import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCartIcon,
  XIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
} from "lucide-react";

export interface CartItem {
  id: string;
  title: string;
  leadCount: string; // e.g. "5K"
  price: number; // per unit price in USD (or chosen currency)
  quantity: number;
  // optionally other fields...
}

interface CheckoutModalProps {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: (cart: CartItem[], total: number) => void;
  currencySymbol?: string; // default "$"
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  onRemove,
  onUpdateQuantity,
  onCheckout,
  currencySymbol = "$",
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalLeads = cart.reduce((sum, item) => {
    const qty = parseFloat(String(item.leadCount).replace(/K/i, "")) || 0;
    return sum + qty * 1000 * item.quantity;
  }, 0);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (cart.length > 0) setIsOpen(true);
    else setIsOpen(false);
  }, [cart.length]);

  if (cart.length === 0) return null;

  return (
    <>
      {/* Desktop: sticky right panel */}
      <motion.aside
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="hidden lg:block fixed right-0 top-20 bottom-20 w-96 z-50"
      >
        <div className="h-full bg-white rounded-l-2xl shadow-2xl border-l border-t border-b border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingCartIcon className="w-5 h-5 text-[#007AFF]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
                  <p className="text-sm text-gray-500">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    {/* 🏷️ Title & Lead Info */}
                    <div className="w-2/3">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.leadCount} leads
                      </p>
                    </div>

                    {/* 💰 Price (center) */}
                    <div className="mx-4">
                      <span className="font-bold text-gray-900 whitespace-nowrap">
                        {currencySymbol}
                        {Math.round(item.price)}
                      </span>
                    </div>

                    {/* ❌ Remove Button (right) */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      aria-label="Remove item"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-bl-2xl">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Leads</span>
                <span className="font-semibold text-gray-900">
                  {(totalLeads / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-[#007AFF]">
                  {currencySymbol}
                  {Math.round(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onCheckout(cart, total)}
              className="w-full bg-[#007AFF] hover:bg-[#0066DD] text-white font-semibold py-3 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile: bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 500 }}
            animate={{ y: 0 }}
            exit={{ y: 500 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingCartIcon className="w-5 h-5 text-[#007AFF]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Your Cart</h3>
                  <p className="text-xs text-gray-500">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.leadCount} leads
                      </p>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remove"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="p-1.5"
                        aria-label="Decrease"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1.5"
                        aria-label="Increase"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="font-bold">
                      {currencySymbol}
                      {Math.round(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between mb-3">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-[#007AFF] text-lg">
                  {currencySymbol}
                  {Math.round(total)}
                </span>
              </div>

              <button
                onClick={() => onCheckout(cart, total)}
                className="w-full bg-[#007AFF] text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile quick toggle */}
      {!isOpen && cart.length > 0 && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 bg-[#007AFF] text-white p-4 rounded-full shadow-lg z-50 flex items-center space-x-2"
          aria-label="Open cart"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          <span className="font-semibold">{cart.length}</span>
        </motion.button>
      )}
    </>
  );
};

export default CheckoutModal;

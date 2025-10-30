import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, LockIcon, CheckCircleIcon, AlertCircleIcon, Loader2 } from "lucide-react";
import type { CartItem } from "./CheckoutModal";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onSuccess: (orderData: { cart: CartItem[]; total: number; paymentId: string }) => void;
 
  onProcessPayment?: (payload: { cart: CartItem[]; total: number; billing: { fullName: string; email: string } }) => Promise<{ success: boolean; paymentId?: string; errorMessage?: string }>;
  currencySymbol?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cart,
  total,
  onSuccess,
  onProcessPayment,
  currencySymbol = "$",
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFormData({ fullName: "", email: "", cardNumber: "", expiryDate: "", cvc: "" });
      setStatus("idle");
      setErrorMessage("");
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "cardNumber") {
      formatted = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (formatted.length > 19) return;
    }

    if (name === "expiryDate") {
      formatted = value.replace(/\D/g, "");
      if (formatted.length >= 3) formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
      if (formatted.length > 5) return;
    }

    if (name === "cvc") {
      formatted = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((p) => ({ ...p, [name]: formatted }));
  };

  const submitPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setStatus("idle");
    setErrorMessage("");

    // If parent provided a real processor, use it
    if (onProcessPayment) {
      try {
        const result = await onProcessPayment({
          cart,
          total,
          billing: { fullName: formData.fullName, email: formData.email },
        });
        if (result.success) {
          setStatus("success");
          const paymentId = result.paymentId || "P-" + Math.random().toString(36).slice(2, 9).toUpperCase();
          setTimeout(() => onSuccess({ cart, total, paymentId }), 1200);
        } else {
          setStatus("error");
          setErrorMessage(result.errorMessage || "Payment failed. Try again.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage((err as Error)?.message || "Payment service error");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Demo fallback (simulate processing)
    setTimeout(() => {
      const ok = Math.random() > 0.15;
      if (ok) {
        setStatus("success");
        const paymentId = "TEST-" + Math.random().toString(36).slice(2, 9).toUpperCase();
        setTimeout(() => onSuccess({ cart, total, paymentId }), 1200);
      } else {
        setStatus("error");
        setErrorMessage("Payment failed. Check card details and try again.");
      }
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "success" ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="w-12 h-12 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600">Thanks — preparing your leads for download.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <LockIcon className="w-3 h-3 mr-1" />
                      Secure payment
                    </p>
                  </div>

                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <XIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Summary</h3>
                    <div className="space-y-2">
                      {cart.map((it) => (
                        <div key={it.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {it.title} x{it.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            {currencySymbol}
                            {Math.round(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-gray-200 flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-[#007AFF] text-lg">
                          {currencySymbol}
                          {Math.round(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={submitPayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input name="fullName" value={formData.fullName} onChange={(e) => handleInputChange(e)} onInput={() => {}} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all outline-none" placeholder="John Doe" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={(e) => handleInputChange(e)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all outline-none" placeholder="john@example.com" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input name="cardNumber" value={formData.cardNumber} onChange={(e) => handleInputChange(e)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all outline-none" placeholder="1234 5678 9012 3456" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                        <input name="expiryDate" value={formData.expiryDate} onChange={(e) => handleInputChange(e)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all outline-none" placeholder="MM/YY" required />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                        <input name="cvc" value={formData.cvc} onChange={(e) => handleInputChange(e)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-all outline-none" placeholder="123" required />
                      </div>
                    </div>

                    {status === "error" && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-red-800">{errorMessage}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-center text-xs text-gray-500 py-2">
                      <LockIcon className="w-3 h-3 mr-1" />
                      Your payment is securely processed.
                    </div>

                    <button type="submit" disabled={isProcessing} className="w-full bg-linear-to-r from-[#007AFF] to-indigo-600 hover:from-[#0066DD] hover:to-indigo-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Pay {currencySymbol}{Math.round(total)}</span>
                      )}
                    </button>

                    <button type="button" onClick={onClose} className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors">
                      Cancel
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

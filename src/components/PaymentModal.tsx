import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  LockIcon,
  AlertCircleIcon,
  Loader2,
} from "lucide-react";
import axios from "axios";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  leadCount: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onSuccess: (orderData: {
    cart: CartItem[];
    total: number;
    paymentId: string;
  }) => void;
  currencySymbol?: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm: React.FC<PaymentModalProps> = ({
  cart,
  total,
  onSuccess,
  currencySymbol = "$",
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!status) {
      setFormData({ fullName: "", email: "" });
      setStatus("idle");
      setErrorMessage("");
      setIsProcessing(false);
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // 1️⃣ Create PaymentIntent on backend
      const { data: intentData } = await axios.post(
        "http://localhost:5000/api/v1/payment/payment-intent",
        { totalprice: total }
      );

      const clientSecret = intentData.data.client_secret;

      // 2️⃣ Confirm payment using Stripe Elements
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) throw new Error("Card Element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.fullName,
              email: formData.email,
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // 3️⃣ Save payment to backend
        const paymentRecords = cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          transactionId: paymentIntent.id,
          fullName: formData.fullName,
          email: formData.email,
          method: "card",
        }));

        await Promise.all(
          paymentRecords.map((p) =>
            axios.post(
              "http://localhost:5000/api/v1/payment/save-payment",
              p
            )
          )
        );

        setStatus("success");
        setTimeout(() =>
          onSuccess({ cart, total, paymentId: paymentIntent.id }), 1200
        );
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage((err as Error)?.message || "Payment failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none"
          placeholder="john@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="px-4 py-3 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#a0aec0" },
                },
              },
            }}
          />
        </div>
      </div>

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
        >
          <AlertCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-linear-to-r from-[#007AFF] to-indigo-600 hover:from-[#0066DD] hover:to-indigo-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>
            Pay {currencySymbol}
            {Math.round(total)}
          </span>
        )}
      </button>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = (props) => {
  const { isOpen, onClose, cart, total } = props;

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
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Your Purchase
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <LockIcon className="w-3 h-3 mr-1" />
                  Secure payment
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {cart.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {it.title} x{it.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${Math.round(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-[#007AFF] text-lg">
                      ${Math.round(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm {...props} />
              </Elements>

              <div className="flex items-center justify-center text-xs text-gray-500 py-2">
                <LockIcon className="w-3 h-3 mr-1" />
                Your payment is securely processed.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

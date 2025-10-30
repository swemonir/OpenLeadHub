import { useEffect, useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { usePaymentStore } from "../store/Store";
import { FolderIcon } from "lucide-react";

const Payment = () => {
  const { product } = usePaymentStore();
  const stripe = useStripe();
  const elements = useElements();

  const {
    id,
    name: productName,
    description,
    priceUSD,
    category,
  } = product || {};

  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const totalPrice = priceUSD ? priceUSD * quantity : 0;

  // 🔹 Create Payment Intent
  useEffect(() => {
    if (!totalPrice) return;
    fetch("https://daraz-e-comarch-server.vercel.app/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalprice: totalPrice }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(() => toast.error("Failed to initialize payment"));
  }, [totalPrice]);

  // 🔹 Simplified Payment Function
  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setSuccess("");

    const card = elements.getElement(CardNumberElement);
    if (!card) {
      toast.error("Card info missing");
      setProcessing(false);
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card, billing_details: { name: productName || "Customer" } },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      setSuccess("✅ Payment successful!");
      setTransactionId(paymentIntent.id);
      // send to backend
      fetch("https://daraz-e-comarch-server.vercel.app/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          quantity,
          price: totalPrice,
          transactionId: paymentIntent.id,
        }),
      });
    }

    setProcessing(false);
  };

  const inputStyle = {
    style: {
      base: { fontSize: "16px", color: "#374151", "::placeholder": { color: "#9CA3AF" } },
      invalid: { color: "#EF4444" },
    },
  };

  if (!product) return <p>Product not selected</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Complete Your Payment
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all ${category}`}>
            <div className="flex items-start justify-between mb-4">
              <FolderIcon className="w-8 h-8 text-indigo-500" />
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {quantity} pcs
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{productName}</h3>
            <p className="text-gray-600 text-sm mb-4">{description}</p>
            <p className="text-3xl font-bold text-indigo-600">${totalPrice}</p>

            {/* Quantity Adjust */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded"
              >-</button>
              <span className="px-2">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >+</button>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">Card Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Card Number</label>
                <div className="border rounded-xl p-3 bg-gray-50">
                  <CardNumberElement options={inputStyle} />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Expiration Date</label>
                  <div className="border rounded-xl p-3 bg-gray-50">
                    <CardExpiryElement options={inputStyle} />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">CVC</label>
                  <div className="border rounded-xl p-3 bg-gray-50">
                    <CardCvcElement options={inputStyle} />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing || !clientSecret}
              className={`w-full py-3 rounded-xl font-medium text-white mt-4 ${
                processing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {processing ? "Processing..." : `Pay $${totalPrice}`}
            </button>

            {success && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 font-medium">{success}</p>
                <p className="text-sm text-green-600 mt-1">
                  Transaction ID: <span className="font-semibold">{transactionId}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Test Card: <strong>4242 4242 4242 4242</strong> · Any future date · Any CVC
        </p>
      </div>
    </div>
  );
};

export default Payment;

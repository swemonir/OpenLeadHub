import { FolderIcon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import PaymentModal from "./PaymentModal";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { usePaymentStore } from "../store/Store.ts";

interface PackageCardProps {
  pkg: {
    id: string;
    name: string;
    leadCount: string;
    description: string;
    category: "small" | "medium" | "large" | "bonus" | "premium";
  };
  price: number;
}

const PackageCard = ({ pkg, price }: PackageCardProps) => {
  const { cart, addToCart, removeFromCart, clearCart } = usePaymentStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); // New state
  const [successData, setSuccessData] = useState<any>(null); // Store order data

  const handlePurchase = () => {
    addToCart({
      id: pkg.id,
      title: pkg.name,
      leadCount: pkg.leadCount,
      price,
      quantity: 1,
      description: 0,
      category: pkg.category,
    });
    setIsCheckoutOpen(true);
  };

  const handleRemove = (id: string) => removeFromCart(id);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    clearCart();
    updated.forEach((item) => addToCart(item));
  };

  const handleCheckout = (_cartData: any[], _total: number) => {
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (orderData: any) => {
    console.log("Payment Successful:", orderData);
    setIsPaymentOpen(false);
    clearCart();
    setSuccessData(orderData); // Store order data for success modal
    setIsSuccessOpen(true); // Open success modal
  };

  const categoryColors = {
    small: "bg-green-50 border-green-200",
    medium: "bg-blue-50 border-blue-200",
    large: "bg-purple-50 border-purple-200",
    bonus: "bg-orange-50 border-orange-200",
    premium: "bg-pink-50 border-pink-200",
  };

  return (
    <>
      <div
        className={`${
          categoryColors[pkg.category]
        } border-2 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-start justify-between mb-4">
          <FolderIcon className="w-8 h-8 text-[#007AFF]" />
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {pkg.leadCount}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <p className="text-gray-600 text-sm mb-4 min-h-10">{pkg.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-[#007AFF]">${price}</span>
        </div>
        <button
          onClick={handlePurchase}
          className="w-full px-4 py-3 bg-[#007AFF] text-white rounded-lg font-semibold hover:bg-[#0066DD] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Buy & Download
        </button>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          onRemove={handleRemove}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
          currencySymbol="$"
        />
      )}

      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          cart={cart}
          total={cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {isSuccessOpen && successData && (
        <PaymentSuccessModal
          isOpen={isSuccessOpen}
          onClose={() => setIsSuccessOpen(false)}
          orderData={successData}
        />
      )}
    </>
  );
};

export default PackageCard;

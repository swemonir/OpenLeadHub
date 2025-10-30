import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, DownloadIcon, FolderIcon, XIcon } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    cart: { id: string; title: string; leadCount: string; quantity: number; price: number }[];
    total: number;
    paymentId: string;
  };
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (isOpen) setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    rotate: 0,
                    opacity: 1,
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  transition={{ duration: Math.random() * 2 + 2, ease: "linear" }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ["#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B"][
                      Math.floor(Math.random() * 4)
                    ],
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-600" />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Payment Successful 🎉
              </h1>
              <p className="text-lg text-gray-600">
                Thank you for your purchase! Your leads are ready to download.
              </p>
            </div>

            {/* Download Link */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">
                  Your Drive Download Link
                </span>
                <DownloadIcon className="w-5 h-5 text-blue-600" />
              </div>
              <a
                href="https://drive.google.com/drive/folders/example-leads-folder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-6 rounded-xl transition-all shadow-sm hover:shadow-md border border-blue-200"
              >
                <FolderIcon className="w-5 h-5" />
                <span>Access Your Leads on Google Drive</span>
              </a>
            </div>

            {/* Purchase Summary */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Purchase Summary</h3>
              <div className="space-y-3">
                {orderData.cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.title} ({item.leadCount} leads) x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="font-bold text-green-600 text-lg">
                      ${orderData.total}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment ID</span>
                    <span className="font-mono">{orderData.paymentId}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Go Back</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;

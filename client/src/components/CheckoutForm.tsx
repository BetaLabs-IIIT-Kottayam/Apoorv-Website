/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { CartItem } from "../pages/Merch";
import PaymentSuccessModal from "./PaymentSuccessModal";

interface CheckoutFormProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setIsCheckoutOpen: (isOpen: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cart = [],
  setCart,
  setIsCheckoutOpen,
}) => {
  // console.log(cart);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Ensure safe calculation of total amount with proper type checking
  const calculateTotal = (items: CartItem[]): number => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((total, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      return total + itemPrice * itemQuantity;
    }, 0);
  };

  const totalAmount = calculateTotal(cart);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              merchId: item._id,
              quantity: item.quantity,
              color: item.color,
              size: item.size,
            })),
            buyerDetails: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create order");

      const order = await response.json();
      return order;
    } catch (err) {
      console.error("Error creating order:", err);
      throw err;
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await initializeRazorpay();
      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }

      const orderResponse = await createOrder();
      // console.log("Order created:", orderResponse); // Add this log
      // console.log("Order Check:", orderResponse.order.razorpayOrderId);

      if (!orderResponse || !orderResponse.order.razorpayOrderId) {
        // Add this check
        throw new Error("Invalid order response from server");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        name: "Apoorv",
        description: "Purchase from Merch Store",
        order_id: orderResponse.order.razorpayOrderId,
        handler: async (response: any) => {
          // console.log("Razorpay Response: ", response);
          try {
            const verificationResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/v1/order/verifyPayment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );
            // console.log("Verification response", verificationResponse);
            if (!verificationResponse.ok) {
              throw new Error("Payment verification failed");
            }

            setShowSuccessModal(true);

            // Clear cart and show success
            setCart([]);
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        method: {
          upi: true, // Enable UPI
          netbanking: true,
          card: true,
          wallet: true,
        },
        theme: {
          color: "#EF4444",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsCheckoutOpen(false); // Close checkout after user dismisses success modal
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border border-red-500/30 w-full max-w-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-gang text-2xl text-white">Checkout</h2>
          <button onClick={() => setIsCheckoutOpen(false)}>
            <X className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                First Name:
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Last Name:
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between text-white mb-4">
              <span className="font-gang">Total Amount:</span>
              <span className="font-gang">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg disabled:opacity-50"
            type="submit"
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </motion.button>
        </form>
        {showSuccessModal && (
          <PaymentSuccessModal onClose={handleCloseSuccessModal} />
        )}
      </motion.div>
    </motion.div>
  );
};

export default CheckoutForm;

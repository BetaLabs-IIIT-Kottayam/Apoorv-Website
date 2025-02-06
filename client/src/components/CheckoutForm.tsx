import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { X, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";
import BackgroundImage from "../assets/dragon.png"; 

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

// interface CheckoutFormProps {
//   cart: CartItem[];
//   setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
//   setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

const CheckoutForm = ({ cart, setCart, setIsCartOpen }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Here you would typically process the order
      console.log("Order processed:", { formData, cart });
      // Clear cart and redirect
      setCart([]);
      setIsCartOpen(false);
      navigate("/order-confirmation");
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

//   const handleBack = (): void => {
//     navigate(-1);
//   };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-black relative">
      <div 
        className="fixed inset-0 bg-cover bg-no-repeat opacity-40"
        style={{ 
          backgroundImage: `url(${BackgroundImage})`, 
          backgroundSize: '50%', 
          backgroundPosition: "top right",
          filter: "brightness(120%)",
          zIndex: 0 
        }} 
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border border-red-500/30"
        >
          <div className="flex items-center mb-8">
            {/* <button 
              onClick={handleBack}
              className="text-gray-400 hover:text-white mr-4"
              type="button"
            >
              <ArrowLeft size={24} />
            </button> */}
            <h1 className="text-2xl text-white font-gang">Checkout</h1>
          </div>

          {/* Selected Items Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="text-red-500" size={24} />
              <h2 className="text-xl text-white font-gang">Your Selected Items</h2>
            </div>
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-black/30 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="text-white font-gang">{item.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">Quantity: {item.quantity}</span>
                        <span className="text-white font-gang">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-between items-center py-4 border-t border-white/10">
                <span className="text-lg text-white font-gang">Total Amount</span>
                <span className="text-xl text-red-500 font-gang">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl text-white font-gang">Contact Information</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-gang mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 border ${
                      errors.firstName ? 'border-red-500' : 'border-white/20'
                    } rounded p-2 text-white focus:border-red-500 focus:outline-none`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white font-gang mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 border ${
                      errors.lastName ? 'border-red-500' : 'border-white/20'
                    } rounded p-2 text-white focus:border-red-500 focus:outline-none`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white font-gang mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-black/50 border ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  } rounded p-2 text-white focus:border-red-500 focus:outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-white font-gang mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full bg-black/50 border ${
                    errors.phoneNumber ? 'border-red-500' : 'border-white/20'
                  } rounded p-2 text-white focus:border-red-500 focus:outline-none`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-gang mt-6"
              >
                Complete Order
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutForm;
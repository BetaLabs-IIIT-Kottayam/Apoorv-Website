import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import BackgroundImage from "../assets/dragon.png";
import Loader from "../components/Loader";

const Merch = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  const products = [
    {
      id: 1,
      name: "Warrior's Hoodie",
      price: 69.99,
      description: "Battle-ready comfort with embroidered clan symbols",
      sizes: ["XS","S","M","L","XL","2XL","3XL"],
      colors: ["Black/Red", "Charcoal/Gold"],
      image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHQlMjBzaGlydHN8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      name: "Dragon Scale Jacket",
      price: 129.99,
      description: "Legendary protection with intricate scale-inspired design",
      sizes: ["S","M","L","XL","2XL"],
      colors: ["Emerald Green", "Midnight Black"],
      image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHQlMjBzaGlydHN8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 3,
      name: "Mystic Realm T-Shirt",
      price: 39.99,
      description: "Enchanted design that tells a story of adventure",
      sizes: ["XS","S","M","L","XL"],
      colors: ["Deep Purple", "Stone Gray"],
      image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHQlMjBzaGlydHN8ZW58MHx8MHx8fDA%3D",
    }
  ];

  const addToCart = useCallback((product, size, color) => {
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          size,
          color,
          quantity: 1
        }
      ]);
    }
    setSelectedItem(null);
  }, [cart]);

  const removeFromCart = useCallback((index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  }, [cart]);

  const updateQuantity = useCallback((index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  }, [cart]);

  const CartCheckout = () => (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween" }}
      className="fixed top-0 right-0 w-full md:w-96 h-full bg-gradient-to-br from-gray-900 to-black shadow-2xl z-50 p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl text-white font-gang">Your Cart</h2>
        <button onClick={() => setIsCartOpen(false)}>
          <X className="text-gray-400 hover:text-white" />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400">
          Your cart is empty
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <motion.div 
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex items-center justify-between bg-black/30 p-4 rounded-lg"
            >
              <div>
                <h3 className="text-white font-gang">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.size} | {item.color}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-white/20 rounded">
                  <button 
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="p-2 text-white"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 text-white">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="p-2 text-white"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between text-white mb-4">
              <span>Total:</span>
              <span>
                ${cart.reduce((total, item) => 
                  total + (item.price * item.quantity), 0
                ).toFixed(2)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full bg-red-500 text-white py-3 rounded-lg"
            >
              Checkout
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const ProductModal = ({ product, onClose }) => {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black p-4 md:p-6 rounded-lg border border-red-500/30 w-full max-w-md md:max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <h2 className="font-gang text-xl md:text-3xl text-white">{product.name}</h2>
            <button onClick={onClose}>
              <X className="text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg border border-white/10 object-cover"
              whileHover={{ scale: 1.05 }}
            />

            <div className="space-y-4 md:space-y-6">
              <p className="font-gang text-sm md:text-base text-gray-400">{product.description}</p>

              <div>
                <h3 className="font-gang text-white mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm border ${
                        selectedSize === size
                          ? "border-red-500 text-red-500"
                          : "border-white/20 text-white/60 hover:border-white/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-gang text-white mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm border ${
                        selectedColor === color
                          ? "border-red-500 text-red-500"
                          : "border-white/20 text-white/60 hover:border-white/40"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="font-gang text-xl text-white">
                  ${product.price}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product, selectedSize, selectedColor)}
                  className="bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 text-xs md:text-base"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black">
      <Loader />
      
      {contentVisible && (
        <>
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
          <style>
        {`
          @media (max-width: 1024px) {
            div[style*="background-size: 50%"] {
              background-size: 70%;
              background-position: right center;
            }
          }
          @media (max-width: 768px) {
            div[style*="background-size: 50%"] {
              background-size: cover !important;
              background-position: center center !important;
              width: 100% !important;
              height: 100% !important;
            }
          }
          @media (max-width: 480px) {
            div[style*="background-size: 10%"] {
              background-size: 50%;
              background-position: center center !important;
              transform: scale(1.1);
            }
          }
        `}
      </style>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedItem(product)}
                  className="bg-black/50 border border-white/10 rounded-lg p-4 cursor-pointer hover:border-red-500/50 transition-all"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover rounded-lg mb-4" 
                  />
                  <h3 className="text-white font-gang text-xl mb-2">{product.name}</h3>
                  <p className="text-gray-400 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-gang text-lg">${product.price}</span>
                    <ShoppingCart className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 cursor-pointer shadow-lg z-40"
            >
              <ShoppingCart size={20} />
              <span className="font-gang text-xs md:text-base">{cart.length} items</span>
            </motion.div>
          )}

          <AnimatePresence>
            {selectedItem && (
              <ProductModal
                product={selectedItem}
                onClose={() => setSelectedItem(null)}
              />
            )}
            {isCartOpen && <CartCheckout />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Merch;
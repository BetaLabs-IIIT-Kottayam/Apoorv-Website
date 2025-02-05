import { motion } from "framer-motion";
import { useState,useEffect } from "react";
import {  ShoppingCart, X } from "lucide-react";
import BackgroundImage from "../assets/dragon.png";
import Loader from "../components/Loader";

const Merch = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
    const [contentVisible, setContentVisible] = useState(false);
  
    // Wait for loader to complete before showing content
    useEffect(() => {
      const timer = setTimeout(() => {
        setContentVisible(true);
      }, 3200); // 2000ms for loader + 1500ms for transition
      return () => clearTimeout(timer);
    }, []);

  const products = [
    {
      id: 1,
      name: "Warrior's Hoodie",
      price: 69.99,
      description: "Battle-ready comfort with embroidered clan symbols",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black/Red", "Charcoal/Gold"],
      image: "/api/placeholder/300/400",
    },
    {
      id: 2,
      name: "Samurai Tech Backpack",
      price: 89.99,
      description: "Modern functionality meets ancient aesthetics",
      sizes: ["One Size"],
      colors: ["Black", "Red"],
      image: "/api/placeholder/300/400",
    },
    {
      id: 3,
      name: "Bushido Baseball Cap",
      price: 34.99,
      description: "Embroidered with the way of the warrior",
      sizes: ["Adjustable"],
      colors: ["Black", "Red", "White"],
      image: "/api/placeholder/300/400",
    },
    {
      id: 4,
      name: "Katana Sleeve Shirt",
      price: 49.99,
      description: "Premium cotton with Japanese calligraphy",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Red"],
      image: "/api/placeholder/300/400",
    },
  ];

  const ProductModal = ({ product, onClose }) => {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);

    const addToCart = () => {
      setCart([
        ...cart,
        {
          ...product,
          size: selectedSize,
          color: selectedColor,
        },
      ]);
      onClose();
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border border-red-500/30 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="font-gang text-3xl text-white">{product.name}</h2>
            <button onClick={onClose}>
              <X className="text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg border border-white/10"
              whileHover={{ scale: 1.05 }}
            />

            <div className="space-y-6">
              <p className="font-gang text-gray-400">{product.description}</p>

              <div>
                <h3 className="font-gang text-white mb-2">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border ${
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
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border ${
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
                <span className="font-gang text-2xl text-white">
                  ${product.price}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addToCart}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <ShoppingCart size={20} />
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
      
      {/* Conditional Rendering for Content Visibility */}
      {contentVisible && (
        <>
          {/* Background Image Container */}
          <div
            className="fixed inset-0 bg-cover bg-no-repeat bg-right opacity-40"
            style={{
              backgroundImage: `url(${BackgroundImage})`,
              backgroundSize: "30%",
              backgroundPosition: "right center",
              filter: "brightness(120%)", 
              zIndex: 0,
            }}
          ></div>
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
     
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.657 28 0h-2.83zM32.656 0L26.172 6.485 24 8.657 34.657 0h-2zM44.97 0L40.5 4.472 36.03 0h8.94zM12.807 0L9.5 3.308 6.193 0h6.614zM48.743 0L42.26 6.485 40.085 8.657 50.742 0h-2z' fill='%23FF0000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                animation: "pattern-slide 20s linear infinite",
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <h2 className="font-gang text-5xl text-white mb-6">
                WARRIOR <span className="text-red-500">GEAR</span>
 </h2>
              <div className="h-1 bg-red-500 w-48 mx-auto mb-8" />
              <p className="font-gang text-gray-400 max-w-2xl mx-auto">
                Embrace the spirit of the warrior with our exclusive collection.
                Each piece is crafted with honor and designed for the modern
                samurai.
              </p>
            </motion.div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedItem(product)}
                  className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border border-white/10 cursor-pointer hover:border-red-500/30 transition-all"
                >
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h3 className="font-gang text-xl text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="font-gang text-gray-400 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-gang text-xl text-white">
                      ${product.price}
                    </span>
                    <span className="text-red-500">View Details →</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart />
                <span className="font-gang">{cart.length} items</span>
              </motion.div>
            )}

            {/* Product Modal */}
            {selectedItem && (
              <ProductModal
                product={selectedItem}
                onClose={() => setSelectedItem(null)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

// export default Merch;

export default Merch;

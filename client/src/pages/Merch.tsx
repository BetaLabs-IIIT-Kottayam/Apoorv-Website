import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import BackgroundImage from "../assets/dragon.png";
import CheckoutForm from "../components/CheckoutForm";
import Loader from "../components/Loader";

export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  description: string;
  photos: { url: string }[];
  sizes?: string[];
  colors?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
  color: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  addToCart: (product: Product, size: string, color: string) => void;
}

const RATE_LIMIT_MS = 500;
let lastOperation = Date.now();

const Merch = () => {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [contentVisible, setContentVisible] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastOperation < RATE_LIMIT_MS) {
      return false;
    }
    lastOperation = now;
    return true;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/merch`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.merch);
        // setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        // setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = useCallback(
    (product: Product, size: string, color: string) => {
      if (!checkRateLimit()) {
        setError("Please wait before adding more items");
        return;
      }

      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) =>
            item.id === product.id && item.size === size && item.color === color
        );

        if (existingItemIndex > -1) {
          const updatedCart = [...prevCart];
          const newQuantity = Math.min(
            updatedCart[existingItemIndex].quantity + 1,
            10
          );
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: newQuantity,
          };
          return updatedCart;
        } else {
          return [
            ...prevCart,
            {
              ...product,
              size,
              color,
              quantity: 1,
            },
          ];
        }
      });

      setSelectedItem(null);
      setIsCartOpen(true);
      setError("");
    },
    []
  );

  const removeFromCart = useCallback(
    (index: number) => {
      if (!checkRateLimit()) {
        setError("Please wait before removing items");
        return;
      }

      if (index < 0 || index >= cart.length) {
        setError("Invalid cart operation");
        return;
      }

      setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (index: number, newQuantity: number) => {
      if (!checkRateLimit()) {
        setError("Please wait before updating quantity");
        return;
      }

      if (
        index < 0 ||
        index >= cart.length ||
        newQuantity < 1 ||
        newQuantity > 10
      ) {
        setError("Invalid quantity update");
        return;
      }

      setCart((prevCart) => {
        const updatedCart = [...prevCart];
        updatedCart[index] = {
          ...updatedCart[index],
          quantity: newQuantity,
        };
        return updatedCart;
      });
    },
    [cart]
  );

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3400);
    return () => clearTimeout(timer);
  }, []);

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
        <button onClick={() => setIsCartOpen(false)} aria-label="Close cart">
          <X className="text-gray-400 hover:text-white" />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400">Your cart is empty</div>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <motion.div
              key={`${item.id}`}
              className="flex items-center justify-between bg-black/30 p-4 rounded-lg"
            >
              <div>
                <h3 className="text-white font-gang">{item.name}</h3>
                <p className="text-gray-400 text-sm">
                  {item.size} | {item.color}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-white/20 rounded">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="p-2 text-white"
                    aria-label="Decrease quantity"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="p-2 text-white"
                    aria-label="Increase quantity"
                    disabled={item.quantity >= 10}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-300"
                  aria-label="Remove item"
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
                $
                {cart
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full bg-red-500 text-white py-3 rounded-lg"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              Checkout
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const ProductModal: React.FC<ProductModalProps> = ({
    product,
    onClose,
    addToCart,
  }) => {
    const defaultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
    const defaultColors = ["Black", "White"];

    const [selectedSize, setSelectedSize] = useState(
      (product.sizes && product.sizes[0]) || defaultSizes[0]
    );
    const [selectedColor, setSelectedColor] = useState(
      (product.colors && product.colors[0]) || defaultColors[0]
    );

    const sizes = product.sizes || defaultSizes;
    const colors = product.colors || defaultColors;

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
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <h2 className="font-gang text-xl md:text-3xl text-white">
              {product.name}
            </h2>
            <button onClick={onClose} aria-label="Close modal">
              <X className="text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <motion.img
              src={product.photos[0].url || "/placeholder-image.jpg"}
              alt={product.name}
              className="w-full rounded-lg border border-white/10 object-cover"
              whileHover={{ scale: 1.05 }}
            />

            <div className="space-y-4 md:space-y-6">
              <p className="font-gang text-sm md:text-base text-gray-400">
                {product.description}
              </p>

              <div role="group" aria-label="Size selection">
                <h3 className="font-gang text-white mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm border ${
                        selectedSize === size
                          ? "border-red-500 text-red-500"
                          : "border-white/20 text-white/60 hover:border-white/40"
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div role="group" aria-label="Color selection">
                <h3 className="font-gang text-white mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm border ${
                        selectedColor === color
                          ? "border-red-500 text-red-500"
                          : "border-white/20 text-white/60 hover:border-white/40"
                      }`}
                      aria-pressed={selectedColor === color}
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
                  onClick={() =>
                    addToCart(product, selectedSize, selectedColor)
                  }
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

  if (error && !products.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Loader />
      {contentVisible && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-no-repeat opacity-40"
            style={{
              backgroundImage: `url(${BackgroundImage})`,
              backgroundSize: "50%",
              backgroundPosition: "top right",
              filter: "brightness(120%)",
              zIndex: 0,
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
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="font-gang text-4xl sm:text-5xl text-white mb-8 sm:mb-16 text-center"
            >
              BATTLE GEAR
            </motion.h2>
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedItem(product)}
                  className="bg-black/50 border border-white/10 rounded-lg p-4 cursor-pointer hover:border-red-500/50 transition-all"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedItem(product);
                    }
                  }}
                >
                  <img
                    src={product.photos[0]?.url || "/placeholder-image.jpg"}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                  <h3 className="text-white font-gang text-xl mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-gang text-lg">
                      ${product.price}
                    </span>
                    <ShoppingCart
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 cursor-pointer shadow-lg z-40 hover:bg-red-600 transition-colors"
              aria-label={`Open cart with ${cart.length} items`}
            >
              <ShoppingCart size={20} />
              <span className="font-gang text-xs md:text-base">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </span>
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            {selectedItem && (
              <ProductModal
                key="product-modal"
                product={selectedItem}
                onClose={() => setSelectedItem(null)}
                addToCart={addToCart}
              />
            )}
            {isCartOpen && <CartCheckout key="cart-checkout" />}
            {isCheckoutOpen && (
              <CheckoutForm
                key="checkout-form"
                cart={cart}
                setCart={setCart}
                setIsCheckoutOpen={setIsCheckoutOpen}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Merch;

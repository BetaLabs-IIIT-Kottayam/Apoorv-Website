/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import BackgroundImage from "../assets/dragon.png";
import CheckoutForm from "../components/CheckoutForm";
import Loader from "../components/Loader";
import MerchDropoffPopup from "@/components/MerchDropoffPopup";


export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  description: string;
  photos: {
    length: number;
    map(arg0: (_: any, index: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    url: string
  }[];
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

// Helper function to get image URL from photo object
const getImageUrl = (photo: any): string => {
  if (photo.url) {
    return photo.url;
  } else if (photo.data) {
    // If the photo is stored as buffer data, convert it to base64
    // This is just an example, adjust according to your actual implementation
    return `data:${photo.contentType};base64,${Buffer.from(photo.data).toString('base64')}`;
  }
  return "/placeholder-image.jpg";
};

const Merch = () => {
  const [showDropoffPopup, setShowDropoffPopup] = useState(true);
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

        // console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        // console.log("Data",data);
        setProducts(data.merch);
        // setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("");
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
      className="fixed top-10 right-0 w-full md:w-96 h-full bg-gradient-to-br from-gray-900 to-black shadow-2xl z-50 p-6 overflow-y-auto rounded-md"
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
              key={`${item.id}-${index}`}
              className="flex items-center justify-between bg-black/30 p-4 rounded-lg"
            >
              <div>
                <h3 className="text-white font-gang">{item.name}</h3>
                <p className="text-gray-400 text-sm">
                  {item.size}
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
                Rs.
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

  const ComingSoonMessage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="mb-8"
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-red-500"
        >
          <path
            d="M50 10C27.91 10 10 27.91 10 50C10 72.09 27.91 90 50 90C72.09 90 90 72.09 90 50C90 27.91 72.09 10 50 10ZM50 85C30.67 85 15 69.33 15 50C15 30.67 30.67 15 50 15C69.33 15 85 30.67 85 50C85 69.33 69.33 85 50 85Z"
            fill="currentColor"
          />
          <path
            d="M45 30H55V70H45V30ZM30 45H70V55H30V45Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-gang text-4xl sm:text-5xl text-white mb-4"
      >
        近日公開
        <span className="text-red-500">.</span>
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl text-gray-300 mb-8 font-gang"
      >
        COMING SOON
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-gray-400 max-w-xl mx-auto mb-12"
      >
        Our battle gear collection is being forged with the finest materials and ancient techniques.
        Return soon to equip yourself with legendary items worthy of a true warrior.
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center justify-center space-x-2 text-gray-500"
      >
        <div className="w-8 h-px bg-red-500/50"></div>
        <span className="font-gang">戦闘の準備</span>
        <div className="w-8 h-px bg-red-500/50"></div>
      </motion.div>
    </motion.div>
  );

  const ProductModal: React.FC<ProductModalProps> = ({
    product,
    onClose,
    addToCart,
  }) => {
    console.log(product);
    const defaultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
    const defaultColors = ["Black", "White"];

    const [selectedSize, setSelectedSize] = useState(
      (product.sizes && product.sizes[0]) || defaultSizes[0]
    );
    const [selectedColor] = useState(
      (product.colors && product.colors[0]) || defaultColors[0]
    );
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const sizes = product.sizes || defaultSizes;

    // Make sure we have a photos array
    const photos = product.photos[0] || [];

    const nextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (photos.length <= 1) return;
      setCurrentImageIndex((prev) =>
        prev === photos.length - 1 ? 0 : prev + 1
      );
    };

    const prevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (photos.length <= 1) return;
      setCurrentImageIndex((prev) =>
        prev === 0 ? photos.length - 1 : prev - 1
      );
    };

    // Get the current image URL
    const currentImageUrl = photos.length > 0
      ? ('url' in photos)
        ? (photos as { url: string }).url
        : getImageUrl(photos[currentImageIndex])
      : "/placeholder-image.jpg";

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
            <div className="relative">
              <div
                className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg border border-white/10"
              >
                <motion.img
                  src={currentImageUrl}
                  alt={`${product.name} image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  key={`image-${currentImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {photos.length > 1 && (
                <div className="flex justify-center mt-2 gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full ${currentImageIndex === index ? "bg-red-500" : "bg-gray-500"
                        }`}
                      aria-label={`View image ${index + 1}`}
                      aria-current={currentImageIndex === index}
                    />
                  ))}
                </div>
              )}
            </div>

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
                      className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm border ${selectedSize === size
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

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="font-gang text-xl text-white">
                  Rs.{product.price}
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
      <Loader pageName="Merch" />
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
              BATTLE<span className="text-red-500">.</span>GEAR
            </motion.h2>
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg">
                {error}
              </div>
            )}

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  // Get the first image URL for the product card
                  const photos = product.photos[0] || [];
                  const imageUrl = photos && photos.length > 0
                    ? ('url' in photos)
                      ? (photos as { url: string }).url
                      : getImageUrl(photos[0])
                    : "/placeholder-image.jpg";

                  return (
                    <div
                      key={product.id}
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
                      <div className="relative w-full h-48 mb-4 overflow-hidden rounded">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-300 mb-4">{product.description}</p>
                      <p className="text-lg font-bold">Rs.{product.price}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ComingSoonMessage />
            )}

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
          </div>
        </>
      )}
      {showDropoffPopup && contentVisible && (
        <MerchDropoffPopup
          imageUrl="/popupImage.webp" // Replace with your image path
          onClose={() => setShowDropoffPopup(false)}
          autoCloseTime={0} // Set to 0 to disable auto-close, or add time in ms
        />
      )}
    </div>
  );
};

export default Merch;
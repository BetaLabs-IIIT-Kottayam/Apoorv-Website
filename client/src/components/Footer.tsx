import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Code2, Heart } from 'lucide-react';

const Footer = () => {
  const links = [
    { name: 'Terms', path: '/terms-conditions' },
    { name: 'Privacy', path: '/privacy-policy' },
    { name: 'Shipping', path: '/shipping-policy' },
    { name: 'Refunds', path: '/cancellation-refund' },
    { name: 'Contact', path: '/contact-us' }
  ];

  return (
    <motion.footer
      className="relative w-full mt-16 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent -top-16" />

      {/* Main Footer Content */}
      <div className="relative bg-black/90 border-t border-red-500/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row-reverse items-center justify-around gap-4">
            {/* Links */}
            <div className="flex flex-wrap justify-center items-center gap-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="relative text-gray-400 hover:text-red-500 transition-colors text-sm font-gang group"
                >
                  {link.name}
                  <span className="absolute inset-x-0 -bottom-1 h-px bg-red-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
                </Link>
              ))}
            </div>

            {/* Credits */}
            <motion.div
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Code2 
                size={16} 
                className="text-red-500 transition-transform group-hover:rotate-12" 
              />
              <span className="text-gray-400 font-gang text-sm group-hover:text-white transition-colors">
                CRAFTED BY BETALABS
              </span>
              <Heart 
                size={16} 
                className="text-red-500 transition-transform group-hover:scale-110" 
              />
            </motion.div>
          </div>

          {/* Copyright - Slim Version */}
          {/* <div className="text-center mt-4">
            <p className="text-xs text-gray-500 font-gang">
              © {new Date().getFullYear()} Apoorv Merchandise
            </p>
          </div> */}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
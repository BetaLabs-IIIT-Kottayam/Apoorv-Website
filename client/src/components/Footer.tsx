import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Code2, Heart, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const links = [
    { name: 'Terms', path: '/terms-conditions' },
    { name: 'Privacy', path: '/privacy-policy' },
    { name: 'Shipping', path: '/shipping-policy' },
    { name: 'Refunds', path: '/cancellation-refund' },
    { name: 'Contact', path: '/contact-us' }
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: 'https://instagram.com/apoorv_iiitk',
      color: 'hover:text-pink-500'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/apoorv-iiit-kottayam',
      color: 'hover:text-blue-500'
    }
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

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, color }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl text-gray-400 ${color} transition-all duration-300 ease-in-out`}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>

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
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
import { Mail } from "lucide-react";
import PolicyLayout from "../components/PolicyLayout";
import { motion } from 'framer-motion';

export const Shipping = () => {
  return (
    <PolicyLayout title="SHIPPING POLICY">
      <div className="space-y-8 text-gray-300">
        <p className="text-lg">Thank you for shopping at Apoorv Merchandise! Please read our shipping policy carefully.</p>
        
        {[
          {
            title: "Delivery Method",
            content: "We do not offer traditional shipping. All merchandise will be delivered directly in our campus. Orders will be delivered to a specific room on campus, and you will be notified in advance via WhatsApp groups."
          },
          {
            title: "Delivery Time",
            content: "Delivery times will be communicated to you through WhatsApp groups once your order is ready for pickup."
          },
          {
            title: "No Shipping Costs",
            content: "Since all orders are delivered directly on campus, there are no shipping charges."
          }
        ].map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <h3 className="text-2xl text-white font-gang mb-4">{index + 1}. {section.title}</h3>
            <p className="text-gray-400">{section.content}</p>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-white mb-4">For any questions about delivery, contact us at:</p>
          <a 
            href="mailto:apoorv@iiitkottayam.ac.in"
            className="inline-flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors"
          >
            <Mail size={20} />
            <span>apoorv@iiitkottayam.ac.in</span>
          </a>
        </motion.div>
      </div>
    </PolicyLayout>
  );
};

export default Shipping;
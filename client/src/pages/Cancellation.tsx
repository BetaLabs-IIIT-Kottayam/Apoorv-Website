import { Mail } from "lucide-react";
import PolicyLayout from "../components/PolicyLayout";
import { motion } from 'framer-motion'

export const Cancellation = () => {
  return (
    <PolicyLayout title="CANCELLATION & REFUNDS">
      <div className="space-y-8 text-gray-300">
        <p className="text-lg">We want you to have a seamless shopping experience. Please review our cancellation and refund policy below.</p>
        
        {[
          {
            title: "No Cancellations",
            content: "Once an order is placed, it cannot be canceled. Please ensure you review your order carefully before confirming."
          },
          {
            title: "No Returns or Refunds",
            content: "We do not accept returns or offer refunds for any merchandise purchased. All sales are final."
          },
          {
            title: "Damaged or Defective Items",
            content: "If you receive a damaged or defective item, please contact us immediately at apoorv@iiitkottayam.ac.in for assistance."
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
          <p className="text-white mb-4">For any questions about returns or refunds, contact us at:</p>
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

export default Cancellation;
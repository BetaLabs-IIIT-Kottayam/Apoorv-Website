import { Mail } from "lucide-react";
import PolicyLayout from "../components/PolicyLayout";
import { motion } from 'framer-motion';

export const Contact = () => {
  return (
    <PolicyLayout title="CONTACT US">
      <div className="space-y-8 text-gray-300">
        <p className="text-lg">We're here to help! If you have any questions, concerns, or need assistance, please don't hesitate to reach out to us.</p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 p-6 border border-white/10"
        >
          <h3 className="text-2xl text-white font-gang mb-4">Business Hours</h3>
          <div className="space-y-2 text-gray-400">
            <p>Monday - Friday: 9 AM - 6 PM</p>
            <p>Saturday: 10 AM - 4 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-2xl text-white font-gang mb-4">Get in Touch</h3>
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

export default Contact;
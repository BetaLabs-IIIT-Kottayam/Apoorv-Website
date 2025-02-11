import PolicyLayout from "../components/PolicyLayout";
import { motion } from 'framer-motion';

export const Terms = () => {
  return (
    <PolicyLayout title="TERMS & CONDITIONS">
      <div className="space-y-8 text-gray-300">
        <p className="text-lg">Welcome to Apoorv Merchandise! By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>
        
        {[
          {
            title: "Use of the Website",
            content: "You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the website."
          },
          {
            title: "Intellectual Property",
            content: "All content on this website, including text, graphics, logos, and images, is the property of Apoorv Merchandise and is protected by copyright laws."
          },
          {
            title: "Orders and Payments",
            content: "By placing an order, you agree to pay the specified price for the merchandise. We use Razorpay for secure payment processing."
          },
          {
            title: "Limitation of Liability",
            content: "Apoorv Merchandise is not liable for any damages arising from the use of this website or the purchase of merchandise."
          },
          {
            title: "Governing Law",
            content: "These terms are governed by the laws of India."
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
      </div>
    </PolicyLayout>
  );
};

export default Terms
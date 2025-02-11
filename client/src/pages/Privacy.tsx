import { Mail } from "lucide-react";
import PolicyLayout from "../components/PolicyLayout";
import { motion } from "framer-motion"

export const Privacy = () => {
  return (
    <PolicyLayout title="PRIVACY POLICY">
      <div className="space-y-8 text-gray-300">
        <p className="text-lg">At Apoorv Merchandise, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.</p>
        
        {[
          {
            title: "Information We Collect",
            content: "We may collect personal information such as your name, email address, shipping address, and payment details when you place an order."
          },
          {
            title: "How We Use Your Information",
            content: "Your information is used to process orders, improve our services, and communicate with you about your order."
          },
          {
            title: "Data Security",
            content: "We use Razorpay for secure payment processing and implement industry-standard security measures to protect your data."
          },
          {
            title: "Third-Party Services",
            content: "We do not share your personal information with third parties except as necessary to fulfill your order (e.g., shipping carriers)."
          },
          {
            title: "Changes to This Policy",
            content: "We may update this policy from time to time. Any changes will be posted on this page."
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
          <p className="text-white mb-4">For any privacy-related questions, contact us at:</p>
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

export default Privacy;
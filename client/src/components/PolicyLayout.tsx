import { motion } from 'framer-motion';

import { ReactNode, useEffect } from 'react';

interface PolicyLayoutProps {
    children: ReactNode;
    title: string;
}

const PolicyLayout = ({ children, title }: PolicyLayoutProps) => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            <div className="fixed inset-0 bg-[url('/letters.png')] bg-cover bg-no-repeat opacity-40 bg-center"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto py-24 px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="font-gang text-5xl text-white mb-6">
                        {title}
                    </h2>
                    <div className="h-1 bg-red-500 w-48 mx-auto" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black/30 backdrop-blur-lg border-2 border-white/10 p-8"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default PolicyLayout
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import BackgroundImage from "../assets/letters.png";
import Loader from "../components/Loader";

const Sponsors = () => {
  const particlesInit = async (engine: any) => await loadFull(engine);
  const [contentVisible, setContentVisible] = useState(false);
  const [sponsorLogos, setSponsorLogos] = useState<string[]>([]);

  useEffect(() => {
    const importLogos = async () => {
      const images = import.meta.glob(
        "../assets/sponsors/image*.{png,jpg,svg}",
        {
          eager: true,
          as: "url",
        }
      );
      setSponsorLogos(Object.values(images));
    };

    importLogos();
  }, []);
  // Wait for loader to complete before showing content
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3400);
    return () => clearTimeout(timer);
  }, []);

  // Existing sponsorship tiers data
  // const sponsorshipTiers = [
  //   {
  //     name: "Imperial Patron",
  //     benefits: ["Main Stage Branding", "Keynote Speaking Slot", "Full-Page Ad in Brochure"],
  //     sponsors: ["Sakura Technologies", "Bushido Labs"]
  //   },
  //   {
  //     name: "Shogun Partner",
  //     benefits: ["Workshop Sponsorship", "Social Media Shoutouts", "Logo on All Merch"],
  //     sponsors: ["Katana Cloud", "Ronin Robotics"]
  //   }
  // ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Loader pageName="Sponsors"/>
      {/* Cherry Blossom Particles */}
      {contentVisible && (
        <div
          className="fixed inset-0 bg-cover bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "50%",
            backgroundPosition: "center",
            filter: "brightness(120%)",
            zIndex: 0,
          }}
        ></div>
      )}
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
      {contentVisible && (
        <Particles
          init={particlesInit}
          options={{
            particles: {
              number: { value: 25 },
              color: { value: "#FF1A1A" },
              opacity: { value: 0.3 },
              size: { value: 3 },
              move: {
                enable: true,
                speed: 2,
                direction: "bottom",
                straight: true,
              },
              shape: { type: "image", image: { src: "/cherry-blossom.png" } },
            },
          }}
          className="absolute inset-0 z-0"
        />
      )}

      {contentVisible && (
        <div className="relative z-10 max-w-7xl mx-auto py-24 px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-gang text-5xl text-white mb-8 text-center relative z-10"
            >
              HONORED <span className="text-red-500">ALLIES</span>
            </motion.h2>
            <div className="h-1 bg-red-500 w-48 mx-auto mb-8" />
            <p className="font-gang text-gray-400 max-w-2xl mx-auto">
              Join the legacy of visionary organizations shaping the future of
              tech and culture. Your support fuels innovation and preserves
              ancient traditions.
            </p>
          </motion.div>

          {/* Sponsorship Tiers */}
          {/* <div className="grid md:grid-cols-2 gap-12 mb-24">
            {sponsorshipTiers.map((tier, index) => (
              <motion.div 
                key={tier.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="border-2 border-white/10 bg-black/30 backdrop-blur-lg p-8"
              >
                <h3 className="font-gang text-2xl text-red-500 mb-6">{tier.name}</h3>
                
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-6">
                    <h4 className="font-gang text-white mb-4">Benefits Include:</h4>
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center font-gang text-gray-400">
                          <div className="w-2 h-2 bg-red-500 mr-3" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-gang text-white mb-4">Current Sponsors:</h4>
                    <div className="flex flex-wrap gap-6">
                      {tier.sponsors.map((sponsor) => (
                        <div key={sponsor} className="py-2 px-4 border border-white/20 hover:border-red-500 transition-all">
                          <p className="font-gang text-white">{sponsor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div> */}

          {/* Past Sponsors Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center"
          >
            <h3 className="font-gang text-3xl text-white mb-12">
              Previous Champions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {sponsorLogos.map((logo, i) => (
                <div
                  key={i}
                  className="aspect-square bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center p-4"
                >
                  <img
                    src={logo}
                    alt={`Sponsor Logo ${i + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-24"
          >
            <div className="border-2 border-white/10 p-8 max-w-2xl mx-auto">
              <h3 className="font-gang text-2xl text-white mb-6">
                BECOME A PATRON
              </h3>
              <p className="font-gang text-gray-400 mb-8">
                Forge your legacy with us. Contact our sponsorship team to
                discuss partnership opportunities.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-red-500 text-white font-gang px-8 py-3 rounded-none border-2 border-white"
              >
                <a href="mailto:apoorv@iiitkottayam.ac.in">INITIATE ALLIANCE</a>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Sponsors;

function loadFull(_: any) {
  throw new Error("Function not implemented.");
}

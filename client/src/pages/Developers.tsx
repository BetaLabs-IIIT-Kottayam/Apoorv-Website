// import { motion } from "framer-motion";
// import BackgroundImage from "../assets/samurai.png";
// import { useState, useEffect } from "react";
// import Loader from "../components/Loader";

// const Developers = () => {
//   const [contentVisible, setContentVisible] = useState(false);

//   // Wait for loader to complete before showing content
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setContentVisible(true);
//     }, 2100); // 2000ms for loader + 1500ms for transition
//     return () => clearTimeout(timer);
//   }, []);

//   const developers = [
//     { id: 1, name: "Ryu Hayabusa", role: "Frontend Developer" },
//     { id: 2, name: "Kasumi", role: "Backend Developer" },
//     { id: 3, name: "Ayane", role: "UI/UX Designer" },
//   ];

//   return (
//     <div className="min-h-screen bg-black py-24 px-8">
//       <Loader/>
//       {/* Background Image Container */}
//       {contentVisible && (
        
//         <div
//         className="fixed inset-0 bg-cover bg-no-repeat bg-right opacity-40"
//         style={{
//           backgroundImage: `url(${BackgroundImage})`,
//           backgroundSize: "40%",
//           backgroundPosition: "right center",
//           filter: "brightness(120%)",
//           zIndex: 0
//         }}
//         ></div>
        
//       )}
//       {/* Conditional Rendering for Content Visibility */}
//       {contentVisible && (
//         <>
//           <h1 className="font-gang text-5xl text-white mb-24 text-center">
//             DEV<span className="text-primary">.</span>ELOPERS
//           </h1>

//           <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
//             {developers.map((dev) => (
//               <motion.div
//                 key={dev.id}
//                 whileHover={{ y: -20 }}
//                 className="relative bg-black border-2 border-white/10 p-8"
//               >
//                 <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10" />
                
//                 <div className="relative z-10">
//                   <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden">
//                     <div className="absolute inset-0 bg-[url('/dev-pattern.png')] bg-cover bg-center 
//                       opacity-80 group-hover:scale-110 transition-transform duration-500" />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
//                         <span className="text-4xl font-gang text-primary">
//                           {dev.name.split(" ")[0][0]}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <h3 className="font-gang text-2xl text-white mb-2">
//                     {dev.name.toUpperCase()}
//                   </h3>
//                   <p className="font-gang text-primary">{dev.role.toUpperCase()}</p>
                  
//                   <div className="mt-6 h-[2px] bg-gradient-to-r from-primary to-transparent w-1/2" />
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Developers;



import { motion } from "framer-motion";
import BackgroundImage from "../assets/samurai.png";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import akhileshImage from "../assets/akhilesh.jpg"

const Developers = () => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  const developers = [
    { id: 1, name: "Shashank Upadhyay", role: "Dev" , imageUri : ""},
    { id: 2, name: "Anshumohan Acharya", role: "Dev" , imageUri : ""},
    { id: 3, name: "Akhilesh Nekar", role: "Dev" ,imageUri : akhileshImage},
  ];

  return (
    <div className="min-h-screen bg-black py-24 px-8">
      <Loader />
      
      {contentVisible && (
        <div
          className="fixed inset-0 bg-cover bg-no-repeat bg-right opacity-40"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "40%",
            backgroundPosition: "right center",
            filter: "brightness(120%)",
            zIndex: 0
          }}
        />
      )}

      
      {contentVisible && (
        <>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-gang text-5xl text-white mb-24 text-center relative z-10"
          >
            DEV<span className="text-primary">.</span>ELOPERS
          </motion.h1>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {developers.map((dev, index) => (
              <motion.div
                key={dev.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -20, transition: { duration: 0.3 } }}
                className="relative z-10 backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-8 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-5 rounded-xl" />
                
                <div className="relative z-10">
                  <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden rounded-lg">
                    <div 
                      className="absolute inset-0 bg-[url('/dev-pattern.png')] bg-cover bg-center 
                      opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <span className="text-4xl font-gang text-primary">
                          {dev.name.split(" ")[0][0]}
                        </span>
                      </div> */}
                      <img src={dev.imageUri}></img>
                    </div>
                  </div>
                  
                  <h3 className="font-gang text-2xl text-white mb-2">
                    {dev.name.toUpperCase()}
                  </h3>
                  <p className="font-gang text-primary">{dev.role.toUpperCase()}</p>
                  
                  <div className="mt-6 h-[2px] bg-gradient-to-r from-primary to-transparent w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Developers;
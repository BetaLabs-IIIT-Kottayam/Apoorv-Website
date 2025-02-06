import type React from "react"
import { useEffect, useRef,useState } from "react"
import { gsap } from "gsap"
import anime from "animejs"
import Home from "../pages/Home"
import { motion } from "framer-motion";

const Montana: React.FC = () => {
  const headerRef = useRef<HTMLHeadingElement>(null)
      const [contentVisible, setContentVisible] = useState(false);
    
      useEffect(() => {
        const timer = setTimeout(() => {
          setContentVisible(true);
        }, 7400);
        return () => clearTimeout(timer);
      }, []);
  useEffect(() => {
    // Initially show the images
    gsap.set(".images > div", {
      opacity: 1,
      y: 0,
      scale: 1,
    })

    gsap.from(".navbar > div", {
      duration: 0.8,
      y: 80,
      opacity: 0,
      stagger: 0.08,
      delay: 0.5,
    })

    gsap.from(".images > div", {
      duration: 0.8,
      y: 80,
      opacity: 0,
      stagger: 0.08,
      delay: 0.5,
    })

    gsap.to(".navbar > div", {
      duration: 0.8,
      y: -80,
      opacity: 0,
      stagger: 0.04,
      delay: 4,
    })

    // Images to disappear
    gsap.to(".images > div", {
      duration: 0.4,
      scale: 0,
      opacity: 0,
      stagger: 0.04,
      delay: 4,
    })

    // Text to come from bottom
    gsap.fromTo(
      ".header",
      {
        y: "100%",
        opacity: 0,
      },
      {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        delay: 5,
      },
    )

    // Anime.js animation for header letters
    const textWrapper = headerRef.current
    if (textWrapper) {
      textWrapper.innerHTML = textWrapper.textContent!.replace(/\S/g, "<span class='letter'>$&</span>")

      anime.timeline().add({
        targets: ".header .letter",
        translateY: [100, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 2000,
        delay: (el: HTMLElement, i: number) => 5000 + 40 * i,
      })
    }
  }, [])

  // Sample image URLs
  const imageUrls = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=140&h=180&fit=crop",
    "https://plus.unsplash.com/premium_photo-1711987494491-e2d3add52ff2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amFwYW5lc2UlMjBhcnR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1615790469537-7c9d8e95c047?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFwYW5lc2UlMjBzYW11cmFpfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=140&h=180&fit=crophttps://plus.unsplash.com/premium_photo-1711987494491-e2d3add52ff2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amFwYW5lc2UlMjBhcnR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=140&h=180&fit=crophttps://plus.unsplash.com/premium_photo-1711987494491-e2d3add52ff2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amFwYW5lc2UlMjBhcnR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=140&h=180&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=140&h=180&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=140&h=180&fit=crop",
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="overlay fixed inset-0 bg-black flex flex-col items-center justify-center">
        <h1 ref={headerRef} className="header font-gang text-[12vw] font-reval text-white mb-8 opacity-0">
          APOORV
          <div className="mt-5 font-gang">2025</div>
        </h1>
        <div className="images grid grid-cols-4 gap-4 justify-center items-center">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className={`img img-${index + 1} w-[140px] h-[180px] overflow-hidden rounded-lg backdrop-blur-sm bg-white/5`}
            >
              <img
                src={url || "/placeholder.svg"}
                alt={`Fashion ${index + 1}`}
                className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
        <div className="navbar absolute bottom-10 w-full flex justify-around text-white text-uppercase font-neue-montreal">
          <div className="site-title">itsale montana</div>
          <div className="site-icon">✴</div>
          <div className="site-type">clothing brand</div>
        </div>
      </div>
      {contentVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          <Home />
        </motion.div>
      )}
    </div>
  )
}

export default Montana


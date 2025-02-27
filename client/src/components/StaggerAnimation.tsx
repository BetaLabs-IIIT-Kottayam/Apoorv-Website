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
        }, 4700);
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
        delay: (_: HTMLElement, i: number) => 5000 + 40 * i,
      })
    }
  }, [])

  // Sample image URLs
  const imageUrls = [
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFwYW5lc2UlMjB0aGVtZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1711987494491-e2d3add52ff2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amFwYW5lc2UlMjBhcnR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1615790469537-7c9d8e95c047?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFwYW5lc2UlMjBzYW11cmFpfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amFwYW5lc2UlMjB0aGVtZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1534247555660-d4af46712d27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFwYW5lc2UlMjB0aGVtZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amFwYW5lc2UlMjB0aGVtZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGphcGFuZXNlJTIwdGhlbWV8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFwYW5lc2UlMjB0aGVtZXxlbnwwfHwwfHx8MA%3D%3D",
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="overlay fixed inset-0 bg-black flex flex-col items-center justify-center">
        <div className="images grid grid-cols-3 gap-4 justify-center items-center">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className={`img img-${index + 1} w-[180px] h-[200px] overflow-hidden rounded-lg backdrop-blur-sm bg-white/5`}
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
          <div className="site-type"></div>
          <div className="site-icon"></div>
          <div className="site-icon"></div>
          <div className="site-icon"></div>
          <div className="site-icon"></div>
          <div className="site-icon"></div>
          <div className="site-icon"></div>
          <div className="site-icon"></div>
          <div className="site-icon"></div>
          <div className="site-type"></div>
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


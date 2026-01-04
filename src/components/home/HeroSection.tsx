import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroVideo1 from "@/assets/hero-video-1.mp4";
import heroVideo2 from "@/assets/hero-video-2.mp4";
import heroVideo3 from "@/assets/hero-video-3.mp4";
const videos = [heroVideo1, heroVideo2, heroVideo3];
export const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex]);
  const handleVideoEnd = () => {
    setCurrentVideoIndex(prev => (prev + 1) % videos.length);
    setIsLoaded(false);
  };
  return <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background - Fullscreen */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.video key={currentVideoIndex} ref={videoRef} autoPlay muted playsInline onLoadedData={() => setIsLoaded(true)} onEnded={handleVideoEnd} initial={{
          opacity: 0
        }} animate={{
          opacity: isLoaded ? 1 : 0
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 1.5
        }} className="w-full h-full object-cover">
            <source src={videos[currentVideoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        {/* Dark elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 shadow-2xl" />
      </div>

      {/* Centered Content - Tresla Style */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.5
      }} className="mb-8">
          {/* Logo/Brand Name */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold text-cream tracking-wider mb-4 md:text-2xl">TOP NOTCH EVENT AND FOOD SERVICES</h1>
          
        </motion.div>

        

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 1.1
      }}>
          <Link to="/order">
            <Button variant="outline" size="lg" className="px-12 py-6 text-base tracking-widest uppercase border-cream/50 text-cream bg-transparent hover:bg-cream/10 hover:border-cream transition-all duration-500">
              Enter
            </Button>
          </Link>
        </motion.div>

        {/* Metrics */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 1.4
      }} className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-serif font-bold text-cream">500+</p>
            <p className="text-sm text-cream/60 uppercase tracking-wider mt-1">Events Catered</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-serif font-bold text-cream">15+</p>
            <p className="text-sm text-cream/60 uppercase tracking-wider mt-1">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-serif font-bold text-cream">98%</p>
            <p className="text-sm text-cream/60 uppercase tracking-wider mt-1">Client Satisfaction</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 2
    }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        
      </motion.div>

      {/* Awards/Badges - Bottom Left like Tresla */}
      <motion.div initial={{
      opacity: 0,
      x: -20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      duration: 1,
      delay: 1.5
    }} className="absolute bottom-8 left-8 hidden md:block">
        
      </motion.div>
    </section>;
};
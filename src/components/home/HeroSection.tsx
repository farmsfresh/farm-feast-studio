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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
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
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold text-cream tracking-wider mb-4 md:text-6xl">PREMIUM WORLDCLASS</h1>
          <p className="text-cream/80 text-base sm:text-lg tracking-[0.3em] uppercase font-light md:text-3xl">EVENTS, CATERING & KITCHEN SERVICES</p>
        </motion.div>

        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.8
      }} className="text-cream/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Elevated Catering, Corporate Dining, Event Venues — Hospitality Without Limits
        </motion.p>

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

        {/* Video Indicators */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.5
      }} className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3">
          {videos.map((_, index) => <button key={index} onClick={() => {
          setCurrentVideoIndex(index);
          setIsLoaded(false);
        }} className={`w-2 h-2 rounded-full transition-all duration-500 ${currentVideoIndex === index ? "bg-primary w-8" : "bg-cream/40 hover:bg-cream/60"}`} aria-label={`Video ${index + 1}`} />)}
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
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center p-2">
          <motion.div animate={{
          y: [0, 8, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
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
        <p className="text-cream/50 text-xs uppercase tracking-wider max-w-xs leading-relaxed">
          Premium Catering Services · Farm to Table Excellence · 15+ Years Experience
        </p>
      </motion.div>
    </section>;
};
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroVideo1 from "@/assets/hero-video-1.mp4";
import heroVideo2 from "@/assets/hero-video-2.mp4";
import heroVideo3 from "@/assets/hero-video-3.mp4";
import heroVideo4 from "@/assets/hero-video-4.mp4";

const videos = [heroVideo1, heroVideo2, heroVideo3, heroVideo4];

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

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background - Fullscreen */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.video
            key={currentVideoIndex}
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            onEnded={handleVideoEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-cover"
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        {/* Dark elegant overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered Content - Tresla Style */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-normal text-cream tracking-[0.2em] uppercase">
            Farms Fresh Food
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-cream/80 tracking-[0.3em] mt-4 uppercase">
            Elevated Catering, Corporate Dining, and Events — Hospitality Without Limits
          </p>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10"
        >
          <Link to="/order">
            <Button
              variant="outline"
              size="lg"
              className="px-16 py-4 text-sm tracking-[0.3em] uppercase border-cream/40 text-cream bg-transparent hover:bg-cream/10 hover:border-cream transition-all duration-500 rounded-none"
            >
              Enter
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
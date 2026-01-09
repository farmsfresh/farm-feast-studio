import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroVideo3 from "@/assets/hero-video-3.mp4";
import heroVideo6 from "@/assets/hero-video-6.mp4";
import heroVideo7 from "@/assets/hero-video-7.mp4";
import heroVideoCorporate from "@/assets/hero-video-corporate-salads.mp4";

const videos = [heroVideoCorporate, heroVideo6, heroVideo3, heroVideo7];

export const HeroSection = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    // Play the current video
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {});
    }

    // First video plays for 5 seconds, others play full duration
    if (currentVideoIndex === 0) {
      const timer = setTimeout(() => {
        setCurrentVideoIndex(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentVideoIndex]);

  const handleVideoEnd = (index: number) => {
    if (index === currentVideoIndex && index !== 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  };

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
      {/* Video Background - All videos stacked, opacity controls visibility */}
      <div className="absolute inset-0 z-0">
        {videos.map((video, index) => (
          <video
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            muted
            playsInline
            onEnded={() => handleVideoEnd(index)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: currentVideoIndex === index ? 1 : 0 }}
          >
            <source src={video} type="video/mp4" />
          </video>
        ))}
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
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-cream tracking-[0.2em] uppercase md:text-5xl">
            PREMIUM EVENTS WORLDCLASS CUISINE
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
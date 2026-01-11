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

    // First video: 5 seconds, second video: full duration, others: 2 seconds
    if (currentVideoIndex === 0) {
      const timer = setTimeout(() => {
        setCurrentVideoIndex(1);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (currentVideoIndex >= 2) {
      const timer = setTimeout(() => {
        setCurrentVideoIndex(prev => (prev + 1) % videos.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentVideoIndex]);
  const handleVideoEnd = (index: number) => {
    if (index === currentVideoIndex && index !== 0) {
      setCurrentVideoIndex(prev => (prev + 1) % videos.length);
    }
  };
  return <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
      {/* Video Background - All videos stacked, opacity controls visibility */}
      <div className="absolute inset-0 z-0">
        {videos.map((video, index) => <video key={index} ref={el => videoRefs.current[index] = el} muted playsInline onEnded={() => handleVideoEnd(index)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" style={{
        opacity: currentVideoIndex === index ? 1 : 0
      }}>
            <source src={video} type="video/mp4" />
          </video>)}
        {/* Dark elegant overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered Content - Tresla Style */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-24">
        {/* Title */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.5
      }} className="text-center">
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-cream tracking-[0.2em] uppercase md:text-3xl">PREMIUM EVENTS - WORLDCLASS CUISINE</h1>
          <p className="text-xs sm:text-sm md:text-base text-cream/80 tracking-[0.3em] mt-4 uppercase">
            Elevated Catering, Corporate Dining, and Events — Hospitality Without Limits
          </p>
        </motion.div>

        {/* Order Online Button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.8
      }} className="mt-10">
          <Link to="/order">
            <Button variant="outline" size="lg" className="px-16 py-4 text-sm tracking-[0.3em] uppercase border-cream/40 text-cream bg-transparent hover:bg-cream/10 hover:border-cream transition-all duration-500 rounded-none">
              Order Online
            </Button>
          </Link>
        </motion.div>

        {/* CTA Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 1.1
      }} className="mt-8 text-center">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-cream mb-4">
            Ready to Create Something
            <span className="text-gold ml-2">Extraordinary?</span>
          </h2>
          <Link to="/quote">
            <Button variant="gold" size="lg">
              Get a Free Quote
            </Button>
          </Link>
        </motion.div>

        {/* Metrics Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 1.4
      }} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {[{
            value: "15+",
            label: "Years Experience"
          }, {
            value: "50,000+",
            label: "Happy Customers"
          }, {
            value: "2,500+",
            label: "Events Catered"
          }, {
            value: "40+",
            label: "Expert Chefs"
          }].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-gold mb-1">
                {stat.value}
              </div>
              <div className="text-cream/70 text-xs md:text-sm tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>;
};
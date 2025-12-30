import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, Award, ChefHat } from "lucide-react";
import heroVideo1 from "@/assets/hero-video-1.mp4";
import heroVideo2 from "@/assets/hero-video-2.mp4";
import heroVideo3 from "@/assets/hero-video-3.mp4";
const videos = [heroVideo1, heroVideo2, heroVideo3];
const metrics = [{
  icon: Users,
  value: "50,000+",
  label: "Customers Served"
}, {
  icon: Calendar,
  value: "2,500+",
  label: "Events Catered"
}, {
  icon: Award,
  value: "15+",
  label: "Years Experience"
}, {
  icon: ChefHat,
  value: "40+",
  label: "Expert Chefs"
}];
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
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.video key={currentVideoIndex} ref={videoRef} autoPlay muted playsInline onLoadedData={() => setIsLoaded(true)} onEnded={handleVideoEnd} initial={{
          opacity: 0
        }} animate={{
          opacity: isLoaded ? 1 : 0
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 1
        }} className="w-full h-full object-cover">
            <source src={videos[currentVideoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        {/* Clean dark overlay - no green/retro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Video Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {videos.map((_, index) => <button key={index} onClick={() => {
        setCurrentVideoIndex(index);
        setIsLoaded(false);
      }} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentVideoIndex === index ? "bg-gold w-8" : "bg-white/40 hover:bg-white/60"}`} aria-label={`Video ${index + 1}`} />)}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }}>
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium tracking-wide mb-6 backdrop-blur-sm border border-white/20">
              Farm-to-Table Excellence
            </span>
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">Top notch event services
Experience the best in class services and catering<span className="block text-gold">The best in class catering</span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }} className="text-white/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-bold md:text-lg">Experience culinary excellence with our diverse menu featuring cuisines from around the world. Made with love to provide homestyle flavors and sourced with care.</motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.8
        }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order">
              <Button variant="gold" size="xl" className="w-full sm:w-auto">
                Order Online
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/quote">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                Get a Quote
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Metrics */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 1
      }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, index) => <motion.div key={metric.label} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5,
          delay: 1.2 + index * 0.1
        }} className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <metric.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <div className="font-serif text-2xl md:text-3xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className="text-white/60 text-sm">{metric.label}</div>
            </motion.div>)}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.5
    }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <motion.div animate={{
          y: [0, 8, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="w-1.5 h-1.5 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>;
};
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, Award, ChefHat } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";

const metrics = [
  { icon: Users, value: "50,000+", label: "Customers Served" },
  { icon: Calendar, value: "2,500+", label: "Events Catered" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: ChefHat, value: "40+", label: "Expert Chefs" },
];

export const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 bg-forest/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6 backdrop-blur-sm border border-gold/30">
              Farm-to-Table Excellence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6"
          >
            Crafting Culinary
            <span className="block text-gold">Experiences</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From intimate gatherings to grand celebrations, we bring farm-fresh 
            ingredients and artisan expertise to create unforgettable moments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="text-center p-6 rounded-xl bg-cream/5 backdrop-blur-sm border border-cream/10 hover:bg-cream/10 transition-all duration-300"
            >
              <metric.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <div className="font-serif text-2xl md:text-3xl font-bold text-cream mb-1">
                {metric.value}
              </div>
              <div className="text-cream/60 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
};

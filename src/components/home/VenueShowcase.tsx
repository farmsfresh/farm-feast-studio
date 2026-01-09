import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import heroVideo1 from "@/assets/hero-video-1.mp4";
import heroVideo3 from "@/assets/hero-video-3.mp4";
import venueCorporate from "@/assets/venue-corporate.jpg";
import venueWedding from "@/assets/venue-wedding.jpg";
import venuePrivate from "@/assets/venue-private.jpg";
import venueOutdoor from "@/assets/venue-outdoor.jpg";

const venues = [
  {
    id: 1,
    title: "Corporate Events",
    description: "Elegant dining experiences for your business gatherings",
    video: heroVideo1,
    image: venueCorporate,
  },
  {
    id: 2,
    title: "Wedding Catering",
    description: "Make your special day unforgettable with exquisite cuisine",
    video: heroVideo3,
    image: venueWedding,
  },
  {
    id: 3,
    title: "Private Dining",
    description: "Intimate gatherings with personalized culinary experiences",
    video: heroVideo1,
    image: venuePrivate,
  },
  {
    id: 4,
    title: "Outdoor Events",
    description: "Fresh air and fresh flavors for your outdoor celebrations",
    video: heroVideo1,
    image: venueOutdoor,
  },
];

const VenueCard = ({ venue, index }: { venue: typeof venues[0]; index: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onClick={handleClick}
      className="group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
    >
      {/* Background Image */}
      <img
        src={venue.image}
        alt={venue.title}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
          isPlaying ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
      />

      {/* Video - plays on click */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={venue.video} type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Play indicator */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
          isPlaying ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <div className="w-16 h-16 rounded-full border-2 border-cream/50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <Play className="w-6 h-6 text-cream fill-cream/50" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <motion.div
          initial={false}
          animate={{ y: isPlaying ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-cream mb-2">
            {venue.title}
          </h3>
          <p
            className={`text-cream/70 text-sm mb-4 transition-all duration-500 ${
              isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {venue.description}
          </p>
        </motion.div>
      </div>

      {/* Purple accent glow when playing */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at center, hsl(280 50% 55% / 0.15) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
};

export const VenueShowcase = () => {
  return (
    <section className="pt-8 pb-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-4 border border-primary/20">
            Our Venues
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Experience <span className="text-primary">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we create unforgettable culinary experiences
          </p>
        </motion.div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue, index) => (
            <VenueCard key={venue.id} venue={venue} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="text-lg font-medium tracking-wide uppercase">View All Services</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

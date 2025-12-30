import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 bg-forest relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-6">
            Ready to Create Something
            <span className="text-gold block mt-2">Extraordinary?</span>
          </h2>
          <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
            Let our culinary experts craft the perfect menu for your next event. 
            From corporate gatherings to intimate celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote">
              <Button variant="gold" size="xl" className="w-full sm:w-auto">
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="tel:+18001234567">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                <Phone className="w-5 h-5" />
                (800) 123-4567
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

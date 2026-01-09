import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Users, ChefHat, BedDouble, Coffee, UtensilsCrossed, Sparkles, ArrowRight } from "lucide-react";
const services = [{
  icon: CalendarCheck,
  title: "Event Planning",
  description: "Full-service event planning from concept to execution, tailored to your vision."
}, {
  icon: Users,
  title: "Event Management",
  description: "Professional coordination ensuring flawless execution of your special occasions."
}, {
  icon: ChefHat,
  title: "On-site Culinary Management",
  description: "Expert chefs managing your kitchen operations with precision and creativity."
}, {
  icon: BedDouble,
  title: "BOXED MEALS",
  description: "Premium in-room dining experiences for hotels and hospitality venues."
}, {
  icon: Coffee,
  title: "Micro Kitchens",
  description: "Compact culinary solutions for offices and co-working spaces."
}, {
  icon: UtensilsCrossed,
  title: "Catering",
  description: "Exquisite catering for events of all sizes with customizable menus."
}, {
  icon: Sparkles,
  title: "Pop-up Catering",
  description: "Unique pop-up dining experiences that create lasting impressions."
}];
export const ServicesPreview = () => {
  return <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Our Services
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-primary-foreground">
            From intimate gatherings to grand corporate events, we deliver exceptional 
            culinary experiences tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => <motion.div key={service.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-elegant transition-all duration-300 border border-border hover:border-gold/30">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <service.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>)}
        </div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="text-center mt-12">
          <Link to="/services">
            <Button variant="elegant" size="lg" className="gap-2">
              Explore All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>;
};
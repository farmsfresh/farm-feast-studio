import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { 
  CalendarCheck, 
  Users, 
  ChefHat, 
  Package, 
  Coffee, 
  UtensilsCrossed, 
  Sparkles,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const services = [
  {
    icon: CalendarCheck,
    title: "Event Planning",
    description: "Full-service event planning from concept to execution. Our team handles every detail to bring your vision to life.",
    features: ["Venue selection assistance", "Theme development", "Vendor coordination", "Timeline management", "Budget optimization"],
  },
  {
    icon: Users,
    title: "Event Management",
    description: "Professional on-site coordination ensuring flawless execution of your special occasions from start to finish.",
    features: ["Day-of coordination", "Staff management", "Guest services", "Logistics handling", "Emergency planning"],
  },
  {
    icon: ChefHat,
    title: "On-site Culinary Management",
    description: "Expert chefs managing your kitchen operations with precision, creativity, and unwavering quality standards.",
    features: ["Menu development", "Kitchen staff training", "Quality control", "Inventory management", "Health compliance"],
  },
  {
    icon: Package,
    title: "Boxed Meals",
    description: "A premium meal program that brings home-cooking quality dining straight to your office in beautifully presented, sustainably packaged individual boxes.",
    features: ["Individual packaging", "Sustainable materials", "Fresh daily preparation", "Dietary accommodations", "Swift delivery"],
  },
  {
    icon: Coffee,
    title: "Micro Kitchens",
    description: "Compact culinary solutions perfect for offices, co-working spaces, and corporate environments.",
    features: ["Daily fresh options", "Healthy selections", "Coffee & beverages", "Snack programs", "Sustainable practices"],
  },
  {
    icon: UtensilsCrossed,
    title: "Catering",
    description: "Exquisite catering services for events of all sizes with fully customizable menus to match your vision.",
    features: ["Custom menu creation", "Dietary options", "Full service staff", "Equipment rentals", "Setup & cleanup"],
  },
  {
    icon: Sparkles,
    title: "Pop-up Catering",
    description: "Unique pop-up dining experiences that create lasting impressions and unforgettable moments.",
    features: ["Creative concepts", "Interactive stations", "Themed experiences", "Social media worthy", "Flexible locations"],
  },
];

const Services = () => {
  return (
    <Layout>
      <Helmet>
        <title>Catering Services | Farms Fresh Food | Event Planning, Boxed Meals & Corporate Catering</title>
        <meta name="description" content="Professional catering services including event planning, corporate catering, boxed meals, micro kitchens, and pop-up catering. Serving Brisbane, CA and the Bay Area." />
        <meta name="keywords" content="catering services, event planning, corporate catering, boxed meals, micro kitchens, pop-up catering, wedding catering, office catering, Brisbane CA" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-forest to-forest-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6">
              Our Expertise
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Services That <span className="text-gold">Inspire</span>
            </h1>
            <p className="text-cream/70 text-base md:text-lg leading-relaxed px-4">
              From intimate gatherings to grand corporate events, our comprehensive 
              services are designed to exceed your expectations at every touchpoint.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-12 md:space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 md:mb-6">
                    <service.icon className="w-7 h-7 md:w-8 md:h-8 text-gold" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-gold" />
                        </div>
                        <span className="text-foreground text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/quote">
                    <Button variant="elegant" size="lg" className="w-full sm:w-auto">
                      Get a Quote
                    </Button>
                  </Link>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""} relative`}>
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary to-muted overflow-hidden relative group">
                    <div className="absolute inset-0 bg-forest/5 group-hover:bg-forest/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <service.icon className="w-20 md:w-24 h-20 md:h-24 text-gold/20" />
                    </div>
                  </div>
                  <div className="absolute -bottom-3 md:-bottom-4 -right-3 md:-right-4 w-20 md:w-24 h-20 md:h-24 bg-gold/10 rounded-2xl -z-10" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8">
              Contact us today to discuss your needs and receive a customized proposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quote">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  Request a Quote
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
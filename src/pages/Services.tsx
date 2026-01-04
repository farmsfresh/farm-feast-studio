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

// Import service images
import serviceEventPlanning from "@/assets/service-event-planning.jpg";
import serviceEventManagement from "@/assets/service-event-management.jpg";
import serviceCulinary from "@/assets/service-culinary.jpg";
import serviceBoxedMeals from "@/assets/service-boxed-meals.jpg";
import serviceMicroKitchen from "@/assets/service-micro-kitchen.jpg";
import serviceCatering from "@/assets/service-catering.jpg";
import servicePopup from "@/assets/service-popup.jpg";

const services = [
  {
    icon: CalendarCheck,
    title: "Event Planning",
    description: "Full-service event planning from concept to execution. Our team handles every detail to bring your vision to life.",
    features: ["Venue selection assistance", "Theme development", "Vendor coordination", "Timeline management", "Budget optimization"],
    image: serviceEventPlanning,
  },
  {
    icon: Users,
    title: "Event Management",
    description: "Professional on-site coordination ensuring flawless execution of your special occasions from start to finish.",
    features: ["Day-of coordination", "Staff management", "Guest services", "Logistics handling", "Emergency planning"],
    image: serviceEventManagement,
  },
  {
    icon: ChefHat,
    title: "On-site Culinary Management",
    description: "Expert chefs managing your kitchen operations with precision, creativity, and unwavering quality standards.",
    features: ["Menu development", "Kitchen staff training", "Quality control", "Inventory management", "Health compliance"],
    image: serviceCulinary,
  },
  {
    icon: Package,
    title: "Boxed Meals",
    description: "A premium meal program that brings home-cooking quality dining straight to your office in beautifully presented, sustainably packaged individual boxes.",
    features: ["Individual packaging", "Sustainable materials", "Fresh daily preparation", "Dietary accommodations", "Swift delivery"],
    image: serviceBoxedMeals,
  },
  {
    icon: Coffee,
    title: "Micro Kitchens",
    description: "Compact culinary solutions perfect for offices, co-working spaces, and corporate environments.",
    features: ["Daily fresh options", "Healthy selections", "Coffee & beverages", "Snack programs", "Sustainable practices"],
    image: serviceMicroKitchen,
  },
  {
    icon: UtensilsCrossed,
    title: "Catering",
    description: "Exquisite catering services for events of all sizes with fully customizable menus to match your vision.",
    features: ["Custom menu creation", "Dietary options", "Full service staff", "Equipment rentals", "Setup & cleanup"],
    image: serviceCatering,
  },
  {
    icon: Sparkles,
    title: "Pop-up Catering",
    description: "Unique pop-up dining experiences that create lasting impressions and unforgettable moments.",
    features: ["Creative concepts", "Interactive stations", "Themed experiences", "Social media worthy", "Flexible locations"],
    image: servicePopup,
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
      <section className="pt-32 pb-16 bg-muted relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium tracking-wide mb-6">
              Our Expertise
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Services That <span className="text-primary">Inspire</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed px-4">
              From intimate gatherings to grand corporate events, our comprehensive 
              services are designed to exceed your expectations at every touchpoint.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-8 rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-300 border border-border/50 hover:border-primary/30 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}>
                  {/* Image */}
                  <div className="w-full md:w-72 lg:w-80 shrink-0">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                      {service.features.slice(0, 3).map((feature) => (
                        <span 
                          key={feature} 
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          <Check className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Link to="/quote">
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Get a Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-muted">
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
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Request a Quote
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary/50 text-foreground hover:bg-primary/10">
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
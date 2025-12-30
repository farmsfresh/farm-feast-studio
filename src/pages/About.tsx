import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Leaf, Award, Heart, Users, ShieldCheck, Utensils, Globe, Check } from "lucide-react";
import { Helmet } from "react-helmet-async";

const values = [
  {
    icon: Leaf,
    title: "Farm Fresh",
    description: "We source the freshest ingredients from local farms and trusted suppliers.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Every dish is crafted with precision and an unwavering commitment to quality.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our love for food shines through in every culinary creation we deliver.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in bringing people together through exceptional dining experiences.",
  },
];

const productFeatures = [
  { icon: Globe, text: "Diverse global cuisines celebrating today's workforce" },
  { icon: Utensils, text: "Accommodating to every dietary preference and need" },
  { icon: ShieldCheck, text: "Unwavering commitment to food safety" },
  { icon: Heart, text: "Every guest feels considered and cared for" },
];

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Us | Farms Fresh Food Catering | Our Story & Mission</title>
        <meta name="description" content="Learn about Farms Fresh Food Catering's journey from a small catering operation to a full-service culinary company. Farm-to-table excellence with diverse global cuisines." />
        <meta name="keywords" content="about farms fresh food, catering company story, farm to table catering, local catering company, Brisbane CA catering, sustainable catering, professional caterers" />
      </Helmet>
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-forest to-forest-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6">
              Our Story
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              About <span className="text-gold">Farms Fresh Food</span>
            </h1>
            <p className="text-cream/70 text-base md:text-lg leading-relaxed px-4">
              For many years we've been crafting extraordinary culinary experiences 
              that celebrate the bounty of local farms and recipes from our family's homestyle cooking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">
                Our Journey
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                OUR STORY
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Farms Fresh Food began with a simple mission to transform the way people experience food. 
                  What started as a small catering operation has grown into a full-service culinary company 
                  serving thousands of clients across the region.
                </p>
                <p>
                  Our journey is rooted in the belief that exceptional food starts with exceptional ingredients. 
                  We source the freshest seasonal produce, sustainably raised proteins, and premium pantry staples.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-muted overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="w-24 md:w-32 h-24 md:h-32 text-gold/20" />
                </div>
              </div>
              <div className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 w-24 md:w-32 h-24 md:h-32 bg-gold/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 md:-top-6 -right-4 md:-right-6 w-20 md:w-24 h-20 md:h-24 bg-forest/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block text-center">
              What We Offer
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              OUR PRODUCTS
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed mb-10">
              <p className="text-center text-base md:text-lg">
                Our menus celebrate the diversity of today's workforce. From modern classics to bold global flavors, 
                we design culinary programs that reflect a broad range of cuisines and cultures. We're deeply 
                accommodating to every dietary preference and need, ensuring every guest feels considered and cared for. 
                And above all, we operate with an unwavering commitment to food safety. Every dish is prepared, 
                delivered, and served with the highest standards of care and quality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {productFeatures.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 md:p-6 rounded-xl bg-background border border-border"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                  </div>
                  <p className="text-foreground text-sm md:text-base">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">
              What We Believe
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 md:mb-5">
                  <value.icon className="w-7 h-7 md:w-8 md:h-8 text-gold" />
                </div>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 bg-forest">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "50,000+", label: "Happy Customers" },
              { value: "2,500+", label: "Events Catered" },
              { value: "40+", label: "Expert Chefs" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-cream/70 text-xs md:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
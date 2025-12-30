import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Leaf, Award, Heart, Users } from "lucide-react";

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

const About = () => {
  return (
    <Layout>
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
            <p className="text-cream/70 text-lg leading-relaxed">
              For over 15 years, we've been crafting extraordinary culinary experiences 
              that celebrate the bounty of local farms and the artistry of our chefs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                From Farm to <span className="text-gold">Your Table</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2010, Farms Fresh Food began with a simple mission: to transform 
                  the way people experience food. What started as a small catering operation 
                  has grown into a full-service culinary company serving thousands of clients 
                  across the region.
                </p>
                <p>
                  Our journey is rooted in the belief that exceptional food starts with 
                  exceptional ingredients. We work directly with local farmers and artisan 
                  producers to source the freshest seasonal produce, sustainably raised 
                  proteins, and premium pantry staples.
                </p>
                <p>
                  Today, our team of over 40 expert chefs brings together diverse culinary 
                  traditions with modern techniques to create memorable dining experiences 
                  for every occasion.
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
                  <Leaf className="w-32 h-32 text-gold/20" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-forest/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">
              What We Believe
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-forest">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                <div className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-cream/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Event Coordinator, Tech Corp",
    content: "Absolutely phenomenal service! The team transformed our corporate gala into an unforgettable culinary experience. Every dish was a masterpiece.",
    rating: 5,
  },
  {
    id: 2,
    name: "James & Emily Rodriguez",
    role: "Wedding Clients",
    content: "Our wedding day was perfect thanks to their incredible attention to detail. Guests are still raving about the food months later!",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "CEO, Innovation Labs",
    content: "We use them for all our executive lunches and client dinners. Consistently excellent quality and professional service every single time.",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-card rounded-xl p-8 shadow-sm border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300 relative"
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 text-gold/20">
        <Quote className="w-10 h-10" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-gold text-gold" />
        ))}
      </div>

      {/* Content */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div>
        <p className="font-semibold text-foreground">{testimonial.name}</p>
        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
      </div>
    </motion.div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium tracking-wide mb-4 border border-gold/20">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-gold">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by hundreds of satisfied clients for exceptional catering experiences
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

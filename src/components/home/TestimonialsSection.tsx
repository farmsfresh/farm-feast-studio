import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  {
    id: 4,
    name: "Amanda Foster",
    role: "Private Event Host",
    content: "The attention to dietary restrictions was impressive. They made sure every guest felt included without compromising on taste or presentation.",
    rating: 5,
  },
  {
    id: 5,
    name: "David Thornton",
    role: "VP of Operations, Global Finance",
    content: "From the initial consultation to the final course, the experience was seamless. Our clients were thoroughly impressed with the quality.",
    rating: 5,
  },
  {
    id: 6,
    name: "Rachel & Tom Williams",
    role: "Anniversary Celebration",
    content: "They created a custom menu that perfectly captured our love story. The flavors, presentation, and service exceeded all expectations.",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300 relative h-full">
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
    </div>
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

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 bg-card border-border hover:bg-gold/10 hover:border-gold/30" />
              <CarouselNext className="static translate-y-0 bg-card border-border hover:bg-gold/10 hover:border-gold/30" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

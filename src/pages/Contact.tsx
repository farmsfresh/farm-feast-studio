import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "(800) 123-4567",
    subtext: "Mon-Fri 8am-6pm PST",
    href: "tel:+18001234567",
  },
  {
    icon: Mail,
    title: "Email",
    details: "hello@farmsfresh.com",
    subtext: "We respond within 24 hours",
    href: "mailto:hello@farmsfresh.com",
  },
  {
    icon: MapPin,
    title: "Location",
    details: "123 Gourmet Lane",
    subtext: "Culinary District, CA 90210",
    href: "#",
  },
  {
    icon: Clock,
    title: "Hours",
    details: "Monday - Saturday",
    subtext: "8:00 AM - 8:00 PM",
    href: "#",
  },
];

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-forest to-forest-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium tracking-wide mb-6">
              Get In Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Contact <span className="text-gold">Us</span>
            </h1>
            <p className="text-cream/70 text-lg">
              We'd love to hear from you. Reach out for any questions or inquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Let's Start a Conversation
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Whether you're planning an intimate gathering or a grand celebration, 
                our team is here to help bring your culinary vision to life.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-foreground font-medium">{item.details}</p>
                    <p className="text-muted-foreground text-sm mt-1">{item.subtext}</p>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input id="name" placeholder="John Doe" className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="mt-2" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="How can we help you?" className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="mt-2 min-h-32"
                    required
                  />
                </div>
                <Button variant="gold" size="lg" type="submit" className="w-full gap-2">
                  <Send className="w-5 h-5" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-secondary relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gold/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Interactive map coming soon</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

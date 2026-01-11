import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "650-866-0520",
    subtext: "Mon-Sun 8am-8pm",
    href: "tel:650-866-0520",
  },
  {
    icon: Mail,
    title: "Email",
    details: "catering@farmsfreshfood.com",
    subtext: "We respond within 24 hours",
    href: "mailto:catering@farmsfreshfood.com",
  },
  {
    icon: MapPin,
    title: "Location",
    details: "294 Industrial Way",
    subtext: "Brisbane, CA 94005",
    href: "https://maps.google.com/?q=294+Industrial+Way+Brisbane+CA+94005",
  },
  {
    icon: Clock,
    title: "Hours",
    details: "Monday - Sunday",
    subtext: "8:00 AM - 8:00 PM",
    href: "#",
  },
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (error) throw error;

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Us | Farms Fresh Food Catering | Brisbane, CA</title>
        <meta name="description" content="Contact Farms Fresh Food Catering at 650-866-0520 or catering@farmsfreshfood.com. Located at 294 Industrial Way, Brisbane, CA 94005. Open Monday-Sunday 8AM-8PM." />
        <meta name="keywords" content="contact catering, Brisbane CA catering, catering phone number, catering email, Bay Area catering contact" />
      </Helmet>
      
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-forest to-forest-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Contact <span className="text-gold">Us</span>
            </h1>
            <p className="text-cream/70 text-base md:text-lg px-4">
              We'd love to hear from you. Reach out for any questions or inquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                Let's Start a Conversation
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                Whether you're planning an intimate gathering or a grand celebration, 
                our team is here to help bring your culinary vision to life.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group p-4 md:p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-elegant transition-all duration-300"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gold/20 transition-colors">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm md:text-base">{item.title}</h3>
                    <p className="text-foreground font-medium text-sm md:text-base break-all">{item.details}</p>
                    <p className="text-muted-foreground text-xs md:text-sm mt-1">{item.subtext}</p>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border"
            >
              <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm">Your Name *</Label>
                    <Input id="name" placeholder="John Doe" className="mt-2" required value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="mt-2" required value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-2" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-sm">Subject *</Label>
                  <Input id="subject" placeholder="How can we help you?" className="mt-2" required value={formData.subject} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="mt-2 min-h-24 md:min-h-32"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button variant="gold" size="lg" type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-64 md:h-96 bg-secondary relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gold/30 mx-auto mb-4" />
            <p className="text-foreground font-medium text-sm md:text-base">294 Industrial Way, Brisbane, CA 94005</p>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">Interactive map coming soon</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
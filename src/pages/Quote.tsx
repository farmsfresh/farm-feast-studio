import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const Quote = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Quote request submitted! We'll be in touch within 24 hours.");
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
              Let's Create Together
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6">
              Get a <span className="text-gold">Quote</span>
            </h1>
            <p className="text-cream/70 text-lg">
              Tell us about your event and we'll craft a customized proposal just for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div className="bg-card rounded-xl p-8 border border-border">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-2" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input id="company" placeholder="Your company name" className="mt-2" />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-card rounded-xl p-8 border border-border">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Event Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="service">Service Needed *</Label>
                    <Select required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event-planning">Event Planning & Management</SelectItem>
                        <SelectItem value="culinary">On-site Culinary Management</SelectItem>
                        <SelectItem value="boxed-meals">Boxed Meals</SelectItem>
                        <SelectItem value="micro-kitchens">Micro Kitchens</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="popup">Pop-up Catering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="private">Private Party</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="popup">Pop-up Event</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      Event Date *
                    </Label>
                    <Input id="date" type="date" className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="guests" className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gold" />
                      Number of Guests *
                    </Label>
                    <Input id="guests" type="number" placeholder="50" className="mt-2" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold" />
                      Event Location
                    </Label>
                    <Input id="location" placeholder="City, State or Venue name" className="mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5k">Under $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="over-50k">Over $50,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-card rounded-xl p-8 border border-border">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Additional Information
                </h2>
                <div>
                  <Label htmlFor="message">Tell us about your vision</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your event, dietary requirements, theme preferences, or any special requests..."
                    className="mt-2 min-h-32"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="gold" size="xl" type="submit" className="gap-2">
                  <Send className="w-5 h-5" />
                  Submit Quote Request
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Quote;

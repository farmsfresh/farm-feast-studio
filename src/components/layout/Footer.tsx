import { Link } from "react-router-dom";
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-forest text-cream">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <Leaf className="w-5 h-5 text-forest-dark" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight text-cream">
                  FARMS FRESH
                </span>
                <span className="text-xs tracking-widest text-gold">FOOD</span>
              </div>
            </Link>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Crafting extraordinary culinary experiences with farm-fresh ingredients 
              and artisan techniques since 2010.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-forest-dark transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Order Online", "Get a Quote", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item === "Home" ? "" : item.toLowerCase().replace(/ /g, "-").replace("order-online", "order").replace("get-a-quote", "quote").replace("contact-us", "contact")}`}
                    className="text-cream/70 hover:text-gold transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-gold">Our Services</h4>
            <ul className="space-y-3">
              {["Event Planning", "Catering", "On-site Culinary", "Room Service", "Pop-up Events", "Micro Kitchens"].map((item) => (
                <li key={item}>
                  <span className="text-cream/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-gold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm">
                  123 Gourmet Lane<br />
                  Culinary District, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href="tel:+18001234567" className="text-cream/70 hover:text-gold text-sm transition-colors">
                  (800) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:hello@farmsfresh.com" className="text-cream/70 hover:text-gold text-sm transition-colors">
                  hello@farmsfresh.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-sm">
            © 2024 Farms Fresh Food. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-cream/50 hover:text-gold text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cream/50 hover:text-gold text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

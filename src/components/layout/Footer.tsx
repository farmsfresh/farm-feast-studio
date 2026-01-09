import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

// YouTube icon component
const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Instagram icon component
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="bg-forest text-cream">
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand with Large Logo */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex flex-col items-start gap-4 mb-6">
              <img 
                src={logo} 
                alt="Farms Fresh Food Catering" 
                className="h-24 md:h-28 lg:h-32 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg md:text-xl leading-tight text-cream">
                  FARMS FRESH FOOD
                </span>
                <span className="text-xs tracking-widest text-gold">CATERING</span>
              </div>
            </Link>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Crafting extraordinary culinary experiences with farm-fresh ingredients 
              and artisan techniques.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-forest-dark transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 md:mb-6 text-gold">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
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
            <h4 className="font-serif text-lg font-semibold mb-4 md:mb-6 text-gold">Our Services</h4>
            <ul className="space-y-2 md:space-y-3">
              {["Event Planning", "Catering", "On-site Culinary", "Boxed Meals", "Pop-up Events", "Micro Kitchens"].map((item) => (
                <li key={item}>
                  <span className="text-cream/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 md:mb-6 text-gold">Contact Us</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm">
                  294 Industrial Way<br />
                  Brisbane, CA 94005
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href="tel:650-866-0520" className="text-cream/70 hover:text-gold text-sm transition-colors">
                  650-866-0520
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:catering@farmsfreshfood.com" className="text-cream/70 hover:text-gold text-sm transition-colors break-all">
                  catering@farmsfreshfood.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0" />
                <span className="text-cream/70 text-sm">
                  Mon - Sun: 8 AM - 8 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-xs md:text-sm text-center md:text-left">
            © 2024 Farms Fresh Food Catering. All rights reserved.
          </p>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="text-cream/50 hover:text-gold text-xs md:text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cream/50 hover:text-gold text-xs md:text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
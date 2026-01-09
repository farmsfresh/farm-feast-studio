import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Facebook, Instagram, Linkedin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

// YouTube icon component
const Youtube = ({
  className
}: {
  className?: string;
}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>;

const navItems = [{
  name: "Home",
  path: "/"
}, {
  name: "About",
  path: "/about"
}, {
  name: "Services",
  path: "/services"
}, {
  name: "Order Online",
  path: "/order"
}, {
  name: "Blog",
  path: "/blog"
}, {
  name: "Contact",
  path: "/contact"
}];
const socialLinks = [{
  icon: Facebook,
  href: "https://facebook.com",
  label: "Facebook"
}, {
  icon: Instagram,
  href: "https://instagram.com",
  label: "Instagram"
}, {
  icon: Youtube,
  href: "https://youtube.com",
  label: "YouTube"
}, {
  icon: Linkedin,
  href: "https://linkedin.com",
  label: "LinkedIn"
}];
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.6,
    ease: "easeOut"
  }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-header shadow-elegant py-2" : "bg-header/95 backdrop-blur-sm py-3"}`}>
      
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top row - Contact info and social icons centered */}
        <div className="hidden lg:flex justify-center items-center gap-8 text-sm py-1.5 border-b border-cream/10">
          <a href="tel:650-866-0520" className="flex items-center gap-2 transition-colors text-cream hover:text-primary whitespace-nowrap font-medium">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>650-866-0520</span>
          </a>
          <div className="h-4 w-px bg-cream/30" />
          <a href="mailto:catering@farmsfreshfood.com" className="flex items-center gap-2 transition-colors text-cream hover:text-primary font-medium">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span>catering@farmsfreshfood.com</span>
          </a>
          <div className="h-4 w-px bg-cream/30" />
          <div className="flex items-center gap-1">
            {socialLinks.map(social => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="p-1 rounded-full transition-all duration-300 text-cream/70 hover:text-primary hover:bg-primary/10" aria-label={social.label}>
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="h-4 w-px bg-cream/30" />
          {/* Account */}
          <Link to="/account" className="p-1.5 rounded-full transition-all duration-300 text-cream/80 hover:text-primary hover:bg-primary/10" aria-label="My Account">
            <User className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Main header row */}
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <img src={logo} alt="Farms Fresh Food Catering" className="h-14 sm:h-20 md:h-24 w-auto group-hover:scale-105 transition-transform duration-300" />
            <h1 className="font-serif text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-cream whitespace-nowrap">FARMS FRESH EVENTS & CATERING</h1>
          </Link>

          {/* Right side - Navigation + CTA */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => <Link key={item.name} to={item.path} className={`px-2.5 py-1.5 text-sm font-medium transition-all duration-300 rounded-md ${location.pathname === item.path ? "text-primary bg-primary/15" : "text-cream/90 hover:text-primary hover:bg-primary/10"}`}>
                {item.name}
              </Link>)}
            <Link to="/quote" className="ml-2">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Get a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-md transition-colors text-cream hover:text-primary">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.3
      }} className="lg:hidden bg-header border-t border-primary/20">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {/* Mobile Contact Info */}
              <div className="flex flex-col gap-2 px-4 py-3 mb-2 border-b border-primary/20">
                <a href="tel:650-866-0520" className="flex items-center gap-2 text-sm text-cream/80 hover:text-primary">
                  <Phone className="w-4 h-4" />
                  <span>650-866-0520</span>
                </a>
                <a href="mailto:catering@farmsfreshfood.com" className="flex items-center gap-2 text-sm text-cream/80 hover:text-primary">
                  <Mail className="w-4 h-4" />
                  <span>catering@farmsfreshfood.com</span>
                </a>
              </div>
              
              {navItems.map(item => <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className={`px-4 py-3 text-sm font-medium rounded-md transition-all ${location.pathname === item.path ? "text-primary bg-primary/15" : "text-cream/90 hover:bg-primary/10 hover:text-primary"}`}>
                  {item.name}
                </Link>)}
              
              {/* Mobile Social Links */}
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-primary/20 mt-2">
                {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-cream/70 hover:text-primary hover:bg-primary/10 transition-all" aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </a>)}
              </div>
              
              <Link to="/account" onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-2 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <User className="w-4 h-4" />
                  My Account
                </Button>
              </Link>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.nav>;
};
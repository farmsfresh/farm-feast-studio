import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Facebook, Instagram, Linkedin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

// YouTube icon component
const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Threads icon component
const Threads = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.527-1.122.984.005 1.902.14 2.751.402.02-.466.01-.934-.027-1.4-.158-2.036-1.035-3.058-2.681-3.126-1.12-.037-2.09.283-2.73.9l-.336.354-1.333-1.49.39-.376c1.026-.99 2.482-1.51 4.09-1.46 2.958.12 4.676 1.905 4.907 5.093.042.581.046 1.178.014 1.785.86.442 1.601 1.012 2.19 1.695.863 1 1.478 2.333 1.478 4.02 0 3.25-2.058 5.97-5.94 7.014C16.29 23.725 14.307 24 12.186 24zm.512-8.963c-1.054-.016-1.946.176-2.583.543-.63.364-.951.865-.91 1.418.04.517.37.962.93 1.253.613.319 1.39.47 2.187.42 1.036-.058 1.86-.445 2.382-1.094.363-.452.588-1.018.694-1.668-.812-.27-1.702-.412-2.655-.423l-.045-.449z"/>
  </svg>
);

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
  name: "Get a Quote",
  path: "/quote"
}, {
  name: "Contact Us",
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
}, {
  icon: Threads,
  href: "https://threads.net",
  label: "Threads"
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
  }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-elegant py-2" : "bg-black/30 backdrop-blur-sm py-3"}`}>
      {/* Top bar with contact info */}
      <div className={`hidden md:block border-b transition-colors ${isScrolled ? "border-border/30 bg-muted/50" : "border-white/10 bg-black/20"}`}>
        <div className="container mx-auto px-4 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Contact Info */}
            <div className="flex items-center gap-6 text-sm">
              <a href="tel:650-866-0520" className={`flex items-center gap-2 transition-colors ${isScrolled ? "text-foreground/70 hover:text-gold" : "text-cream/70 hover:text-cream"}`}>
                <Phone className="w-3.5 h-3.5" />
                <span>650-866-0520</span>
              </a>
              <a href="mailto:catering@farmsfreshfood.com" className={`flex items-center gap-2 transition-colors ${isScrolled ? "text-foreground/70 hover:text-gold" : "text-cream/70 hover:text-cream"}`}>
                <Mail className="w-3.5 h-3.5" />
                <span>catering@farmsfreshfood.com</span>
              </a>
            </div>
            
            {/* Social Media Icons - centered */}
            <div className="flex items-center gap-2">
              {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-full transition-all duration-300 ${isScrolled ? "text-foreground/70 hover:text-gold hover:bg-gold/10" : "text-cream/70 hover:text-cream hover:bg-white/10"}`} aria-label={social.label}>
                  <social.icon className="w-4 h-4" />
                </a>)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title - increased logo size by 1/3 (h-16 to h-20) */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Farms Fresh Food Catering" className="h-24 md:h-28 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div className="hidden sm:block">
              <h1 className={`font-serif text-xl md:text-2xl font-bold leading-tight ${isScrolled ? "text-foreground" : "text-cream"}`}>
                FARMS FRESH FOOD
              </h1>
              <span className={`text-[10px] md:text-xs tracking-widest ${isScrolled ? "text-gold" : "text-gold-light"}`}>CATERING</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => <Link key={item.name} to={item.path} className={`px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md ${location.pathname === item.path ? isScrolled ? "text-gold bg-gold/10" : "text-gold-light bg-white/10" : isScrolled ? "text-foreground hover:text-gold hover:bg-gold/5" : "text-cream/90 hover:text-cream hover:bg-white/10"}`}>
                {item.name}
              </Link>)}
          </div>

          {/* My Account */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/account">
              <Button variant={isScrolled ? "elegant" : "hero-outline"} size="sm" className="gap-2">
                <User className="w-4 h-4" />
                My Account
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-md transition-colors ${isScrolled ? "text-foreground" : "text-cream"}`}>
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
      }} className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {/* Mobile Contact Info */}
              <div className="flex flex-col gap-2 px-4 py-3 mb-2 border-b border-border">
                <a href="tel:650-866-0520" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold">
                  <Phone className="w-4 h-4" />
                  <span>650-866-0520</span>
                </a>
                <a href="mailto:catering@farmsfreshfood.com" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold">
                  <Mail className="w-4 h-4" />
                  <span>catering@farmsfreshfood.com</span>
                </a>
              </div>
              
              {navItems.map(item => <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className={`px-4 py-3 text-sm font-medium rounded-md transition-all ${location.pathname === item.path ? "text-gold bg-gold/10" : "text-foreground hover:bg-muted"}`}>
                  {item.name}
                </Link>)}
              
              {/* Mobile Social Links */}
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-border mt-2">
                {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-foreground/70 hover:text-gold hover:bg-gold/10 transition-all" aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </a>)}
              </div>
              
              <Link to="/account" onClick={() => setIsOpen(false)}>
                <Button variant="elegant" className="w-full mt-2 gap-2">
                  <User className="w-4 h-4" />
                  My Account
                </Button>
              </Link>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.nav>;
};
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Sitemap', href: '/sitemap' },
  ],
  services: [
    { name: 'Home Loans', href: '/services/home-loans' },
    { name: 'Interior Design', href: '/services/interior-design' },
    { name: 'Property Promotions', href: '/services/property-promotions' },
  ],
  properties: [
    { name: 'Buy Property', href: '/properties?type=sale' },
    { name: 'Rent Property', href: '/properties?type=rent' },
    { name: 'New Projects', href: '/properties?status=under-construction' },
    { name: 'Commercial', href: '/properties?propertyType=commercial' },
  ],
  cities: [
    { name: 'Hyderabad', href: '/properties?city=Hyderabad' },
    { name: 'Bangalore', href: '/properties?city=Bangalore' },
    { name: 'Mumbai', href: '/properties?city=Mumbai' },
    { name: 'Gurgaon', href: '/properties?city=Gurgaon' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
];

export function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FooterSection = ({ title, links, sectionKey }: { title: string; links: typeof footerLinks.company; sectionKey: string }) => {
    const isOpen = openSections[sectionKey] ?? false;
    
    return (
      <div>
        <button
          onClick={() => toggleSection(sectionKey)}
          className="md:pointer-events-none flex items-center justify-between w-full md:justify-start font-semibold mb-4 md:mb-4"
        >
          <span>{title}</span>
          <span className="md:hidden">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </span>
        </button>
        <ul className={cn(
          "space-y-2 transition-all duration-300 ease-in-out",
          "md:block",
          isOpen ? "block" : "hidden"
        )}>
          {links.map((link) => (
            <li key={link.name}>
              <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className="relative bg-foreground text-primary-foreground overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/footer-bg.jpg)' }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/80"></div>
      
      {/* Main Footer */}
      <div className="relative z-10 container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold leading-tight">Houses Adda</span>
                <span className="text-xs text-primary-foreground/60 leading-tight">Find Your Dream Home</span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              India's trusted real estate platform. Find apartments, villas, plots and commercial spaces across major cities.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@housesadda.in" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                info@housesadda.in
              </a>
              <a href="tel:+916301575658" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                +91 63015 75658
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>8-1-284-/ou/25, OU Colony, Shaikpet, Manikonda, Hyderabad, Telangana 500104</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <FooterSection title="Company" links={footerLinks.company} sectionKey="company" />
          <FooterSection title="Services" links={footerLinks.services} sectionKey="services" />
          <FooterSection title="Properties" links={footerLinks.properties} sectionKey="properties" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Houses Adda. All rights reserved. Developed by{' '}
            <a 
              href="https://www.octaleads.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors underline"
            >
              Octaleads Pvt Ltd.
            </a>
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

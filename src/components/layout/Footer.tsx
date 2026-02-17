import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONTACT } from '@/constants/contact';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Enquiry Form', href: '/contact-form' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Sitemap', href: '/sitemap.xml' },
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
  { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@Housesadda' },
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1METREdCYd/?mibextid=wwXIfr' },
  { name: 'X', icon: Twitter, href: 'https://x.com/housesadda?s=21' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/housesadda?igsh=MWo0ZzA0cXE4bXU2eQ%3D%3D&utm_source=qr' },
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
            <div className="space-y-3">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                {CONTACT.phone}
              </a>
              <a href={`tel:${CONTACT.alternatePhoneRaw}`} className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                {CONTACT.alternatePhone}
              </a>
              <a
                href={CONTACT.mapShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{CONTACT.address}</span>
              </a>
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
          <div className="flex items-center gap-4 mr-14 sm:mr-16">
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

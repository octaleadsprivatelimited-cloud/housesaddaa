import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
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
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Sitemap', href: '/sitemap' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">H</span>
              </div>
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
              <a href="tel:+919876543210" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Properties</h3>
            <ul className="space-y-2">
              {footerLinks.properties.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Top Cities</h3>
            <ul className="space-y-2">
              {footerLinks.cities.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Houses Adda. All rights reserved.
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

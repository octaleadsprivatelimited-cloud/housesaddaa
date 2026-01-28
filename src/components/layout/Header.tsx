import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ChevronDown, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Buy', href: '/properties?type=sale' },
  { name: 'Rent', href: '/properties?type=rent' },
  { name: 'Commercial', href: '/properties?propertyType=commercial' },
  { name: 'New Projects', href: '/properties?status=under-construction' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1.5">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="mailto:info@housesadda.in" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">info@housesadda.in</span>
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+91 98765 43210</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <User className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-foreground leading-tight">Houses Adda</span>
              <span className="text-xs text-muted-foreground leading-tight">Find Your Dream Home</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors animated-underline"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button variant="accent" size="sm" asChild>
              <Link to="/contact">Post Property FREE</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-96 border-t border-border' : 'max-h-0'
        )}
      >
        <div className="container-custom py-4 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block py-2 text-foreground/80 hover:text-primary font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 space-y-3 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button variant="accent" className="w-full" asChild>
              <Link to="/contact">Post Property FREE</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

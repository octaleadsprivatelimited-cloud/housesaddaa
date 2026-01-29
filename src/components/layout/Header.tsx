import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Buy', href: '/properties?type=sale' },
  { name: 'Rent', href: '/properties?type=rent' },
  { name: 'New Projects', href: '/properties?status=under-construction' },
  { name: 'Plot', href: '/properties?propertyType=plot' },
  { name: 'Commercial', href: '/properties?propertyType=commercial' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar - Red background */}
      <div className="bg-primary py-1.5 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 bg-white border border-white/20 rounded-lg px-3 py-1.5 shadow-sm">
            <img 
              src="/logo.png" 
              alt="Houses Adda Logo" 
              className="h-8 w-auto"
            />
            <span className="font-display text-lg font-bold text-primary">Houses Adda</span>
          </Link>

          {/* Phone Number */}
          <a 
            href="tel:+916301575658" 
            className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="font-medium text-sm">+91 63015 75658</span>
          </a>
        </div>
      </div>

      {/* Navigation bar - Red background */}
      <nav className="relative bg-primary border-b border-primary/20">
        <div className="container-custom">
          {/* Mobile: Single line with logo, phone, and menu */}
          <div className="md:hidden flex items-center justify-between py-2">
            {/* Logo - Smaller on mobile */}
            <Link to="/" className="flex items-center gap-1.5 bg-white border border-white/20 rounded-md px-2 py-1 shadow-sm">
              <img 
                src="/logo.png" 
                alt="Houses Adda Logo" 
                className="h-6 w-auto"
              />
              <span className="font-display text-xs font-bold text-primary">Houses Adda</span>
            </Link>

            {/* Phone Number - Smaller on mobile */}
            <a 
              href="tel:+916301575658" 
              className="flex items-center gap-1 text-primary-foreground hover:opacity-80 transition-opacity bg-primary/10 rounded-md px-2 py-1"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="font-medium text-xs">+91 63015 75658</span>
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              className="p-2 text-primary-foreground hover:bg-primary/20 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between h-10">
            <div className="flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-primary-foreground hover:text-primary-foreground/80 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-primary border-b border-primary/20 overflow-hidden transition-all duration-300 ease-in-out z-50',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="container-custom py-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block py-2 text-primary-foreground hover:text-primary-foreground/80 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;

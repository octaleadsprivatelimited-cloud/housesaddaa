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
      <div className="bg-primary py-1.5">
        <div className="container-custom flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Houses Adda Logo" 
              className="h-8 w-auto"
            />
            <span className="font-display text-lg font-bold text-primary-foreground">Houses Adda</span>
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

      {/* Navigation bar - White background */}
      <nav className="relative bg-card border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-10">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground hover:text-primary font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
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
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-card border-b border-border overflow-hidden transition-all duration-300 ease-in-out z-50',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="container-custom py-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block py-2 text-foreground hover:text-primary font-medium transition-colors"
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

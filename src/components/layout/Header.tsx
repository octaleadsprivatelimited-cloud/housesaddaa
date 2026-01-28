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
      <div className="bg-primary py-3">
        <div className="container-custom flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Houses Adda Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Phone Number */}
          <a 
            href="tel:+916301575658" 
            className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            <span className="font-medium">+91 63015 75658</span>
          </a>
        </div>
      </div>

      {/* Navigation bar - White background */}
      <nav className="bg-card border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-12">
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
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-card',
          mobileMenuOpen ? 'max-h-96 border-b border-border' : 'max-h-0'
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

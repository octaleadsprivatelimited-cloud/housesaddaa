import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNav = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Properties', href: '/properties' },
  {
    name: 'Services',
    href: '/services',
    children: [
      { name: 'Home Loans', href: '/services/home-loans' },
      { name: 'Interior Design', href: '/services/interior-design' },
      { name: 'Property Promotions', href: '/services/property-promotions' },
    ],
  },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/contact' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative font-medium transition-colors py-2',
    'hover:text-[#E10600]',
    isActive ? 'text-[#E10600]' : 'text-[#1A1A1A]',
    'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#E10600] after:transition-all after:duration-300',
    'hover:after:w-full',
    isActive && 'after:w-full'
  );

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isServicesActive = location.pathname.startsWith('/services');

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-[#B11226] text-white">
        <div className="container-custom">
          <div className="hidden md:flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+916301575658" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Phone className="h-4 w-4" />
                <span>+91 63015 75658</span>
              </a>
              <a href="mailto:info@housesadda.in" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Mail className="h-4 w-4" />
                <span>info@housesadda.in</span>
              </a>
            </div>
            <p className="font-medium">Your Trusted Property Consultant in Hyderabad</p>
          </div>
          <div className="md:hidden flex items-center justify-between py-2 text-xs">
            <a href="tel:+916301575658" className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              <span>+91 63015 75658</span>
            </a>
            <span className="text-white/90">Trusted Property Consultant</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 block">
            <img src="/logo.png" alt="Houses Adda" className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg" />
          </Link>

          <div className="hidden md:flex flex-1 justify-end">
            <nav className="flex items-center gap-8">
              {mainNav.map((item) =>
                item.children ? (
                  <div key={item.name} ref={dropdownRef} className="relative">
                    <button
                      onMouseEnter={() => setServicesOpen(true)}
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className={cn(
                        'flex items-center gap-1 font-medium transition-colors py-2',
                        'hover:text-[#E10600]',
                        isServicesActive ? 'text-[#E10600]' : 'text-[#1A1A1A]',
                        'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#E10600] after:transition-all after:duration-300',
                        'hover:after:w-full',
                        isServicesActive && 'after:w-full'
                      )}
                    >
                      {item.name}
                      <ChevronDown className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} />
                    </button>
                    <div
                      onMouseLeave={() => setServicesOpen(false)}
                      className={cn(
                        'absolute top-full left-0 mt-0 py-2 min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100',
                        'transition-all duration-200',
                        servicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                      )}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2.5 text-[#1A1A1A] hover:bg-[#FADADD] hover:text-[#E10600] rounded-lg mx-1 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink key={item.name} to={item.href} className={navLinkClass}>
                    {item.name}
                  </NavLink>
                )
              )}
            </nav>
            <a
              href="tel:+916301575658"
              className="ml-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#B11226] text-white font-semibold transition-colors shrink-0"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:+916301575658"
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#E10600] hover:bg-[#B11226] text-white text-sm font-semibold"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <button
              type="button"
              className="p-2 text-[#1A1A1A] hover:bg-[#F9F9F9] rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden bg-white border-t border-[#E5E5E5] overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'
        )}
      >
        <nav className="container-custom py-4 space-y-1">
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.name}>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full py-3 font-medium text-[#1A1A1A] hover:text-[#E10600]"
                >
                  {item.name}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', mobileServicesOpen && 'rotate-180')} />
                </button>
                <div className={cn('overflow-hidden transition-all', mobileServicesOpen ? 'max-h-40' : 'max-h-0')}>
                  <div className="pl-4 pb-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block py-2 text-[#6B6B6B] hover:text-[#E10600] font-medium"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block py-3 font-medium transition-colors',
                  location.pathname === item.href ? 'text-[#E10600]' : 'text-[#1A1A1A] hover:text-[#E10600]'
                )}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

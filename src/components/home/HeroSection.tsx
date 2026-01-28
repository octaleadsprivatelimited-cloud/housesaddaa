import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { locations, propertyTypes } from '@/data/properties';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (listingType) params.set('type', listingType);
    if (city) params.set('city', city);
    if (propertyType) params.set('propertyType', propertyType);
    if (searchQuery) params.set('q', searchQuery);
    navigate(`/properties?${params.toString()}`);
  };

  const cities = locations.map((loc) => loc.city);

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Modern luxury apartment" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-accent/30">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-accent font-medium text-sm">India's Trusted Property Portal</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
            Find Your Perfect
            <span className="block text-accent">Dream Home</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-xl">
            Discover apartments, villas, plots and commercial spaces across India's top cities. Your dream property is just a search away.
          </p>

          {/* Search Box */}
          <div className="search-container max-w-2xl">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setListingType('sale')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  listingType === 'sale'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setListingType('rent')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  listingType === 'rent'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Rent
              </button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* City Select */}
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-12 bg-background border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select City" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {cities.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Property Type Select */}
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 bg-background border-border">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Property Type" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Input */}
              <Input
                type="text"
                placeholder="Search locality, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-background border-border"
              />

              {/* Search Button */}
              <Button 
                variant="accent" 
                size="lg" 
                className="h-12"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            <div>
              <div className="text-3xl font-bold text-primary-foreground">50K+</div>
              <div className="text-primary-foreground/60 text-sm">Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">10K+</div>
              <div className="text-primary-foreground/60 text-sm">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">100+</div>
              <div className="text-primary-foreground/60 text-sm">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

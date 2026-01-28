import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { propertyTypes } from '@/data/properties';
import { useLocations } from '@/hooks/useLocations';
import heroBg from '@/assets/hero-bg.jpg';

const listingTabs = [
  { id: 'sale', label: 'Buy' },
  { id: 'rent', label: 'Rent' },
  { id: 'lease', label: 'Lease' },
  { id: 'pg', label: 'PG' },
];

const budgetOptions = [
  { value: 'any', label: 'Any Budget' },
  { value: '0-2500000', label: 'Under ₹25 Lakh' },
  { value: '2500000-5000000', label: '₹25 Lakh - ₹50 Lakh' },
  { value: '5000000-10000000', label: '₹50 Lakh - ₹1 Cr' },
  { value: '10000000-25000000', label: '₹1 Cr - ₹2.5 Cr' },
  { value: '25000000+', label: 'Above ₹2.5 Cr' },
];

export function HeroSection() {
  const navigate = useNavigate();
  const { allAreas, loading: locationsLoading } = useLocations();
  const [listingType, setListingType] = useState<string>('sale');
  const [area, setArea] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (listingType) params.set('type', listingType);
    if (area && area !== 'all') params.set('area', area);
    if (propertyType && propertyType !== 'all') params.set('propertyType', propertyType);
    if (budget && budget !== 'any') params.set('budget', budget);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Modern luxury property" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      {/* Centered Search Box */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        {/* Listing Type Tabs */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-card/95 backdrop-blur-sm rounded-full p-1 shadow-lg">
            {listingTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setListingType(tab.id)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  listingType === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Area Select */}
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="h-14 bg-background border-border">
                <div className="flex flex-col items-start w-full">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Area
                  </span>
                  <SelectValue placeholder="All Areas" className="text-sm font-medium" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-60">
                <SelectItem value="all">All Areas</SelectItem>
                {locationsLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  allAreas.map((areaName) => (
                    <SelectItem key={areaName} value={areaName}>
                      {areaName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Property Type Select */}
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-14 bg-background border-border">
                <div className="flex flex-col items-start w-full">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Property Type
                  </span>
                  <SelectValue placeholder="All Types" className="text-sm font-medium" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Budget Select */}
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="h-14 bg-background border-border">
                <div className="flex flex-col items-start w-full">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" />
                    Budget
                  </span>
                  <SelectValue placeholder="Any Budget" className="text-sm font-medium" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {budgetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button 
              variant="default" 
              size="lg" 
              className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

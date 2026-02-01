import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { propertyTypes } from '@/data/properties';
import { useLocations } from '@/hooks/useLocations';
import heroBg from '@/assets/hero-bg.jpg';

const budgetOptions = [
  { value: 'any', label: '₹ Any Budget' },
  { value: '0-2500000', label: 'Under ₹25 Lakh' },
  { value: '2500000-5000000', label: '₹25 Lakh - ₹50 Lakh' },
  { value: '5000000-10000000', label: '₹50 Lakh - ₹1 Cr' },
  { value: '10000000-25000000', label: '₹1 Cr - ₹2.5 Cr' },
  { value: '25000000+', label: 'Above ₹2.5 Cr' },
];

const heroSlides: { title: string; subtitle: string; image: string }[] = [
  {
    title: 'Premium Apartments in Hitech City',
    subtitle: 'Modern living spaces close to IT hubs',
    image: heroBg,
  },
  {
    title: 'Luxury Villas in Jubilee Hills',
    subtitle: 'Exclusive residential properties',
    image: '/featured-properties-bg.jpg',
  },
  {
    title: 'Plots & Land in Financial District',
    subtitle: 'Prime investment opportunities',
    image: '/independent-house-section-bg.jpg',
  },
];

export function HeroSection() {
  const navigate = useNavigate();
  const { allAreas, loading: locationsLoading } = useLocations();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location && location !== 'all') params.set('area', location);
    if (propertyType && propertyType !== 'all') params.set('propertyType', propertyType);
    if (budget && budget !== 'any') params.set('budget', budget);
    navigate(`/properties?${params.toString()}`);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative min-h-[420px] md:min-h-[480px] flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Slider Arrows - at edges */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-transparent hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-transparent hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Content */}
      <div className="relative z-10 w-full container-custom flex-1 flex flex-col pt-16 md:pt-24 pb-8 md:pb-12">
        {/* Hero Text + Search Bar - grouped together, pushed down */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Title - left aligned */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              {slide.subtitle}
            </p>
          </div>

          {/* Search Card - directly below title, smaller */}
          <div className="bg-white/95 rounded-xl shadow-lg p-3 md:p-4 w-full max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Select value={location || 'all'} onValueChange={setLocation}>
                <SelectTrigger className="h-10 rounded-lg border-[#E5E5E5] bg-[#F5F5F5] text-sm">
                  <MapPin className="h-3.5 w-3.5 text-[#6B6B6B] shrink-0" />
                  <SelectValue placeholder="Enter location..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Enter location...</SelectItem>
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

              <Select value={propertyType || 'all'} onValueChange={setPropertyType}>
                <SelectTrigger className="h-10 rounded-lg border-[#E5E5E5] bg-[#F5F5F5] text-sm">
                  <Home className="h-3.5 w-3.5 text-[#6B6B6B] shrink-0 mr-1.5" />
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={budget || 'any'} onValueChange={setBudget}>
                <SelectTrigger className="h-10 rounded-lg border-[#E5E5E5] bg-[#F5F5F5] text-sm">
                  <IndianRupee className="h-3.5 w-3.5 text-[#6B6B6B] shrink-0" />
                  <SelectValue placeholder="Any Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                onClick={handleSearch}
                className="h-10 px-4 rounded-lg bg-[#E10600] hover:bg-[#B11226] text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Spacer to push dots to bottom */}
        <div className="flex-1 min-h-4" />

        <div className="flex justify-center gap-2 mt-6">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`
                w-2.5 h-2.5 rounded-full transition-colors
                ${i === currentSlide ? 'bg-[#E10600] w-8' : 'bg-white/60 hover:bg-white/80'}
              `}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

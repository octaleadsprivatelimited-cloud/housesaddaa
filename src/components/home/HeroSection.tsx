import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <section className="relative min-h-[560px] md:min-h-[640px] flex items-end md:items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Slider Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-lg transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-lg transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* Content + Search Card */}
      <div className="relative z-10 w-full container-custom pb-8 md:pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Left: Hero Text */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              {slide.subtitle}
            </p>
          </div>

          {/* Right: Floating Search Card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select value={location || 'all'} onValueChange={setLocation}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Location</SelectItem>
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
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
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
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <SelectValue placeholder="₹ Any Budget" />
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
                className="h-12 px-6 rounded-xl bg-brand-primary hover:bg-brand-dark text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="flex justify-center gap-2 mt-6 md:mt-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`
                w-2.5 h-2.5 rounded-full transition-colors
                ${i === currentSlide ? 'bg-brand-primary w-8' : 'bg-white/60 hover:bg-white/80'}
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

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Building2 } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Property } from '@/types/property';
import { getFeaturedProperties } from '@/services/propertyService';

export function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll carousel every 4 seconds (short delay so Embla is ready after slides render)
  useEffect(() => {
    if (!emblaApi || properties.length === 0) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => emblaApi.scrollNext(), 4000);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [emblaApi, properties.length]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const featured = await getFeaturedProperties(12);
        setProperties(featured);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#F5F5F5]">
      <div className="container-custom">
        {/* Section Header: Title left, Arrows right */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-1">
              Featured Properties
            </h2>
            <p className="text-[#6B6B6B] text-sm md:text-base">
              Handpicked properties for discerning buyers
            </p>
          </div>
          {!loading && properties.length > 0 && (
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Property Cards Slider - one card per slide */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-[#E10600]" />
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[16px]">
              <Building2 className="h-16 w-16 text-[#6B6B6B]/50 mb-4" />
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No Featured Listings</h3>
              <p className="text-[#6B6B6B] mb-4 max-w-md">
                No featured properties yet. Browse our full listings.
              </p>
              <a
                href="/properties"
                className="px-6 py-2 rounded-xl bg-[#E10600] hover:bg-[#B11226] text-white font-medium inline-block"
              >
                Browse Properties
              </a>
            </div>
          ) : (
            <>
              <div className="overflow-hidden px-1" ref={emblaRef}>
                <div className="flex gap-6 -ml-6">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="flex-[0_0_100%] min-w-0 pl-6"
                    >
                      <div className="h-full max-w-4xl mx-auto">
                        <PropertyCard property={property} variant="featured" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Carousel dots */}
              {properties.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {properties.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => emblaApi?.scrollTo(index)}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        index === selectedIndex
                          ? 'bg-[#E10600] w-8'
                          : 'bg-[#E5E5E5] w-2 hover:bg-[#ccc]'
                      }`}
                      aria-label={`Go to property ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedListings;

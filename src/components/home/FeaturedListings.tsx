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
    align: 'start',
    loop: false,
    containScroll: 'trimSnaps',
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
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
              Premium Properties
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

        {/* Property Cards Slider */}
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
                Browse All Properties
              </a>
            </div>
          ) : (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 gap-0">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4"
                  >
                    <PropertyCard property={property} variant="premium" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedListings;

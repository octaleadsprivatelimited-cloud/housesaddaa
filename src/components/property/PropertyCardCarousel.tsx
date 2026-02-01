import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard';
import { cn } from '@/lib/utils';

interface PropertyCardCarouselProps {
  properties: Property[];
  variant?: 'default' | 'compact';
  className?: string;
}

export function PropertyCardCarousel({ properties, variant = 'default', className }: PropertyCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: false,
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 1024px)': { slidesToScroll: 1 },
      '(min-width: 768px)': { slidesToScroll: 1 },
    },
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setScrollSnaps(emblaApi.scrollSnapList());
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

  if (!properties.length) return null;

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 gap-0">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4"
            >
              <PropertyCard property={property} variant={variant} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#1A1A1A] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#1A1A1A] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      {scrollSnaps.length > 1 && (
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all',
              index === selectedIndex ? 'bg-[#E10600] w-6' : 'bg-gray-300 hover:bg-gray-400',
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      )}
    </div>
  );
}

export default PropertyCardCarousel;

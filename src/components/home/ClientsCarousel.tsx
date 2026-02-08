import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPartnersByType } from '@/services/partnerService';
import { Partner } from '@/types/property';

export function ClientsCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
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
    getPartnersByType('company')
      .then(setPartners)
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-20 bg-[#F9F9F9]" aria-labelledby="trusted-brands-heading">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[#E10600] text-sm font-semibold uppercase tracking-widest mb-3">
            Our Partners
          </p>
          <h2 id="trusted-brands-heading" className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
            Trusted by Leading Brands
          </h2>
          <p className="text-[#6B6B6B]">
            Our partners who trust Houses Adda for property solutions
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 rounded-full border-2 border-[#E10600] border-t-transparent animate-spin" />
          </div>
        ) : partners.length === 0 ? (
          <p className="text-center text-[#6B6B6B] py-8">Add partner logos from Admin → Partners (Companies).</p>
        ) : partners.length === 1 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-[140px]">
              <PartnerLogoCard partner={partners[0]} />
            </div>
          </div>
        ) : (
          <div className="relative flex items-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#E5E5E5] shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#E10600] hover:text-white hover:border-[#E10600] disabled:opacity-40 disabled:pointer-events-none transition-colors -translate-x-2 md:-translate-x-4"
              aria-label="Previous partners"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-hidden px-1" ref={emblaRef}>
              <div className="flex -ml-3 gap-0">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex-[0_0_40%] sm:flex-[0_0_28%] md:flex-[0_0_22%] lg:flex-[0_0_18%] xl:flex-[0_0_15%] min-w-0 pl-3"
                  >
                    <PartnerLogoCard partner={partner} />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#E5E5E5] shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#E10600] hover:text-white hover:border-[#E10600] disabled:opacity-40 disabled:pointer-events-none transition-colors translate-x-2 md:translate-x-4"
              aria-label="Next partners"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <div className="h-px w-24 bg-[#E10600]/30 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function PartnerLogoCard({ partner }: { partner: Partner }) {
  const [error, setError] = useState(false);

  return (
    <div className="aspect-square w-full max-w-[140px] mx-auto bg-white rounded-xl p-3 md:p-4 flex flex-col items-center justify-center border border-[#E5E5E5] hover:border-[#E10600]/30 hover:shadow-lg hover:shadow-[#E10600]/5 transition-all duration-300 group">
      {!error ? (
        <img
          src={partner.imageUrl}
          alt={partner.title}
          className="max-h-[56px] md:max-h-[64px] max-w-full w-auto h-auto object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-[#1A1A1A] font-bold text-xs md:text-sm tracking-tight text-center line-clamp-2">
          {partner.title}
        </span>
      )}
    </div>
  );
}

export default ClientsCarousel;

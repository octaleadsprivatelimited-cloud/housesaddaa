import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
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
  });

  useEffect(() => {
    getPartnersByType('company')
      .then(setPartners)
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 3500);
    return () => clearInterval(interval);
  }, [emblaApi]);

  if (loading || partners.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[#F9F9F9]" aria-labelledby="trusted-brands-heading">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[#E10600] text-sm font-semibold uppercase tracking-widest mb-3">
            Our Partners
          </p>
          <h2 id="trusted-brands-heading" className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
            Trusted by Leading Brands
          </h2>
          <p className="text-[#6B6B6B]">
            Banks and developers who trust Houses Adda for property solutions
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 gap-0">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 pl-4"
                >
                  <PartnerLogoCard partner={partner} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="h-px w-24 bg-[#E10600]/30 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function PartnerLogoCard({ partner }: { partner: Partner }) {
  const [error, setError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center h-28 md:h-36 border border-[#E5E5E5] hover:border-[#E10600]/30 hover:shadow-xl hover:shadow-[#E10600]/5 transition-all duration-300">
      {!error ? (
        <img
          src={partner.imageUrl}
          alt={partner.title}
          className="max-h-14 md:max-h-16 w-auto object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-[#1A1A1A] font-bold text-base md:text-lg tracking-tight text-center">
          {partner.title}
        </span>
      )}
    </div>
  );
}

export default ClientsCarousel;

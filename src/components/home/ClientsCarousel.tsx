import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const clients = [
  { name: 'HDFC Bank', initial: 'HDFC' },
  { name: 'ICICI Bank', initial: 'ICICI' },
  { name: 'State Bank of India', initial: 'SBI' },
  { name: 'Axis Bank', initial: 'Axis' },
  { name: 'Kotak Mahindra', initial: 'Kotak' },
  { name: 'L&T Realty', initial: 'L&T' },
  { name: 'DLF', initial: 'DLF' },
  { name: 'Prestige Group', initial: 'PG' },
];

export function ClientsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  // Auto-play: scroll every 3 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-12 md:py-16 bg-white border-t border-[#E5E5E5]">
      <div className="container-custom">
        <h2 className="text-center text-xl md:text-2xl font-bold text-[#1A1A1A] mb-8">
          Trusted by Leading Brands
        </h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 gap-0">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 pl-4"
                >
                  <div className="bg-[#F9F9F9] rounded-xl p-6 flex items-center justify-center h-24 border border-[#E5E5E5] hover:border-[#E10600]/30 hover:bg-[#FADADD]/30 transition-colors group">
                    <span className="text-[#6B6B6B] font-semibold text-sm md:text-base group-hover:text-[#E10600] transition-colors">
                      {client.initial}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientsCarousel;

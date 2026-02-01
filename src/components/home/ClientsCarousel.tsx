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
  { name: 'Prestige Group', initial: 'Prestige' },
];

export function ClientsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 3500);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-16 md:py-20 bg-[#F9F9F9]" aria-labelledby="trusted-brands-heading">
      <div className="container-custom">
        {/* Section Header */}
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

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 gap-0">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 pl-4"
                >
                  <div className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center h-28 md:h-32 border border-[#E5E5E5] hover:border-[#E10600]/30 hover:shadow-xl hover:shadow-[#E10600]/5 transition-all duration-300">
                    <span className="text-[#1A1A1A] font-bold text-base md:text-lg tracking-tight group-hover:text-[#E10600] transition-colors">
                      {client.initial}
                    </span>
                    <span className="text-[#6B6B6B] text-xs mt-1 opacity-70 group-hover:opacity-100 group-hover:text-[#E10600] transition-all">
                      {client.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional decorative line */}
        <div className="mt-12 flex justify-center">
          <div className="h-px w-24 bg-[#E10600]/30 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export default ClientsCarousel;

import SEO from '@/components/SEO';
import { EnquiryForm } from '@/components/EnquiryForm';

export default function ContactForm() {
  return (
    <>
      <SEO
        title="Share your requirement | Houses Adda"
        description="Share your requirement. Buy, sell or rent property—Flats, Villas, Independent houses, Open plots, Commercial space. We'll respond within 24 hours."
        url="/contact-form"
      />
      <div className="min-h-screen bg-[#F8F8F8]">
        <section className="relative min-h-[200px] md:min-h-[240px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/featured-properties-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="container-custom relative z-10 py-10 md:py-14 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm">
              Houses Adda
            </h1>
            <p className="text-white/90 text-base md:text-lg mt-2 max-w-xl mx-auto">
              Buy, sell or rent Independent houses, Villas, Commercial Lands, Apartments, Open plots, Flats and more.
            </p>
          </div>
        </section>

        <section className="container-custom py-8 md:py-12">
          <div className="max-w-xl mx-auto">
            <EnquiryForm formTitle="Share your requirement" showContactLink={true} />
          </div>
        </section>
      </div>
    </>
  );
}

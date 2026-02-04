import { Mail, Phone, MapPin, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import SEO from '@/components/SEO';

const CONTACT = {
  phone: '+91 63015 75658',
  phoneRaw: '+916301575658',
  email: 'info@housesadda.in',
  address: '8-1-284-/ou/25, OU Colony, Shaikpet, Manikonda, Hyderabad, Telangana 500104',
  whatsapp: 'https://wa.me/916301575658?text=Hi%2C%20I%27m%20interested%20in%20your%20properties.',
  mapEmbed: 'https://maps.google.com/maps?q=Manikonda%2C%20Hyderabad%2C%20Telangana&t=&z=14&ie=UTF8&iwloc=&output=embed',
  mapShareUrl: 'https://share.google/NbiaLYRH0pWGMqgzD',
  googleFormUrl: 'https://forms.gle/s6geV6PwxQDvhMdb9',
};

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us | Houses Adda"
        description="Get in touch with Houses Adda. Contact our team for property inquiries, support, or any questions. We're here to help you find your dream property."
        url="/contact"
      />
      <div className="min-h-screen bg-[#F8F8F8]">
        {/* Hero - background image with overlay */}
        <section className="relative min-h-[220px] md:min-h-[280px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/featured-properties-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="container-custom relative z-10 py-12 md:py-16 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-sm">
              Contact Us
            </h1>
            <p className="text-white/90 text-base md:text-lg mt-2 max-w-xl mx-auto">
              Share your requirements—buy, sell, or rent. We'll get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact cards - 4 in a row */}
        <section className="container-custom py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <a
              href={`tel:${CONTACT.phoneRaw.replace(/\s/g, '')}`}
              className="bg-white rounded-lg p-5 shadow-sm border border-[#EEE] hover:border-[#E10600]/30 hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-[#E10600]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#888] uppercase tracking-wide font-medium">Phone</p>
                <p className="font-semibold text-[#1A1A1A] mt-0.5">{CONTACT.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="bg-white rounded-lg p-5 shadow-sm border border-[#EEE] hover:border-[#E10600]/30 hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-[#E10600]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#888] uppercase tracking-wide font-medium">Email</p>
                <p className="font-semibold text-[#1A1A1A] text-sm mt-0.5 truncate">{CONTACT.email}</p>
              </div>
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-5 shadow-sm border border-[#EEE] hover:border-[#25D366]/50 hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-[#16A34A]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#888] uppercase tracking-wide font-medium">WhatsApp</p>
                <p className="font-semibold text-[#1A1A1A] mt-0.5">Chat with us</p>
              </div>
            </a>
            <a
              href={CONTACT.mapShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-5 shadow-sm border border-[#EEE] hover:border-[#E10600]/30 hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-[#E10600]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#888] uppercase tracking-wide font-medium">Office</p>
                <p className="font-semibold text-[#1A1A1A] text-sm mt-0.5">Hyderabad · Get directions</p>
              </div>
            </a>
          </div>
        </section>

        {/* Form + Sidebar - balanced two columns */}
        <section className="container-custom pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Form - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-[#EEE] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#EEE]">
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Submit your requirements</h2>
                  <p className="text-[#666] text-sm mt-1">
                    Fill the form below with your name, contact, property type, budget and location.
                  </p>
                  <a
                    href={CONTACT.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#E10600] font-medium hover:underline"
                  >
                    Open in new tab
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="bg-[#FAFAFA] p-2 md:p-4">
                  <iframe
                    src={CONTACT.googleFormUrl}
                    title="Houses Adda Contact Form"
                    width="100%"
                    height="550"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="w-full border-0 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#EEE]">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[#1A1A1A]">Quick response</h3>
                    <p className="text-[#666] text-sm mt-1">
                      We typically reply within 24 hours on working days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#EEE]">
                <div className="h-48 md:h-56 bg-[#F0F0F0]">
                  <iframe
                    title="Houses Adda office"
                    src={CONTACT.mapEmbed}
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-4 border-t border-[#EEE]">
                  <h3 className="font-bold text-[#1A1A1A] text-sm">Visit us</h3>
                  <p className="text-[#666] text-sm mt-1 leading-relaxed">{CONTACT.address}</p>
                  <a
                    href={CONTACT.mapShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#E10600] font-medium hover:underline"
                  >
                    Get directions on Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

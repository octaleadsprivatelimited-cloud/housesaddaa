import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { CONTACT } from '@/constants/contact';

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us | Houses Adda"
        description="Get in touch with Houses Adda. Office address, phone numbers, email, and map."
        url="/contact"
      />
      <div className="min-h-screen bg-[#F8F8F8]">
        <section className="relative min-h-[200px] md:min-h-[240px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/featured-properties-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="container-custom relative z-10 py-10 md:py-14 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Contact Us</h1>
            <p className="text-white/90 text-base mt-2">We're here to help.</p>
          </div>
        </section>

        <section className="container-custom py-8 md:py-12 pb-16">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Row 1: Mail, Contact number, Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <Mail className="h-6 w-6 text-[#E10600] mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Mail ID</h3>
                <a href={`mailto:${CONTACT.email}`} className="text-gray-600 text-sm hover:text-[#E10600] break-all">
                  {CONTACT.email}
                </a>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <Phone className="h-6 w-6 text-[#E10600] mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Contact Number</h3>
                <a href={`tel:${CONTACT.phoneRaw}`} className="text-gray-600 text-sm block hover:text-[#E10600]">
                  {CONTACT.phone}
                </a>
                <a href={`tel:${CONTACT.alternatePhoneRaw}`} className="text-gray-600 text-sm block hover:text-[#E10600]">
                  {CONTACT.alternatePhone}
                </a>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <MapPin className="h-6 w-6 text-[#E10600] mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{CONTACT.address}</p>
                <a
                  href={CONTACT.mapShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E10600] text-sm font-medium mt-2 inline-flex items-center gap-1 hover:underline"
                >
                  Directions <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Row 2: Location map */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#E10600]" />
                  Location
                </h3>
                <a
                  href={CONTACT.mapShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E10600] text-sm font-medium hover:underline"
                >
                  Open in Google Maps <ExternalLink className="h-3.5 w-3.5 inline" />
                </a>
              </div>
              <div className="h-64 md:h-80">
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
              <div className="px-5 py-2 border-t border-gray-200 text-gray-500 text-sm">
                Houses Adda, Hyderabad
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button asChild className="w-full sm:w-auto h-11 rounded-lg bg-[#E10600] hover:bg-[#B11226] font-semibold">
                <Link to="/contact-form">
                  Enquire Now / Get a Quote
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <div className="flex gap-2">
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-medium"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

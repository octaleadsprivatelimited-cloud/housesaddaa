import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SEO from '@/components/SEO';

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us | Houses Adda"
        description="Get in touch with Houses Adda. Contact our team for property inquiries, support, or any questions. We're here to help you find your dream property."
        url="/contact"
      />
      <div className="min-h-screen bg-[#F9F9F9]">
        <div className="container-custom py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Contact Us</h1>
              <p className="text-xl text-[#6B6B6B] max-w-2xl mx-auto">
                Get in touch with our team. We're here to help you find your dream property.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E5E5]">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Phone</h3>
                  <a href="tel:+916301575658" className="text-[#6B6B6B] hover:text-[#E10600] transition-colors">
                    +91 63015 75658
                  </a>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E5E5]">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Email</h3>
                  <a href="mailto:info@housesadda.in" className="text-[#6B6B6B] hover:text-[#E10600] transition-colors">
                    info@housesadda.in
                  </a>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E5E5]">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Address</h3>
                  <p className="text-[#6B6B6B]">
                    8-1-284-/ou/25, OU Colony, Shaikpet, Manikonda, Hyderabad, Telangana 500104
                  </p>
                </div>
                <a
                  href="https://wa.me/916301575658?text=Hi%2C%20I'm%20interested%20in%20your%20properties."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat with us on WhatsApp
                </a>
              </div>

              {/* Contact Form + Map */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Send us a Message</h2>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-[#1A1A1A]">Name</Label>
                        <Input id="name" placeholder="Your name" className="mt-2 rounded-xl border-[#E5E5E5]" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[#1A1A1A]">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" className="mt-2 rounded-xl border-[#E5E5E5]" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#1A1A1A]">Phone</Label>
                      <Input id="phone" type="tel" placeholder="+91 12345 67890" className="mt-2 rounded-xl border-[#E5E5E5]" />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-[#1A1A1A]">Message</Label>
                      <Textarea id="message" placeholder="Your message" rows={5} className="mt-2 rounded-xl border-[#E5E5E5]" />
                    </div>
                    <Button type="submit" className="w-full bg-[#E10600] hover:bg-[#B11226] rounded-xl">
                      Send Message
                    </Button>
                  </form>
                </div>

                {/* Google Map Embed */}
                <div className="rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-sm h-64 md:h-80">
                  <iframe
                    title="Houses Adda Location"
                    src="https://maps.google.com/maps?q=Manikonda%2C%20Hyderabad%2C%20Telangana&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

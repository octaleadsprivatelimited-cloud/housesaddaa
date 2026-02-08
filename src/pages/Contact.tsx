import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, ExternalLink, Send, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitEnquiry } from '@/services/enquiryService';
import { toast } from '@/components/ui/sonner';

const CONTACT = {
  phone: '+91 63015 75658',
  phoneRaw: '+916301575658',
  email: 'info@housesadda.in',
  address: '8-1-284-/ou/25, OU Colony, Shaikpet, Manikonda, Hyderabad, Telangana 500104',
  whatsapp: 'https://wa.me/916301575658?text=Hi%2C%20I%27m%20interested%20in%20your%20properties.',
  mapEmbed: 'https://maps.google.com/maps?q=Manikonda%2C%20Hyderabad%2C%20Telangana&t=&z=14&ie=UTF8&iwloc=&output=embed',
  mapShareUrl: 'https://share.google/NbiaLYRH0pWGMqgzD',
};

const INTENT_OPTIONS = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'take-a-rent', label: 'Take a Rent' },
  { value: 'give-for-rental', label: 'Give For a Rental' },
] as const;

const PROPERTY_TYPE_OPTIONS = [
  { value: 'flat', label: 'Flat' },
  { value: 'villa', label: 'Villa' },
  { value: 'independent-house', label: 'Independent House' },
  { value: 'open-plot', label: 'Open plot' },
  { value: 'commercial-space', label: 'Commercial Space' },
  { value: 'other', label: 'Other' },
] as const;

const BHK_OPTIONS = ['1', '2', '3', '4', '5'] as const;

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    intent: '',
    propertyType: '',
    bhk: '',
    budgetExpecting: '',
    propertyLocation: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, message, propertyLocation, budgetExpecting, propertyType, bhk, intent } = form;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error('Please fill in name, email and contact number.');
      return;
    }
    setSending(true);
    try {
      await submitEnquiry({
        propertyId: '',
        propertyTitle: '',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
        intent: intent || undefined,
        propertyType: propertyType || undefined,
        bhk: bhk || undefined,
        propertyLocation: propertyLocation.trim() || undefined,
        budgetExpecting: budgetExpecting.trim() || undefined,
      });
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({
        name: '',
        email: '',
        phone: '',
        intent: '',
        propertyType: '',
        bhk: '',
        budgetExpecting: '',
        propertyLocation: '',
        message: '',
      });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

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
                    Fill the form below with your name, contact, property type, budget and location. Responses are sent to our team and visible in the admin panel.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-[#1A1A1A]">1. Name</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="h-11 rounded-lg border-[#E5E5E5]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-[#1A1A1A]">2. Email</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="h-11 rounded-lg border-[#E5E5E5]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-[#1A1A1A]">3. Contact no</Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 12345 67890"
                      className="h-11 rounded-lg border-[#E5E5E5]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1A1A1A]">4. Would you like to Buy / Sell / Rent a Property</Label>
                    <Select value={form.intent} onValueChange={(v) => setForm((p) => ({ ...p, intent: v }))}>
                      <SelectTrigger className="h-11 rounded-lg border-[#E5E5E5]">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {INTENT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1A1A1A]">5. Type of Property</Label>
                    <Select value={form.propertyType} onValueChange={(v) => setForm((p) => ({ ...p, propertyType: v }))}>
                      <SelectTrigger className="h-11 rounded-lg border-[#E5E5E5]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1A1A1A]">6. Type of Flat / Villa / Independent house</Label>
                    <Select value={form.bhk} onValueChange={(v) => setForm((p) => ({ ...p, bhk: v }))}>
                      <SelectTrigger className="h-11 rounded-lg border-[#E5E5E5]">
                        <SelectValue placeholder="Select BHK" />
                      </SelectTrigger>
                      <SelectContent>
                        {BHK_OPTIONS.map((val) => (
                          <SelectItem key={val} value={val}>
                            {val} BHK
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-budget" className="text-[#1A1A1A]">7. Budget</Label>
                    <Input
                      id="contact-budget"
                      name="budgetExpecting"
                      value={form.budgetExpecting}
                      onChange={handleChange}
                      placeholder="e.g. ₹50 Lakh - ₹1 Cr"
                      className="h-11 rounded-lg border-[#E5E5E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-location" className="text-[#1A1A1A]">8. Location</Label>
                    <Input
                      id="contact-location"
                      name="propertyLocation"
                      value={form.propertyLocation}
                      onChange={handleChange}
                      placeholder="e.g. Jubilee Hills, Hyderabad"
                      className="h-11 rounded-lg border-[#E5E5E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-[#1A1A1A]">9. Queries (if you&apos;d like to ask any questions please mention here)</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your questions or additional details..."
                      rows={4}
                      className="rounded-lg border-[#E5E5E5] resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto mt-2 h-11 px-8 rounded-lg bg-[#E10600] hover:bg-[#B11226] font-semibold flex items-center justify-center gap-2"
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {sending ? 'Sending...' : 'Send message'}
                  </Button>
                </form>
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

import { useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Send, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONTACT } from '@/constants/contact';
import { submitEnquiry } from '@/services/enquiryService';
import { toast } from '@/components/ui/sonner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+()-]{10,16}$/;

const LOOKING_FOR_OPTIONS = [
  { value: '', label: 'Select an option' },
  { value: 'buy-properties', label: 'Buy properties' },
  { value: 'rent-properties', label: 'Rent Properties' },
  { value: 'home-loan', label: 'Home loan' },
  { value: 'interior-design', label: 'Interior design' },
  { value: 'property-promotion', label: 'Property promotion' },
];

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', lookingFor: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    if (!name) {
      toast.error('Please enter your name.');
      return;
    }
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!phone) {
      toast.error('Please enter your contact number.');
      return;
    }
    if (!PHONE_REGEX.test(phone.replace(/\s/g, '')) || phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid contact number (at least 10 digits).');
      return;
    }
    if (!message) {
      toast.error('Please enter your message.');
      return;
    }
    setSending(true);
    try {
      await submitEnquiry({
        propertyId: '',
        propertyTitle: '',
        name,
        email,
        phone,
        message,
        enquirySource: 'contact',
        ...(form.lookingFor && { propertyType: form.lookingFor }),
      });
      toast.success("We've received your message. We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', phone: '', message: '', lookingFor: '' });
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

            {/* Contact form */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Send a message</h2>
              <p className="text-[#6B6B6B] text-sm mb-6">Fill in the form below and we'll get back to you soon.</p>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-[#1A1A1A]">Name *</Label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className="h-11 rounded-lg border-[#E5E5E5]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-[#1A1A1A]">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="h-11 rounded-lg border-[#E5E5E5]"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="contact-phone" className="text-[#1A1A1A]">Phone *</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className="h-11 rounded-lg border-[#E5E5E5]"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-[#1A1A1A]">What are you looking for?</Label>
                  <Select
                    value={form.lookingFor}
                    onValueChange={(v) => setForm((p) => ({ ...p, lookingFor: v }))}
                  >
                    <SelectTrigger className="h-11 rounded-lg border-[#E5E5E5] bg-white">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOOKING_FOR_OPTIONS.filter((o) => o.value !== '').map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="contact-message" className="text-[#1A1A1A]">Message *</Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Your message..."
                    rows={4}
                    className="rounded-lg border-[#E5E5E5] resize-none"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={sending}
                    className="h-11 px-6 rounded-lg bg-[#E10600] hover:bg-[#B11226] font-semibold"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {sending ? 'Sending...' : 'Send message'}
                  </Button>
                </div>
              </form>
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
          </div>
        </section>
      </div>
    </>
  );
}

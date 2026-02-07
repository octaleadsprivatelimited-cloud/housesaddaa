import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitEnquiry } from '@/services/enquiryService';
import { toast } from '@/components/ui/sonner';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';

const PAGE_CONTENT: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Get in touch',
    description: 'Have a question or want to explore properties? Send us a message and we\'ll get back within 24 hours.',
  },
  '/about': {
    title: 'Reach out to us',
    description: 'We\'d love to hear from you. Whether it\'s about our story or your next property, drop us a line.',
  },
  '/properties': {
    title: 'Need help finding a property?',
    description: 'Tell us your requirements—budget, location, type—and our team will help you find the right match.',
  },
  '/gallery': {
    title: 'Questions about our gallery?',
    description: 'Want to schedule a visit or know more about a project? Send us a message.',
  },
  '/blog': {
    title: 'Have feedback or a topic idea?',
    description: 'We\'d love to hear your thoughts or suggestions for our blog.',
  },
  '/careers': {
    title: 'Apply or ask about careers',
    description: 'Interested in joining Houses Adda? Send your details and we\'ll get back to you.',
  },
  '/help': {
    title: 'Still need help?',
    description: 'Couldn\'t find what you were looking for? Send us a message and we\'ll assist you.',
  },
  '/sitemap': {
    title: 'Get in touch',
    description: 'Have a question? We\'re here to help.',
  },
  '/services/home-loans': {
    title: 'Need loan assistance?',
    description: 'Share your details and our experts will help you find the best home loan options.',
  },
  '/services/interior-design': {
    title: 'Discuss your interior project',
    description: 'Tell us your space and style—we\'ll get back with ideas and a consultation.',
  },
  '/services/property-promotions': {
    title: 'Promote your property',
    description: 'Interested in listing or promoting with us? Send your details and we\'ll reach out.',
  },
};

const DEFAULT_CONTENT = {
  title: 'Get in touch',
  description: 'Have a question? Send us a message and we\'ll get back to you within 24 hours.',
};

export function ContactFormSection() {
  const location = useLocation();
  const pathname = location.pathname;

  // Don't show on contact page (has its own form)
  if (pathname === '/contact') return null;

  const getContent = () => {
    if (PAGE_CONTENT[pathname]) return PAGE_CONTENT[pathname];
    if (pathname.startsWith('/property/')) {
      return { title: 'Interested in this property?', description: 'Send us your details and we\'ll get back with more information and scheduling.' };
    }
    return DEFAULT_CONTENT;
  };
  const content = getContent();
  const { propertyTypes } = usePropertyTypes();

  const isPromotionsPage = pathname === '/services/property-promotions';
  const isPropertiesPage = pathname === '/properties';
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyLocation: '',
    budgetExpecting: '',
    propertyType: '',
    bhk: '',
    pricingLooking: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, message, propertyLocation, budgetExpecting, propertyType, bhk, pricingLooking } = form;
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
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
        message: message.trim(),
        ...(isPromotionsPage && {
          propertyLocation: propertyLocation.trim() || undefined,
          budgetExpecting: budgetExpecting.trim() || undefined,
        }),
        ...(isPropertiesPage && {
          propertyType: propertyType.trim() || undefined,
          bhk: bhk || undefined,
          pricingLooking: pricingLooking.trim() || undefined,
        }),
      });
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', phone: '', message: '', propertyLocation: '', budgetExpecting: '', propertyType: '', bhk: '', pricingLooking: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-[#E10600]/5 border-t-2 border-[#E10600]/20">
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] text-center mb-2 relative inline-block w-full">
            {content.title}
            <span className="block mt-2 mx-auto w-16 h-1 rounded-full bg-[#E10600]" aria-hidden />
          </h2>
          <p className="text-[#6B6B6B] text-center mb-8">
            {content.description}
          </p>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border-2 border-[#E10600]/20 shadow-lg shadow-[#E10600]/5 p-6 md:p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="footer-name" className="text-[#1A1A1A]">Name</Label>
                <Input
                  id="footer-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="h-11 rounded-lg border-[#E5E5E5]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer-email" className="text-[#1A1A1A]">Email</Label>
                <Input
                  id="footer-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-11 rounded-lg border-[#E5E5E5]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="footer-phone" className="text-[#1A1A1A]">Phone</Label>
              <Input
                id="footer-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 12345 67890"
                className="h-11 rounded-lg border-[#E5E5E5]"
                required
              />
            </div>
            {isPromotionsPage && (
              <>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="footer-property-location" className="text-[#1A1A1A]">Property location</Label>
                  <Input
                    id="footer-property-location"
                    name="propertyLocation"
                    value={form.propertyLocation}
                    onChange={handleChange}
                    placeholder="e.g. Jubilee Hills, Hyderabad"
                    className="h-11 rounded-lg border-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="footer-budget-expecting" className="text-[#1A1A1A]">Budget expecting</Label>
                  <Input
                    id="footer-budget-expecting"
                    name="budgetExpecting"
                    value={form.budgetExpecting}
                    onChange={handleChange}
                    placeholder="e.g. ₹50 Lakh - ₹1 Cr"
                    className="h-11 rounded-lg border-[#E5E5E5]"
                  />
                </div>
              </>
            )}
            {isPropertiesPage && (
              <>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="footer-property-type" className="text-[#1A1A1A]">Type of property</Label>
                  <Select name="propertyType" value={form.propertyType} onValueChange={(v) => setForm((p) => ({ ...p, propertyType: v }))}>
                    <SelectTrigger id="footer-property-type" className="h-11 rounded-lg border-[#E5E5E5]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="footer-bhk" className="text-[#1A1A1A]">BHK</Label>
                  <Select name="bhk" value={form.bhk} onValueChange={(v) => setForm((p) => ({ ...p, bhk: v }))}>
                    <SelectTrigger id="footer-bhk" className="h-11 rounded-lg border-[#E5E5E5]">
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="4+">4+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="footer-pricing-looking" className="text-[#1A1A1A]">Pricing you're looking for</Label>
                  <Input
                    id="footer-pricing-looking"
                    name="pricingLooking"
                    value={form.pricingLooking}
                    onChange={handleChange}
                    placeholder="e.g. ₹50 Lakh - ₹1 Cr"
                    className="h-11 rounded-lg border-[#E5E5E5]"
                  />
                </div>
              </>
            )}
            <div className="space-y-2 mt-4">
              <Label htmlFor="footer-message" className="text-[#1A1A1A]">Message</Label>
              <Textarea
                id="footer-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={4}
                className="rounded-lg border-[#E5E5E5] resize-none"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={sending}
              className="w-full mt-6 h-11 rounded-lg bg-[#E10600] hover:bg-[#B11226] font-semibold flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span>{sending ? 'Sending...' : 'Send message'}</span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactFormSection;

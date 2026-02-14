import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Loader2, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitEnquiry } from '@/services/enquiryService';
import { toast } from '@/components/ui/sonner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+()-]{10,16}$/;

function validateEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}
function validatePhone(phone: string) {
  return PHONE_REGEX.test(phone.replace(/\s/g, '')) && phone.replace(/\D/g, '').length >= 10;
}

export function PropertyPromotionsEnquiryForm() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    location: '',
    propertyDetails: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!name) {
      toast.error('Please enter your name.');
      return;
    }
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!phone) {
      toast.error('Please enter your contact number.');
      return;
    }
    if (!validatePhone(phone)) {
      toast.error('Please enter a valid contact number (at least 10 digits).');
      return;
    }
    if (!form.location.trim()) {
      toast.error('Please enter location.');
      return;
    }
    if (!form.propertyDetails.trim()) {
      toast.error('Please enter property details.');
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
        message: form.message.trim() || '—',
        ...(form.alternatePhone.trim() && { alternatePhone: form.alternatePhone.trim() }),
        propertyLocation: form.location.trim(),
        propertyDetails: form.propertyDetails.trim(),
        enquirySource: 'property-promotions',
      });
      toast.success("We've received your enquiry. Our team will get back within 24 hours.");
      setForm({
        name: '',
        email: '',
        phone: '',
        alternatePhone: '',
        location: '',
        propertyDetails: '',
        message: '',
      });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="px-6 md:px-8 py-6 border-b border-[#E5E5E5] bg-[#FAFAFA]/80">
        <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#E10600]" />
          Property Promotion Enquiry
        </h2>
        <p className="text-[#6B6B6B] text-sm mt-1.5">Share your property details. We'll help you promote it to the right buyers.</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="pp-name" className="text-[#1A1A1A]">Name *</Label>
          <Input
            id="pp-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="h-11 rounded-lg border-[#E5E5E5]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pp-email" className="text-[#1A1A1A]">Email *</Label>
          <Input
            id="pp-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="h-11 rounded-lg border-[#E5E5E5]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pp-phone" className="text-[#1A1A1A]">Contact No. *</Label>
          <Input
            id="pp-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className="h-11 rounded-lg border-[#E5E5E5]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pp-alt-phone" className="text-[#1A1A1A]">Alternate Phone (optional)</Label>
          <Input
            id="pp-alt-phone"
            name="alternatePhone"
            type="tel"
            value={form.alternatePhone}
            onChange={handleChange}
            placeholder="Optional"
            className="h-11 rounded-lg border-[#E5E5E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pp-location" className="text-[#1A1A1A]">Location *</Label>
          <Input
            id="pp-location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="City or area of the property"
            className="h-11 rounded-lg border-[#E5E5E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pp-property-details" className="text-[#1A1A1A]">Property Details *</Label>
          <Textarea
            id="pp-property-details"
            name="propertyDetails"
            value={form.propertyDetails}
            onChange={handleChange}
            placeholder="e.g. 3 BHK apartment in Jubilee Hills, 1800 sqft, ready to move, expected price ₹1.2 Cr"
            rows={4}
            className="rounded-lg border-[#E5E5E5] resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pp-message" className="text-[#1A1A1A]">Additional message (optional)</Label>
          <Textarea
            id="pp-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Any specific promotion requirements or questions"
            rows={2}
            className="rounded-lg border-[#E5E5E5] resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={sending}
            className="flex-1 h-11 rounded-lg bg-[#E10600] hover:bg-[#B11226] font-semibold flex items-center justify-center gap-2"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {sending ? 'Sending...' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg border-[#E5E5E5]"
            onClick={() => setForm({ name: '', email: '', phone: '', alternatePhone: '', location: '', propertyDetails: '', message: '' })}
          >
            Clear
          </Button>
        </div>
      </form>
      <p className="px-6 md:px-8 pb-6 pt-2 text-center text-[#6B6B6B] text-sm border-t border-[#E5E5E5] bg-[#FAFAFA]/50">
        Prefer to talk?{' '}
        <Link to="/contact" className="text-[#E10600] font-medium hover:underline inline-flex items-center gap-1">
          View contact details <ArrowRight className="h-4 w-4" />
        </Link>
      </p>
    </div>
  );
}

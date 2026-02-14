import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Loader2, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitEnquiry } from '@/services/enquiryService';
import { toast } from '@/components/ui/sonner';

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

const BHK_OPTIONS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5 BHK' },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+()-]{10,16}$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/\s/g, '')) && phone.replace(/\D/g, '').length >= 10;
}

export interface EnquiryFormProps {
  /** Optional label for where the enquiry came from (e.g. "Home Loans", "Interior Design") - appended to message in submission */
  source?: string;
  /** Show compact header (no icon/title block when embedded in another page) */
  compactHeader?: boolean;
  /** Show "Prefer to talk?" link below form */
  showContactLink?: boolean;
  /** Optional id prefix for form fields (to avoid duplicate ids when multiple forms on page) */
  idPrefix?: string;
  /** Form heading (default: "Enquiry Form") */
  formTitle?: string;
}

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  alternatePhone: '',
  intent: '',
  propertyType: '',
  bhk: '',
  budgetExpecting: '',
  propertyLocation: '',
  message: '',
};

export function EnquiryForm({
  source,
  compactHeader = false,
  showContactLink = true,
  idPrefix = 'cf',
  formTitle = 'Enquiry Form',
}: EnquiryFormProps) {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState(initialFormState);

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
    if (!form.intent) {
      toast.error('Please select: Would you like to Buy / Sell / Rent a Property.');
      return;
    }
    if (!form.propertyType) {
      toast.error('Please select Type of Property.');
      return;
    }
    if (!form.bhk) {
      toast.error('Please select Type of Flat / Villa / Independent house.');
      return;
    }
    if (!form.budgetExpecting.trim()) {
      toast.error('Please enter Budget.');
      return;
    }
    if (!form.propertyLocation.trim()) {
      toast.error('Please enter Location.');
      return;
    }

    let message = form.message.trim() || '—';
    if (source) {
      message += `\n\n[Enquiry from: ${source}]`;
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
        ...(form.alternatePhone.trim() && { alternatePhone: form.alternatePhone.trim() }),
        projectType: 'residential',
        intent: form.intent,
        propertyType: form.propertyType,
        bhk: form.bhk,
        budgetExpecting: form.budgetExpecting.trim(),
        propertyLocation: form.propertyLocation.trim(),
      });
      toast.success("We've received your enquiry. We'll get back to you within 24 hours.");
      setForm(initialFormState);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const id = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EEE] overflow-hidden">
      {!compactHeader && (
        <div className="px-6 py-5 border-b border-[#EEE] bg-[#FAFAFA]">
          <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#E10600]" />
            {formTitle}
          </h2>
          <p className="text-[#666] text-sm mt-1">* Indicates required question</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={id('name')} className="text-[#1A1A1A]">Name *</Label>
          <Input
            id={id('name')}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your answer"
            className="h-11 rounded-lg border-[#E5E5E5]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id('email')} className="text-[#1A1A1A]">Email *</Label>
          <Input
            id={id('email')}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your answer"
            className="h-11 rounded-lg border-[#E5E5E5]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id('phone')} className="text-[#1A1A1A]">Contact No. *</Label>
          <Input
            id={id('phone')}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your answer"
            className="h-11 rounded-lg border-[#E5E5E5]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id('alternate-phone')} className="text-[#1A1A1A]">Alternate Phone (optional)</Label>
          <Input
            id={id('alternate-phone')}
            name="alternatePhone"
            type="tel"
            value={form.alternatePhone}
            onChange={handleChange}
            placeholder="Your answer"
            className="h-11 rounded-lg border-[#E5E5E5]"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#1A1A1A]">Would you like to Buy / Sell / Rent a Property *</Label>
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
          <Label className="text-[#1A1A1A]">Type of Property *</Label>
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
          <Label className="text-[#1A1A1A]">Type of Flat / Villa / Independent house *</Label>
          <Select value={form.bhk} onValueChange={(v) => setForm((p) => ({ ...p, bhk: v }))}>
            <SelectTrigger className="h-11 rounded-lg border-[#E5E5E5]">
              <SelectValue placeholder="Select BHK" />
            </SelectTrigger>
            <SelectContent>
              {BHK_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={id('budget')} className="text-[#1A1A1A]">Budget *</Label>
          <Input
            id={id('budget')}
            name="budgetExpecting"
            value={form.budgetExpecting}
            onChange={handleChange}
            placeholder="Your answer"
            className="h-11 rounded-lg border-[#E5E5E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id('location')} className="text-[#1A1A1A]">Location *</Label>
          <Input
            id={id('location')}
            name="propertyLocation"
            value={form.propertyLocation}
            onChange={handleChange}
            placeholder="Your answer"
            className="h-11 rounded-lg border-[#E5E5E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id('message')} className="text-[#1A1A1A]">
            Queries (if you'd like to ask any questions please mention here)
          </Label>
          <Textarea
            id={id('message')}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your answer"
            rows={4}
            className="rounded-lg border-[#E5E5E5] resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={sending}
            className="flex-1 h-11 rounded-lg bg-[#E10600] hover:bg-[#B11226] font-semibold flex items-center justify-center gap-2"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            {sending ? 'Sending...' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg border-[#E5E5E5]"
            onClick={() => setForm(initialFormState)}
          >
            Clear form
          </Button>
        </div>
      </form>
      {showContactLink && (
        <p className="px-6 pb-6 text-center text-[#666] text-sm">
          Prefer to talk?{' '}
          <Link to="/contact" className="text-[#E10600] font-medium hover:underline inline-flex items-center gap-1">
            View contact details <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      )}
    </div>
  );
}

export default EnquiryForm;

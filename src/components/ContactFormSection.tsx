import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PAGE_CONTENT: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Share your requirement',
    description: "Tell us what you're looking for—budget, location, property type—and we'll get back within 24 hours.",
  },
  '/about': {
    title: 'Share your requirement',
    description: "We'd love to hear from you. Tell us about your next property or any question.",
  },
  '/properties': {
    title: 'Share your requirement',
    description: 'Tell us your requirements—budget, location, type—and our team will help you find the right match.',
  },
  '/gallery': {
    title: 'Share your requirement',
    description: 'Want to schedule a visit or know more about a project? Share your details.',
  },
  '/blog': {
    title: 'Share your requirement',
    description: "We'd love to hear your thoughts or suggestions. Send us a message.",
  },
  '/careers': {
    title: 'Share your requirement',
    description: 'Interested in joining Houses Adda? Share your details and we\'ll get back to you.',
  },
  '/help': {
    title: 'Share your requirement',
    description: "Couldn't find what you were looking for? Send us your requirement and we'll assist you.",
  },
  '/sitemap': {
    title: 'Share your requirement',
    description: 'Have a question or requirement? We\'re here to help.',
  },
  '/services/home-loans': {
    title: 'Share your requirement',
    description: 'Share your details and our experts will help you find the best home loan options.',
  },
  '/services/interior-design': {
    title: 'Share your requirement',
    description: "Tell us your space and style—we'll get back with ideas and a consultation.",
  },
  '/services/property-promotions': {
    title: 'Share your requirement',
    description: 'Interested in listing or promoting with us? Share your details and we\'ll reach out.',
  },
};

const DEFAULT_CONTENT = {
  title: 'Share your requirement',
  description: "Tell us what you're looking for and we'll get back to you within 24 hours.",
};

export function ContactFormSection() {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === '/contact' || pathname === '/contact-form') return null;
  if (pathname === '/services/home-loans' || pathname === '/services/interior-design' || pathname === '/services/property-promotions') return null;
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return null;

  const getContent = () => {
    if (PAGE_CONTENT[pathname]) return PAGE_CONTENT[pathname];
    if (pathname.startsWith('/property/')) {
      return {
        title: 'Share your requirement',
        description: "Send us your details and we'll get back with more information and scheduling.",
      };
    }
    return DEFAULT_CONTENT;
  };
  const content = getContent();

  return (
    <section className="relative border-t border-[#E5E5E5] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E10600]/[0.06] via-white to-[#E10600]/[0.04]" aria-hidden />
      <div className="container-custom relative py-14 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
              We're here to help
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
              {content.title}
            </h2>
            <p className="text-[#6B6B6B] text-base leading-relaxed">
              {content.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              className="h-12 px-8 rounded-xl bg-[#E10600] hover:bg-[#B11226] font-semibold text-base shadow-lg shadow-[#E10600]/20 transition-all hover:shadow-xl hover:shadow-[#E10600]/25"
            >
              <Link to="/contact-form" className="inline-flex items-center gap-2">
                Share your requirement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border-2 border-[#1A1A1A]/25 bg-white font-semibold text-base text-[#1A1A1A] hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] hover:border-[#1A1A1A]/40 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Quick Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactFormSection;

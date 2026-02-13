import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PAGE_CONTENT: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Get in touch',
    description: "Have a question or want to explore properties? Send us an enquiry and we'll get back within 24 hours.",
  },
  '/about': {
    title: 'Reach out to us',
    description: "We'd love to hear from you. Whether it's about our story or your next property, drop us a line.",
  },
  '/properties': {
    title: 'Need help finding a property?',
    description: 'Tell us your requirements—budget, location, type—and our team will help you find the right match.',
  },
  '/gallery': {
    title: 'Questions about our gallery?',
    description: 'Want to schedule a visit or know more about a project? Send us an enquiry.',
  },
  '/blog': {
    title: 'Have feedback or a topic idea?',
    description: "We'd love to hear your thoughts or suggestions for our blog.",
  },
  '/careers': {
    title: 'Apply or ask about careers',
    description: 'Interested in joining Houses Adda? Send your details and we\'ll get back to you.',
  },
  '/help': {
    title: 'Still need help?',
    description: "Couldn't find what you were looking for? Send us a message and we'll assist you.",
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
    description: "Tell us your space and style—we'll get back with ideas and a consultation.",
  },
  '/services/property-promotions': {
    title: 'Promote your property',
    description: 'Interested in listing or promoting with us? Send your details and we\'ll reach out.',
  },
};

const DEFAULT_CONTENT = {
  title: 'Get in touch',
  description: "Have a question? Send us an enquiry and we'll get back to you within 24 hours.",
};

export function ContactFormSection() {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === '/contact' || pathname === '/contact-form') return null;

  const getContent = () => {
    if (PAGE_CONTENT[pathname]) return PAGE_CONTENT[pathname];
    if (pathname.startsWith('/property/')) {
      return {
        title: 'Interested in this property?',
        description: "Send us your details and we'll get back with more information and scheduling.",
      };
    }
    return DEFAULT_CONTENT;
  };
  const content = getContent();

  return (
    <section className="bg-[#E10600]/5 border-t-2 border-[#E10600]/20">
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2 relative inline-block w-full">
            {content.title}
            <span className="block mt-2 mx-auto w-16 h-1 rounded-full bg-[#E10600]" aria-hidden />
          </h2>
          <p className="text-[#6B6B6B] mb-8">{content.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="h-11 px-6 rounded-xl bg-[#E10600] hover:bg-[#B11226] font-semibold"
            >
              <Link to="/contact-form">
                Enquire Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 px-6 rounded-xl border-2 border-[#E10600]/30 text-[#E10600] hover:bg-[#E10600]/5 font-semibold"
            >
              <Link to="/contact-form">
                <FileText className="h-4 w-4 mr-2" />
                Get a Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactFormSection;

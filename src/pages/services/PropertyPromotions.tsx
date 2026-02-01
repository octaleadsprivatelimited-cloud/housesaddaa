import { Link } from 'react-router-dom';
import { Megaphone, Globe, BarChart3, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const digitalHighlights = [
  { icon: Globe, title: 'Online Listing', desc: 'Premium placement on property portals and our website' },
  { icon: BarChart3, title: 'Social Media', desc: 'Targeted campaigns on Facebook, Instagram, and LinkedIn' },
  { icon: Share2, title: 'Email Marketing', desc: 'Reach verified buyers and investors in our database' },
];

const offlineHighlights = [
  'Property brochures and pamphlets',
  'Hoarding and signage design',
  'Open house events',
  'Agent network promotion',
];

export default function PropertyPromotions() {
  return (
    <>
      <SEO
        title="Property Promotions | Houses Adda"
        description="Maximize your property's visibility with Houses Adda's marketing and promotion services. Digital and offline campaigns to reach the right buyers."
        url="/services/property-promotions"
      />
      <div className="min-h-screen bg-[#F9F9F9]">
        {/* Hero */}
        <div className="bg-white border-b border-[#E5E5E5]">
          <div className="container-custom py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Property Promotions</h1>
              <p className="text-xl text-[#6B6B6B]">
                Get your property noticed. Our marketing and promotion services help sellers reach the right audience through digital and offline channels.
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom py-16">
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Marketing & Promotion Services</h2>
            <p className="text-[#6B6B6B] mb-8 max-w-3xl leading-relaxed">
              Standing out in a competitive market requires a strategic approach. Houses Adda offers comprehensive property promotion services to ensure your listing gets maximum visibility among qualified buyers and investors.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Digital Promotion</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {digitalHighlights.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
                  <div className="w-14 h-14 rounded-xl bg-[#FADADD] flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-[#E10600]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">{title}</h3>
                  <p className="text-[#6B6B6B]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Offline Promotion</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {offlineHighlights.map((item) => (
                <li key={item} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-[#E5E5E5]">
                  <Megaphone className="h-5 w-5 text-[#E10600] shrink-0" />
                  <span className="text-[#1A1A1A] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-[#E5E5E5] shadow-sm">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Promote Your Property</h3>
            <p className="text-[#6B6B6B] mb-6 max-w-xl mx-auto">
              Ready to get more visibility for your listing? Contact us to discuss promotion packages tailored to your property.
            </p>
            <Button asChild className="bg-[#E10600] hover:bg-[#B11226]">
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

import { Link } from 'react-router-dom';
import {
  Megaphone,
  Globe,
  BarChart3,
  Share2,
  CheckCircle2,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { PropertyPromotionsEnquiryForm } from '@/components/PropertyPromotionsEnquiryForm';
import { useServiceHighlights } from '@/hooks/useServiceHighlights';

const galleryImages = [
  { id: '1600596542815-ffad4c1539a9', alt: 'Property listing' },
  { id: '1600585154340-be6161a56a0c', alt: 'Modern home' },
  { id: '1600607687939-ce8a6c25118c', alt: 'Residential property' },
  { id: '1613490493576-7fde63acd811', alt: 'Premium property' },
  { id: '1600566753190-17f0baa2a6c3', alt: 'House exterior' },
  { id: '1600047509807-ba87471cf18e', alt: 'Luxury villa' },
];

const digitalChannels = [
  {
    icon: Globe,
    title: 'Online Listings',
    description: 'Premium placement on property portals and our website for maximum visibility.',
  },
  {
    icon: BarChart3,
    title: 'Social Media',
    description: 'Targeted campaigns on Facebook, Instagram, and LinkedIn to reach buyers.',
  },
  {
    icon: Share2,
    title: 'Email Marketing',
    description: 'Reach verified buyers and investors in our exclusive database.',
  },
];

const offlineChannels = [
  { title: 'Property Brochures', desc: 'Professional brochures and pamphlets' },
  { title: 'Hoarding & Signage', desc: 'Strategic location branding' },
  { title: 'Open House Events', desc: 'Organized property viewings' },
  { title: 'Agent Network', desc: 'Promotion through partner agents' },
];

const benefits = [
  'Strategic marketing plan tailored to your property',
  'Multi-channel reach across digital and offline',
  'Professional photography and content creation',
  'Analytics and performance tracking',
];

export default function PropertyPromotions() {
  const { highlights } = useServiceHighlights('propertyPromotions');
  return (
    <>
      <SEO
        title="Property Promotions | Houses Adda"
        description="Maximize your property's visibility with Houses Adda's marketing and promotion services. Digital and offline campaigns to reach the right buyers."
        url="/services/property-promotions"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url('/cta-section-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
          <div className="container-custom relative py-12 md:py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-widest mb-4">
                Get Noticed
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Property
                <span className="text-[#E10600]"> Promotions</span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
                Maximize your property's visibility with our marketing and promotion services. Reach the right buyers through digital and offline channels.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="relative -mt-6 z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-[#E5E5E5]">
                  <div className="text-2xl font-bold text-[#E10600] mb-1">{h.value}</div>
                  <div className="text-sm text-[#6B6B6B] font-medium">{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                  Our Approach
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6">
                  Marketing & Promotion Services
                </h2>
                <p className="text-[#6B6B6B] text-lg leading-relaxed mb-8">
                  Standing out in a competitive market requires a strategic approach. Houses Adda offers comprehensive property promotion services to ensure your listing gets maximum visibility among qualified buyers and investors.
                </p>
                <ul className="space-y-4">
                  {benefits.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-[#E10600] shrink-0 mt-0.5" />
                      <span className="text-[#1A1A1A] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5]">
                  <Target className="h-10 w-10 text-[#E10600] mb-4" />
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Targeted Reach</h3>
                  <p className="text-[#6B6B6B] text-sm">Right audience, right channels</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5]">
                  <TrendingUp className="h-10 w-10 text-[#E10600] mb-4" />
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Faster Sale</h3>
                  <p className="text-[#6B6B6B] text-sm">Reduced time on market</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5] col-span-2">
                  <Users className="h-10 w-10 text-[#E10600] mb-4" />
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Verified Buyers</h3>
                  <p className="text-[#6B6B6B] text-sm">Access to our database of serious investors and home seekers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Promotion */}
        <section className="py-16 md:py-24 bg-[#F9F9F9]">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                Online Presence
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                Digital Promotion
              </h2>
              <p className="text-[#6B6B6B]">
                Reach buyers where they search—online. Our digital channels ensure maximum visibility.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {digitalChannels.map((item) => (
                <div
                  key={item.title}
                  className="group bg-white rounded-2xl p-8 border border-[#E5E5E5] hover:border-[#E10600]/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E10600]/10 flex items-center justify-center mb-6 group-hover:bg-[#E10600] transition-colors">
                    <item.icon className="h-7 w-7 text-[#E10600] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{item.title}</h3>
                  <p className="text-[#6B6B6B] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offline Promotion */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                Traditional Reach
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                Offline Promotion
              </h2>
              <p className="text-[#6B6B6B]">
                Complement digital campaigns with physical presence in high-traffic locations.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {offlineChannels.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-6 p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#E10600]/20 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 flex items-center justify-center shrink-0">
                    <Megaphone className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-lg mb-1">{item.title}</h3>
                    <p className="text-[#6B6B6B] text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 md:py-24 bg-[#F9F9F9]">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <div>
                <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-2">
                  Promoted Properties
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                  Gallery Preview
                </h2>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-[#E10600] font-semibold hover:text-[#B11226] transition-colors"
              >
                View Full Gallery
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#E5E5E5] group"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${img.id}?w=600&auto=format`}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enquiry Form */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-[#F8F8F8] to-white">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <span className="inline-block text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                  Get in touch
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
                  Promote your property
                </h2>
                <p className="text-[#6B6B6B] text-base max-w-lg mx-auto">
                  Interested in listing or promoting with us? Send your details and we'll reach out.
                </p>
              </div>
              <div className="shadow-xl rounded-3xl overflow-hidden border border-[#E5E5E5]">
                <PropertyPromotionsEnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

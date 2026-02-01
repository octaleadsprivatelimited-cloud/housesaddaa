import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Target,
  Award,
  Eye,
  Shield,
  Clock,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import SEO from '@/components/SEO';

const stats = [
  { value: '500+', label: 'Properties Listed' },
  { value: '1000+', label: 'Happy Clients' },
  { value: '50+', label: 'Locations' },
  { value: '24/7', label: 'Support' },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To revolutionize real estate by providing a seamless platform that empowers customers to make informed property investment decisions.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'To be the most trusted name in Indian real estate, known for transparency, integrity, and helping families find their perfect home.',
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'Every property is verified by our team to ensure authenticity and accuracy.',
  },
  {
    icon: Building2,
    title: 'Wide Selection',
    description: 'Browse apartments, villas, plots, and commercial spaces across major cities.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Our experienced consultants guide you through every step of your property journey.',
  },
  {
    icon: Award,
    title: 'Trusted Platform',
    description: 'Join thousands of satisfied customers who found their dream property with us.',
  },
];

const commitments = [
  'Transparent pricing with no hidden charges',
  'Personalized property recommendations',
  'End-to-end support from search to move-in',
  'Home loan assistance and interior design services',
];

export default function About() {
  return (
    <>
      <SEO
        title="About Us | Houses Adda"
        description="Learn about Houses Adda - India's trusted real estate platform. We connect property seekers with their dream homes across major cities with verified listings and expert support."
        url="/about"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url('/why-choose-us-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          <div className="container-custom relative py-10 md:py-14 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-widest mb-4">
                About Us
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Your Trusted Partner in
                <span className="text-[#E10600]"> Real Estate</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                Houses Adda connects property seekers with their dream homes across India. We make buying, selling, and renting simple, transparent, and hassle-free.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="relative -mt-8 z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 shadow-xl shadow-black/5 border border-[#E5E5E5] hover:shadow-[#E10600]/10 hover:border-[#E10600]/20 transition-all duration-300"
                >
                  <div className="text-2xl md:text-3xl font-bold text-[#E10600] mb-1">{stat.value}</div>
                  <div className="text-sm text-[#6B6B6B] font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Introduction */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-4">
                  Who We Are
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                  Making property decisions simpler for every Indian
                </h2>
                <p className="text-[#6B6B6B] text-lg leading-relaxed mb-6">
                  Houses Adda is a leading real estate platform dedicated to simplifying property transactions. We combine technology with human expertise to offer a seamless experience for buyers, sellers, and renters.
                </p>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Our team brings deep local market knowledge and a commitment to exceptional service. Beyond listings, we offer home loans, interior design, and property marketing to support your entire journey.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F5F5]">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format"
                    alt="Modern real estate"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-[#E5E5E5] hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E10600]/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-[#E10600]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1A1A1A]">1000+</div>
                      <div className="text-sm text-[#6B6B6B]">Happy Families</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-[#F9F9F9]">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                Our Purpose
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                Mission & Vision
              </h2>
              <p className="text-[#6B6B6B]">
                Guiding principles that drive everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="group bg-white rounded-2xl p-8 md:p-10 border border-[#E5E5E5] hover:border-[#E10600]/30 hover:shadow-xl hover:shadow-[#E10600]/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E10600]/10 flex items-center justify-center mb-6 group-hover:bg-[#E10600] transition-colors duration-300">
                    <item.icon className="h-7 w-7 text-[#E10600] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">{item.title}</h3>
                  <p className="text-[#6B6B6B] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                Our Promise
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                Why Choose Houses Adda
              </h2>
              <p className="text-[#6B6B6B]">
                What sets us apart in your property search
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item) => (
                <div
                  key={item.title}
                  className="group p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#E10600]/20 hover:shadow-xl hover:shadow-[#E10600]/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 flex items-center justify-center mb-5 group-hover:bg-[#E10600] transition-colors">
                    <item.icon className="h-6 w-6 text-[#E10600] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">{item.title}</h3>
                  <p className="text-[#6B6B6B] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Commitments */}
        <section className="py-16 md:py-24 bg-[#F9F9F9]">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-4">
                  What We Deliver
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                  Our commitment to you
                </h2>
                <p className="text-[#6B6B6B] mb-8 leading-relaxed">
                  We believe in building lasting relationships through transparency and exceptional service. Here's what you can expect when you work with us.
                </p>
                <ul className="space-y-4">
                  {commitments.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-[#E10600] shrink-0 mt-0.5" />
                      <span className="text-[#1A1A1A] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#1A1A1A] rounded-2xl p-8 md:p-10 text-white">
                <Sparkles className="h-10 w-10 text-[#E10600] mb-6" />
                <h3 className="text-2xl font-bold mb-4">
                  Ready to find your dream home?
                </h3>
                <p className="text-white/80 mb-6">
                  Our team is here to help. Get in touch for personalized property recommendations.
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:+916301575658"
                    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span>+91 63015 75658</span>
                  </a>
                  <a
                    href="mailto:info@housesadda.in"
                    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>info@housesadda.in</span>
                  </a>
                  <div className="flex items-start gap-3 text-white/90">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>Hyderabad, Telangana</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="bg-gradient-to-r from-[#E10600] to-[#B11226] rounded-3xl p-8 md:p-12 lg:p-16 text-white text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Start your property journey today
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Browse our verified listings or reach out for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#E10600] font-semibold hover:bg-white/95 transition-colors"
                >
                  Browse Properties
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

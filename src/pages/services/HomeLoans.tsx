import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Phone,
  ArrowRight,
  FileCheck,
  Percent,
  Clock,
  Shield,
  MessageCircle,
  Landmark,
  Calculator,
} from 'lucide-react';
import SEO from '@/components/SEO';

const partnerBanks = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
];

const benefits = [
  {
    icon: Percent,
    title: 'Best Interest Rates',
    description: 'Access competitive rates from top banks through our partnerships.',
  },
  {
    icon: FileCheck,
    title: 'Minimal Documentation',
    description: 'Streamlined process with expert help for all paperwork.',
  },
  {
    icon: Clock,
    title: 'Quick Processing',
    description: 'Faster approval and disbursement with pre-approved offers.',
  },
  {
    icon: Shield,
    title: 'Expert Guidance',
    description: 'Dedicated support throughout your loan application journey.',
  },
];

const processSteps = [
  { step: 1, title: 'Consult', description: 'Share your requirements and property details with our experts.' },
  { step: 2, title: 'Compare', description: 'Get customized loan offers from multiple partner banks.' },
  { step: 3, title: 'Apply', description: 'We assist with documentation and submission.' },
  { step: 4, title: 'Disburse', description: 'Receive funds once approved and start your dream home journey.' },
];

export default function HomeLoans() {
  return (
    <>
      <SEO
        title="Home Loans | Houses Adda"
        description="Get expert home loan assistance from Houses Adda. We partner with leading banks to help you finance your dream property with the best interest rates."
        url="/services/home-loans"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url('/featured-properties-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          <div className="container-custom relative py-12 md:py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-widest mb-4">
                Finance Your Dream
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Home Loan
                <span className="text-[#E10600]"> Assistance</span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
                Expert loan assistance from Houses Adda. We partner with India's leading banks to help you secure the best rates and terms for your dream property.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="relative -mt-6 z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#E5E5E5]">
                <div className="text-2xl font-bold text-[#E10600] mb-1">6+</div>
                <div className="text-sm text-[#6B6B6B] font-medium">Partner Banks</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#E5E5E5]">
                <div className="text-2xl font-bold text-[#E10600] mb-1">Best</div>
                <div className="text-sm text-[#6B6B6B] font-medium">Interest Rates</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#E5E5E5]">
                <div className="text-2xl font-bold text-[#E10600] mb-1">Quick</div>
                <div className="text-sm text-[#6B6B6B] font-medium">Processing</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#E5E5E5]">
                <div className="text-2xl font-bold text-[#E10600] mb-1">0</div>
                <div className="text-sm text-[#6B6B6B] font-medium">Hidden Charges</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:col-span-2 space-y-16">
                {/* Overview */}
                <div>
                  <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                    How We Help
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6">
                    Loan Assistance Overview
                  </h2>
                  <p className="text-[#6B6B6B] text-lg leading-relaxed mb-8">
                    Buying a home is one of the biggest financial decisions you'll make. Our home loan assistance connects you with verified banking partners to simplify the application process and secure the best terms.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Pre-approved loan offers from top banks',
                      'Competitive interest rates and flexible tenure',
                      'Minimal documentation with expert support',
                      'Quick processing and disbursement',
                      'End-to-end guidance throughout the application',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-[#E10600] shrink-0 mt-0.5" />
                        <span className="text-[#1A1A1A] font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits Grid */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">
                    Why Choose Our Loan Assistance
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {benefits.map((item) => (
                      <div
                        key={item.title}
                        className="group p-6 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5] hover:border-[#E10600]/20 hover:bg-white hover:shadow-lg transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 flex items-center justify-center mb-4 group-hover:bg-[#E10600] transition-colors">
                          <item.icon className="h-6 w-6 text-[#E10600] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">{item.title}</h3>
                        <p className="text-[#6B6B6B] text-sm leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">
                    How It Works
                  </h2>
                  <div className="space-y-6">
                    {processSteps.map((step, i) => (
                      <div
                        key={step.step}
                        className="flex gap-6 p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#E10600]/20 hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#E10600] text-white font-bold flex items-center justify-center shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A1A1A] text-lg mb-1">{step.title}</h3>
                          <p className="text-[#6B6B6B]">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partner Banks */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                    Partner Banks
                  </h2>
                  <p className="text-[#6B6B6B] mb-6">
                    We work with India's leading banks to offer you a wide range of home loan options.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {partnerBanks.map((bank) => (
                      <div
                        key={bank}
                        className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-[#E5E5E5] hover:border-[#E10600]/30 hover:shadow-md transition-all group"
                      >
                        <Landmark className="h-5 w-5 text-[#E10600]/70 group-hover:text-[#E10600]" />
                        <span className="font-semibold text-[#1A1A1A]">{bank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar CTA */}
              <div>
                <div className="sticky top-24 space-y-6">
                  <div className="bg-[#1A1A1A] rounded-2xl p-8 text-white">
                    <div className="w-14 h-14 rounded-xl bg-[#E10600] flex items-center justify-center mb-6">
                      <Calculator className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Need Loan Assistance?</h3>
                    <p className="text-white/80 text-sm mb-6">
                      Our experts will help you find the best home loan option. Get a callback today.
                    </p>
                    <Link
                      to="/contact"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#E10600] hover:bg-[#B11226] text-white font-semibold transition-colors"
                    >
                      Get Free Consultation
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
                    <h4 className="font-bold text-[#1A1A1A] mb-4">Quick Contact</h4>
                    <a
                      href="tel:+916301575658"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F5] transition-colors mb-2"
                    >
                      <Phone className="h-5 w-5 text-[#E10600]" />
                      <span className="font-medium">+91 63015 75658</span>
                    </a>
                    <a
                      href="https://wa.me/916301575658"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F5] transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      <span className="font-medium">WhatsApp Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 md:py-20 bg-[#F9F9F9]">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                Ready to finance your dream home?
              </h2>
              <p className="text-[#6B6B6B] mb-8">
                Our loan specialists are here to guide you. Contact us for a free, no-obligation consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#E10600] hover:bg-[#B11226] text-white font-semibold transition-colors"
                >
                  Schedule a Call
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="tel:+916301575658"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#E10600] text-[#E10600] font-semibold hover:bg-[#E10600] hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const partnerBanks = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
];

export default function HomeLoans() {
  return (
    <>
      <SEO
        title="Home Loans | Houses Adda"
        description="Get expert home loan assistance from Houses Adda. We partner with leading banks to help you finance your dream property with the best interest rates."
        url="/services/home-loans"
      />
      <div className="min-h-screen bg-[#F9F9F9]">
        {/* Hero */}
        <div className="bg-white border-b border-[#E5E5E5]">
          <div className="container-custom py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Home Loans</h1>
              <p className="text-xl text-[#6B6B6B]">
                Expert loan assistance to help you finance your dream property. We partner with leading banks to secure the best rates and terms for you.
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Loan Assistance Overview</h2>
                <p className="text-[#6B6B6B] mb-6 leading-relaxed">
                  At Houses Adda, we understand that buying a home is one of the most significant financial decisions you'll make. Our home loan assistance service connects you with verified banking partners to simplify the loan application process.
                </p>
                <ul className="space-y-4">
                  {[
                    'Pre-approved loan offers from top banks',
                    'Competitive interest rates and flexible tenure',
                    'Minimal documentation support',
                    'Quick processing and disbursement',
                    'Expert guidance throughout the application',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-[#E10600] shrink-0 mt-0.5" />
                      <span className="text-[#1A1A1A]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Partner Banks</h2>
                <p className="text-[#6B6B6B] mb-6">
                  We work with India's leading banks to offer you a wide range of home loan options tailored to your needs.
                </p>
                <div className="flex flex-wrap gap-3">
                  {partnerBanks.map((bank) => (
                    <span
                      key={bank}
                      className="px-4 py-2 bg-white rounded-xl border border-[#E5E5E5] text-[#1A1A1A] font-medium shadow-sm"
                    >
                      {bank}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar CTA */}
            <div>
              <div className="sticky top-24 bg-white rounded-2xl p-8 shadow-lg border border-[#E5E5E5]">
                <div className="w-14 h-14 rounded-xl bg-[#FADADD] flex items-center justify-center mb-6">
                  <Phone className="h-7 w-7 text-[#E10600]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Need Loan Assistance?</h3>
                <p className="text-[#6B6B6B] mb-6">
                  Our experts are ready to help you find the best home loan option. Get in touch today.
                </p>
                <Button asChild className="w-full bg-[#E10600] hover:bg-[#B11226]">
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <a
                  href="tel:+916301575658"
                  className="mt-3 flex items-center justify-center gap-2 text-[#E10600] font-semibold hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  +91 63015 75658
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

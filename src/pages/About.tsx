import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Users, Target, Award, Eye } from 'lucide-react';
import SEO from '@/components/SEO';

export default function About() {
  return (
    <>
      <SEO
        title="About Us | Houses Adda"
        description="Learn about Houses Adda - India's trusted real estate platform. We connect property seekers with their dream homes across major cities with verified listings and expert support."
        url="/about"
      />
      <div className="min-h-screen bg-[#F9F9F9]">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">About Houses Adda</h1>
            <p className="text-xl text-[#6B6B6B] mb-12">
              India's trusted real estate platform connecting buyers, sellers, and renters.
            </p>

            <section className="mb-16">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Company Introduction</h2>
              <p className="text-[#6B6B6B] mb-6 leading-relaxed">
                Houses Adda is a leading real estate platform in India, dedicated to making property buying, selling, and renting simple and transparent. We connect property seekers with their dream homes across major cities.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed">
                Our team of experienced consultants brings deep local market knowledge and a commitment to delivering exceptional service. We go beyond listings to offer comprehensive support including home loans, interior design, and property marketing.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Mission & Vision</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-3">Our Mission</h3>
                  <p className="text-[#6B6B6B]">
                    To revolutionize the real estate industry by providing a seamless, user-friendly platform that empowers customers to make informed decisions about their property investments.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E5E5]">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-3">Our Vision</h3>
                  <p className="text-[#6B6B6B]">
                    To be the most trusted name in Indian real estate, known for transparency, integrity, and our unwavering commitment to helping families find their perfect home.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Why Choose Us</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">Wide Selection</h3>
                    <p className="text-[#6B6B6B]">
                      Browse thousands of properties across apartments, villas, plots, and commercial spaces.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">Expert Support</h3>
                    <p className="text-[#6B6B6B]">
                      Our team of real estate experts is here to help you every step of the way.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">Verified Listings</h3>
                    <p className="text-[#6B6B6B]">
                      All properties are verified to ensure authenticity and accuracy.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">Trusted Platform</h3>
                    <p className="text-[#6B6B6B]">
                      Join thousands of satisfied customers who found their perfect property with us.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-[#E10600] hover:bg-[#B11226] rounded-xl">
                <Link to="/properties">Browse Properties</Link>
              </Button>
              <Button variant="outline" asChild className="border-[#E10600] text-[#E10600] hover:bg-[#FADADD] rounded-xl">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

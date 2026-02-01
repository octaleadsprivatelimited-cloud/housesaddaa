import { Shield, Clock, Award, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'All properties are verified by our team to ensure authenticity and accuracy.',
  },
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Get instant responses from property owners and agents within hours.',
  },
  {
    icon: Award,
    title: 'Best Deals',
    description: 'Find the best deals and competitive prices on properties across cities.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is available round the clock to assist you.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16 lg:py-20" aria-labelledby="section-why-choose-us">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
            Our Promise
          </p>
          <h2 id="section-why-choose-us" className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            Why Choose Houses Adda
          </h2>
          <p className="text-[#6B6B6B] text-base md:text-lg leading-relaxed">
            We make finding your dream home simple, transparent, and hassle-free
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 md:p-8 bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#E10600]/20 hover:shadow-xl hover:shadow-[#E10600]/5 transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#E10600] focus-within:ring-offset-2"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#E10600]/10 flex items-center justify-center mb-5 group-hover:bg-[#E10600] transition-colors duration-300">
                <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-[#E10600] group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-[#1A1A1A] text-lg md:text-xl mb-2">
                {feature.title}
              </h3>
              <p className="text-[#6B6B6B] text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-[#E10600] font-semibold hover:text-[#B11226] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:ring-offset-2 rounded-lg px-2 py-1"
          >
            Learn more about us
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

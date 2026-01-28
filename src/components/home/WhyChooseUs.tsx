import { Shield, Clock, Award, Headphones } from 'lucide-react';

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
    <section className="py-10 md:py-16 lg:py-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="section-heading text-xl md:text-2xl lg:text-3xl">Why Choose Houses Adda</h2>
          <p className="section-subheading text-sm md:text-base">
            We make finding your dream home simple and hassle-free
          </p>
        </div>

        {/* Features Grid - 2x2 on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-3 md:p-6 bg-card rounded-xl md:rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-2 md:mb-5 rounded-xl md:rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="h-5 w-5 md:h-8 md:w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-xs md:text-lg text-foreground mb-1 md:mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-[10px] md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

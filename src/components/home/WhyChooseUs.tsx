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
    <section className="py-6 md:py-8 lg:py-10">
      <div className="container-custom">
        <div className="relative rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border-2 border-white/50 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: 'url(/why-choose-us-bg.jpg)' }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-[#FEF3C7]/40 rounded-2xl"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-br-full blur-3xl z-10"></div>
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/20 rounded-tl-full blur-3xl z-10"></div>
          
        {/* Header */}
        <div className="relative z-10 text-center mb-6 md:mb-12">
          <h2 className="section-heading text-xl md:text-2xl lg:text-3xl">Why Choose Houses Adda</h2>
          <p className="section-subheading text-sm md:text-base">
            We make finding your dream home simple and hassle-free
          </p>
        </div>

        {/* Features Grid - 2x2 on mobile */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
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
      </div>
    </section>
  );
}

export default WhyChooseUs;

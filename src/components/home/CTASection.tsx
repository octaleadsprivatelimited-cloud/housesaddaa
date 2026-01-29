import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-6 md:py-8 lg:py-10">
      <div className="container-custom">
        <div className="relative rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border-2 border-white/50 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: 'url(/cta-section-bg.jpg)' }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-br-full blur-3xl z-10"></div>
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/20 rounded-tl-full blur-3xl z-10"></div>
          
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-white mb-2 md:mb-4">
              Ready to Find Your
              <span className="text-white block">Dream Property?</span>
            </h2>
            <p className="text-white/90 text-sm md:text-lg mb-4 md:mb-8 max-w-lg">
              Join thousands of happy homeowners who found their perfect property through Houses Adda.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-10">
              <Button variant="hero" size="default" className="md:text-base md:px-6 md:py-3" asChild>
                <Link to="/properties">
                  Browse Properties
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base text-white">50,000+</div>
                  <div className="text-[10px] md:text-xs text-white/80">Properties</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base text-white">10,000+</div>
                  <div className="text-[10px] md:text-xs text-white/80">Happy Users</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base text-white">100+</div>
                  <div className="text-[10px] md:text-xs text-white/80">Cities</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format" 
                    alt="Modern home"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg animate-float animation-delay-200">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format" 
                    alt="Luxury villa"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg animate-float animation-delay-100">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format" 
                    alt="Interior design"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg animate-float animation-delay-300">
                  <img 
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format" 
                    alt="Premium property"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;

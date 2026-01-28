import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="section-heading mb-4">
              Ready to Find Your
              <span className="text-gradient block">Dream Property?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Join thousands of happy homeowners who found their perfect property through Houses Adda. Start your search today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button variant="hero" size="xl" asChild>
                <Link to="/properties">
                  Browse Properties
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">50,000+</div>
                  <div className="text-xs text-muted-foreground">Properties</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">10,000+</div>
                  <div className="text-xs text-muted-foreground">Happy Users</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">100+</div>
                  <div className="text-xs text-muted-foreground">Cities</div>
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
    </section>
  );
}

export default CTASection;

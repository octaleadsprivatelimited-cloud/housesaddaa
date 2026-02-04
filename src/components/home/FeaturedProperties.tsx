import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCardCarousel } from '@/components/property/PropertyCardCarousel';
import { Property } from '@/types/property';
import { getFeaturedProperties } from '@/services/propertyService';

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featured = await getFeaturedProperties(6);
        setProperties(featured);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-6 md:py-8 lg:py-10">
      <div className="container-custom">
        <div className="relative rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border-2 border-white/50 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: 'url(/featured-properties-bg.jpg)' }}
          />
          {/* Black fade overlay for readability */}
          <div className="absolute inset-0 bg-black/70 rounded-2xl"></div>
          {/* Color overlay */}
          <div className="absolute inset-0 bg-[#E0F2FE]/20 rounded-2xl"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-br-full blur-3xl z-10"></div>
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/20 rounded-tl-full blur-3xl z-10"></div>
          
        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Featured Properties</h2>
            <p className="text-white/90 text-sm md:text-base mt-2">
              Handpicked properties for you to explore
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="w-fit bg-white/10 hover:bg-white/20 text-white border-white/30">
            <Link to="/properties">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="relative z-10 flex items-center justify-center py-12 md:py-16">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-white" />
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div className="relative z-10 flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <Building2 className="h-12 w-12 md:h-16 md:w-16 text-white/70 mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-white mb-2">No Featured Properties Yet</h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6 max-w-md">
              Properties will appear here once they are added through the admin panel.
            </p>
            <Button variant="outline" size="sm" asChild className="bg-white/10 hover:bg-white/20 text-white border-white/30">
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        ) : (
          /* Properties Slider */
          <div className="relative z-10">
            <PropertyCardCarousel properties={properties} variant="compact" />
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties;

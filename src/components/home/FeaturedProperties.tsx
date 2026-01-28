import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
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
    <section className="py-10 md:py-16 lg:py-24 bg-secondary/30">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-6 md:mb-10">
          <div>
            <h2 className="section-heading text-xl md:text-2xl lg:text-3xl">Featured Properties</h2>
            <p className="section-subheading text-sm md:text-base">
              Handpicked properties for you to explore
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="w-fit">
            <Link to="/properties">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12 md:py-16">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <Building2 className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">No Featured Properties Yet</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-md">
              Properties will appear here once they are added through the admin panel.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/properties">Browse All Properties</Link>
            </Button>
          </div>
        ) : (
          /* Properties Grid - 2 columns on mobile */
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard property={property} variant="compact" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;

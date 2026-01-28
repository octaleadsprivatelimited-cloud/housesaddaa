import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Property } from '@/types/property';
import { getFeaturedProperties } from '@/services/propertyService';
import { sampleProperties } from '@/data/properties';

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featured = await getFeaturedProperties(6);
        // If no properties in Firestore, use sample data as fallback
        if (featured.length === 0) {
          setProperties(sampleProperties.filter(p => p.isFeatured).slice(0, 6));
        } else {
          setProperties(featured);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        // Fallback to sample data on error
        setProperties(sampleProperties.filter(p => p.isFeatured).slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading">Featured Properties</h2>
            <p className="section-subheading">
              Handpicked properties for you to explore
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/properties">
              View All Properties
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          /* Properties Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;

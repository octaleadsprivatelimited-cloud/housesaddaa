import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { sampleProperties } from '@/data/properties';

export function FeaturedProperties() {
  const featuredProperties = sampleProperties.filter((p) => p.isFeatured).slice(0, 6);

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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties;

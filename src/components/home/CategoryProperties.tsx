import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { getPropertiesByType } from '@/services/propertyService';
import { Property } from '@/types/property';
import { propertyTypes } from '@/data/properties';

interface CategorySectionProps {
  propertyType: string;
  label: string;
}

function CategorySection({ propertyType, label }: CategorySectionProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getPropertiesByType(propertyType, 4);
        setProperties(data);
      } catch (error) {
        console.error(`Error fetching ${propertyType} properties:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyType]);

  // Don't render section if no properties
  if (!loading && properties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {label}
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore our {label.toLowerCase()} listings
            </p>
          </div>
          <Link
            to={`/properties?propertyType=${propertyType}`}
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Mobile View All Link */}
            <div className="mt-6 text-center sm:hidden">
              <Link
                to={`/properties?propertyType=${propertyType}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                View All {label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export function CategoryProperties() {
  // Display sections for main property types
  const categoriesToShow = propertyTypes.slice(0, 6);

  return (
    <div className="bg-muted/30">
      {categoriesToShow.map((type) => (
        <CategorySection
          key={type.value}
          propertyType={type.value}
          label={type.label}
        />
      ))}
    </div>
  );
}

export default CategoryProperties;

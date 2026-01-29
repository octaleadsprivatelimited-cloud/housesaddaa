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

  // Check if this is the Independent House section
  const isIndependentHouse = propertyType === 'independent-house';

  return (
    <section className="py-6 md:py-8 lg:py-10">
      <div className="container-custom">
        <div className={`relative rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border-2 border-white/50 overflow-hidden ${isIndependentHouse ? '' : ''}`}>
          {/* Background Image - only for Independent House */}
          {isIndependentHouse && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: 'url(/independent-house-section-bg.jpg)' }}
              />
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-[#F0FDF4]/40 rounded-2xl"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-br-full blur-3xl z-10"></div>
              <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/20 rounded-tl-full blur-3xl z-10"></div>
            </>
          )}
          {!isIndependentHouse && (
            <div style={{ backgroundColor: '#F0FDF4' }} className="absolute inset-0 rounded-2xl"></div>
          )}
          
        {/* Header */}
        <div className={`flex items-center justify-between mb-4 md:mb-8 ${isIndependentHouse ? 'relative z-10' : ''}`}>
          <div>
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground">
              {label}
            </h2>
            <p className="text-xs md:text-base text-muted-foreground mt-0.5 md:mt-1">
              Explore our {label.toLowerCase()} listings
            </p>
          </div>
          <Link
            to={`/properties?propertyType=${propertyType}`}
            className="flex items-center gap-1 md:gap-2 text-primary hover:text-primary/80 text-sm md:text-base font-medium transition-colors"
          >
            <span className="hidden sm:inline">View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className={`flex items-center justify-center py-8 md:py-12 ${isIndependentHouse ? 'relative z-10' : ''}`}>
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 ${isIndependentHouse ? 'relative z-10' : ''}`}>
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
      </div>
    </section>
  );
}

export function CategoryProperties() {
  // Display sections for main property types
  const categoriesToShow = propertyTypes.slice(0, 6);

  return (
    <div>
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

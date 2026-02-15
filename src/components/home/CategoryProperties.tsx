import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { PropertyCardCarousel } from '@/components/property/PropertyCardCarousel';
import { getPropertiesByType } from '@/services/propertyService';
import { Property } from '@/types/property';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';

interface CategorySectionProps {
  propertyType: string;
  label: string;
  index: number;
}

function CategorySection({ propertyType, label, index }: CategorySectionProps) {
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

  if (!loading && properties.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 lg:py-16" aria-labelledby={`section-${propertyType}`}>
      <div className="container-custom">
        <div className="relative rounded-2xl p-6 md:p-8 lg:p-10 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 id={`section-${propertyType}`} className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                {label}
              </h2>
              <p className="mt-1.5 text-[#6B6B6B] text-sm md:text-base">
                Explore our {label.toLowerCase()} listings
              </p>
            </div>
            <Link
              to={`/properties?propertyType=${propertyType}`}
              className="group inline-flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 px-5 py-2.5 border-2 border-[#E5E5E5] hover:border-[#E10600] text-[#1A1A1A] hover:text-[#E10600] text-sm font-medium rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:ring-offset-2"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 md:py-16">
              <Loader2 className="h-10 w-10 animate-spin text-[#E10600]" />
            </div>
          ) : (
            <PropertyCardCarousel properties={properties} variant="compact" />
          )}
        </div>
      </div>
    </section>
  );
}

export function CategoryProperties() {
  const { propertyTypes } = usePropertyTypes();
  return (
    <div>
      {propertyTypes
        .filter((type) => type.value !== 'independent-house' && type.value !== 'apartment' && type.value !== 'commercial')
        .map((type, index) => (
          <CategorySection
            key={type.value}
            propertyType={type.value}
            label={type.label}
            index={index}
          />
        ))}
    </div>
  );
}

export default CategoryProperties;

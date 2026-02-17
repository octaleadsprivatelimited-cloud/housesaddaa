import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Building2 } from 'lucide-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { getPropertiesForHomePage } from '@/services/propertyService';
import { Property } from '@/types/property';

export function AllPropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getPropertiesForHomePage(12);
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20" aria-labelledby="section-all-properties">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-2">
            Explore Listings
          </p>
          <h2 id="section-all-properties" className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Properties
          </h2>
          <p className="mt-2 text-[#6B6B6B] text-base">
            Browse our complete collection of verified properties
          </p>
        </div>

        {/* Properties Grid - 3 columns, 3–4 rows */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-[#E10600]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-[#F9F9F9] rounded-2xl border border-[#E5E5E5]">
            <Building2 className="h-16 w-16 text-[#6B6B6B]/50 mb-4" />
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No Properties Yet</h3>
            <p className="text-[#6B6B6B] mb-4 max-w-md">
              We're adding new listings. Check back soon or contact us for personalized assistance.
            </p>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#B11226] text-white font-medium inline-flex items-center gap-2"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="h-full min-h-[400px]">
                  <PropertyCard property={property} variant="default" />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link
                to="/properties"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E10600] hover:bg-[#B11226] text-white text-sm font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:ring-offset-2"
              >
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default AllPropertiesSection;

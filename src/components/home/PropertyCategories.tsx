import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { propertyTypes } from '@/data/properties';
import type { PropertyType } from '@/types/property';

const categoryImages: Record<string, string> = {
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format',
  'independent-house': '/independent-house-bg.jpg?v=2',
  plot: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format',
  commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format',
  penthouse: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format',
  studio: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format',
  farmhouse: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&auto=format',
  'builder-floor': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format',
};

interface CategoryCardProps {
  type: { value: PropertyType; label: string; icon: string };
  index: number;
}

function CategoryCard({ type, index }: CategoryCardProps) {
  const bgImage = categoryImages[type.value] || categoryImages.apartment;

  return (
    <Link
      to={`/properties?propertyType=${type.value}`}
      className="group relative block rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:ring-offset-2 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[#E10600]/10 hover:-translate-y-1"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      {/* Card - Mobile: square, Desktop: taller */}
      <div className="relative aspect-square sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] min-h-[120px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Gradient Overlay - Refined for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
          <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg mb-0.5 transition-colors group-hover:text-white">
            {type.label}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-white/80 text-xs sm:text-sm font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Explore
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {/* Top accent bar - subtle brand touch on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#E10600] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </Link>
  );
}

export function PropertyCategories() {
  const displayTypes = propertyTypes.slice(0, 6);

  return (
    <section className="py-12 md:py-16 lg:py-20" aria-labelledby="property-type-heading">
      <div className="container-custom">
        {/* Section Header - Improved typography & hierarchy */}
        <div className="mb-8 md:mb-12">
          <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-2">
            Property Types
          </p>
          <h2
            id="property-type-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight"
          >
            Browse by Property Type
          </h2>
          <p className="mt-2 text-[#6B6B6B] text-base md:text-lg max-w-xl">
            Find the perfect property that suits your lifestyle and investment goals
          </p>
        </div>

        {/* Categories Grid - Responsive & accessible */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
          {displayTypes.map((type, index) => (
            <div
              key={type.value}
              className="animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
            >
              <CategoryCard type={type} index={index} />
            </div>
          ))}
        </div>

        {/* View All CTA - Optional secondary action */}
        <div className="mt-8 md:mt-12 text-center">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#E10600] hover:text-[#B11226] border-2 border-[#E10600]/30 hover:border-[#E10600] rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-[#E10600]/10"
          >
            View Properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PropertyCategories;

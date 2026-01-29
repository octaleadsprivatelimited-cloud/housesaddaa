import { Link } from 'react-router-dom';
import { propertyTypes } from '@/data/properties';

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

export function PropertyCategories() {
  const displayTypes = propertyTypes.slice(0, 6); // Show 6 types in one row

  return (
    <section className="py-6 md:py-8 lg:py-10">
      <div className="container-custom">
        <div className="relative rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border-2 border-white/50 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: 'url(/property-type-bg.jpg)' }}
          />
          {/* Black fade overlay for readability */}
          <div className="absolute inset-0 bg-black/70 rounded-2xl"></div>
          {/* Color overlay */}
          <div className="absolute inset-0 bg-[#FFE5D4]/20 rounded-2xl"></div>
          
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full blur-2xl z-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-tr-full blur-2xl z-10"></div>
          
        {/* Header */}
        <div className="relative z-10 text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Browse by Property Type</h2>
          <p className="text-white/90 text-sm md:text-base mt-2">
            Find the perfect property that suits your needs
          </p>
        </div>

        {/* Categories - Responsive Grid on Mobile, Single Row on Desktop */}
        <div className="relative z-10 grid grid-cols-3 gap-2 md:hidden">
          {displayTypes.map((type, index) => {
            const bgImage = categoryImages[type.value] || categoryImages.apartment;
            return (
              <Link
                key={type.value}
                to={`/properties?propertyType=${type.value}`}
                className="group relative aspect-square rounded-lg overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2 text-center">
                  <h3 className="font-semibold text-primary-foreground text-xs leading-tight">
                    {type.label}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Desktop: Grid Row */}
        <div className="relative z-10 hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayTypes.map((type, index) => {
            const bgImage = categoryImages[type.value] || categoryImages.apartment;
            return (
              <Link
                key={type.value}
                to={`/properties?propertyType=${type.value}`}
                className="group relative flex-shrink-0 w-44 h-52 rounded-xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <h3 className="font-semibold text-primary-foreground text-lg mb-1">
                    {type.label}
                  </h3>
                  <p className="text-xs text-primary-foreground/70">
                    100+ Properties
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}

export default PropertyCategories;

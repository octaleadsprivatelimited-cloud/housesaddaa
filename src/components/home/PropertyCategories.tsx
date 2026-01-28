import { Link } from 'react-router-dom';
import { propertyTypes } from '@/data/properties';

const categoryImages: Record<string, string> = {
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format',
  'independent-house': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format',
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
    <section className="py-16 md:py-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-heading">Browse by Property Type</h2>
          <p className="section-subheading">
            Find the perfect property that suits your needs
          </p>
        </div>

        {/* Categories - Single Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
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
    </section>
  );
}

export default PropertyCategories;

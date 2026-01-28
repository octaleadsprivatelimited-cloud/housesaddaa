import { Link } from 'react-router-dom';
import { Building2, Home, Store, TreePine, Warehouse, Building } from 'lucide-react';
import { propertyTypes } from '@/data/properties';

const categoryIcons: Record<string, React.ElementType> = {
  apartment: Building2,
  villa: Home,
  'independent-house': Home,
  plot: TreePine,
  commercial: Store,
  penthouse: Building,
  studio: Building2,
  farmhouse: TreePine,
  'builder-floor': Warehouse,
};

export function PropertyCategories() {
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {propertyTypes.slice(0, 10).map((type, index) => {
            const Icon = categoryIcons[type.value] || Building2;
            return (
              <Link
                key={type.value}
                to={`/properties?propertyType=${type.value}`}
                className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-center animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {type.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  100+ Properties
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PropertyCategories;

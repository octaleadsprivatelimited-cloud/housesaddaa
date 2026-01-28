import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { locations } from '@/data/properties';

const cityImages: Record<string, string> = {
  Hyderabad: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&auto=format',
  Bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format',
  Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format',
  Gurgaon: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format',
};

export function TopCities() {
  return (
    <section className="py-16 md:py-24 bg-foreground text-primary-foreground">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-heading text-primary-foreground">Explore Top Cities</h2>
          <p className="section-subheading text-primary-foreground/70">
            Discover properties in India's most sought-after locations
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <Link
              key={location.id}
              to={`/properties?city=${location.city}`}
              className="group relative h-72 rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={cityImages[location.city]}
                alt={location.city}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold mb-1">{location.city}</h3>
                <p className="text-primary-foreground/70 text-sm mb-3">
                  {location.state}, {location.country}
                </p>
                <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Explore Properties</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopCities;

import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, BadgeCheck, ArrowRight } from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice } from '@/data/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'featured' | 'compact';
}

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const isFeatured = variant === 'featured';
  
  return (
    <Link 
      to={`/property/${property.slug}`}
      className={cn(
        'property-card group block',
        isFeatured && 'md:flex'
      )}
    >
      {/* Image */}
      <div className={cn(
        'relative overflow-hidden',
        isFeatured ? 'md:w-2/5 h-64 md:h-auto' : 'h-52'
      )}>
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            className={cn(
              'text-xs font-semibold uppercase',
              property.listingType === 'sale' ? 'badge-sale' : 'badge-rent'
            )}
          >
            For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
          {property.isFeatured && (
            <Badge className="badge-new text-xs font-semibold">
              Featured
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button 
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to wishlist
          }}
        >
          <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </button>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs capitalize">
            {property.propertyType.replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        'p-4',
        isFeatured && 'md:flex-1 md:p-6'
      )}>
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="price-display">
            {formatPrice(property.price, property.listingType)}
          </div>
          {property.isVerified && (
            <div className="flex items-center gap-1 text-success text-xs">
              <BadgeCheck className="h-4 w-4" />
              Verified
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">
            {property.location.area}, {property.location.city}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.area.toLocaleString()} {property.areaUnit}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {property.ownerName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{property.ownerName}</div>
              <div className="text-xs text-muted-foreground capitalize">{property.ownerType}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;

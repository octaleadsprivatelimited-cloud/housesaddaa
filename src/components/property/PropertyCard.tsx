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
  const isCompact = variant === 'compact';
  
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
        isFeatured ? 'md:w-2/5 h-48 md:h-auto' : isCompact ? 'h-32' : 'h-40 md:h-52'
      )}>
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge 
            className={cn(
              'text-[10px] md:text-xs font-semibold uppercase px-1.5 py-0.5 md:px-2 md:py-1',
              property.listingType === 'sale' ? 'badge-sale' : 'badge-rent'
            )}
          >
            {property.listingType === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
          {property.isFeatured && !isCompact && (
            <Badge className="badge-new text-[10px] md:text-xs font-semibold px-1.5 py-0.5 md:px-2 md:py-1">
              Featured
            </Badge>
          )}
        </div>

        {/* Wishlist - Hidden on compact mobile */}
        <button 
          className={cn(
            'absolute top-2 right-2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors',
            isCompact && 'hidden md:flex'
          )}
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to wishlist
          }}
        >
          <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </button>

        {/* Property Type Badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-[10px] md:text-xs capitalize px-1.5 py-0.5">
            {property.propertyType.replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        'p-3 md:p-4',
        isFeatured && 'md:flex-1 md:p-6'
      )}>
        {/* Price */}
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="price-display text-base md:text-lg">
            {formatPrice(property.price, property.listingType)}
          </div>
          {property.isVerified && !isCompact && (
            <div className="hidden md:flex items-center gap-1 text-success text-xs">
              <BadgeCheck className="h-4 w-4" />
              Verified
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm md:text-lg mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-xs md:text-sm mb-2 md:mb-4">
          <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.location.area}, {property.location.city}
          </span>
        </div>

        {/* Features - Compact on mobile */}
        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2 md:mb-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-0.5 md:gap-1">
              <Bed className="h-3 w-3 md:h-4 md:w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-0.5 md:gap-1">
              <Bath className="h-3 w-3 md:h-4 md:w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-0.5 md:gap-1">
            <Square className="h-3 w-3 md:h-4 md:w-4" />
            <span>{property.area.toLocaleString()} {property.areaUnit}</span>
          </div>
        </div>

        {/* Footer - Simplified on mobile */}
        <div className="hidden md:flex items-center justify-between pt-3 border-t border-border">
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

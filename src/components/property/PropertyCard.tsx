import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Phone, Compass, Building2 } from 'lucide-react';
import { Property } from '@/types/property';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'featured' | 'compact' | 'premium';
}

function getPriceModifier(property: Property): string {
  if (property.propertyType === 'plot') return 'per acre';
  if (property.listingType === 'rent') return 'all inclusive';
  return 'negotiable';
}

function formatPriceDisplay(price: number, listingType: 'sale' | 'rent'): { amount: string; suffix?: string } {
  if (listingType === 'rent') {
    return {
      amount: `₹${price.toLocaleString('en-IN')}`,
      suffix: '/month',
    };
  }
  if (price >= 10000000) {
    return { amount: `₹${(price / 10000000).toFixed(2)} Cr` };
  }
  if (price >= 100000) {
    return { amount: `₹${(price / 100000).toFixed(2)} Lakh` };
  }
  return { amount: `₹${price.toLocaleString('en-IN')}` };
}

const PLACEHOLDER_IMAGE = '/home-image.jpg';

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const [imgError, setImgError] = useState(false);
  const { getPropertyTypeLabel } = usePropertyTypes();
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const priceDisplay = formatPriceDisplay(property.price, property.listingType);
  const priceModifier = getPriceModifier(property);
  const whatsappUrl = `https://wa.me/916301575658?text=${encodeURIComponent(`Hi, I'm interested in: ${property.title}`)}`;

  // Image: compact = smaller aspect for carousels; featured/grid = larger
  const imageClass = isCompact
    ? 'aspect-[16/10] max-h-[180px]'
    : isFeatured
      ? 'aspect-[4/3] md:aspect-square md:min-h-[200px]'
      : 'aspect-[4/3]';

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] hover:border-[#E5E5E5] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] transition-all duration-300">
      <Link
        to={`/property/${property.slug}`}
        className={cn('flex flex-col h-full min-h-0', isFeatured && 'md:flex-row')}
      >
        {/* Image */}
        <div
          className={cn(
            'relative flex-shrink-0 overflow-hidden bg-[#F0F0F0]',
            imageClass,
            isFeatured && 'md:w-[280px] md:flex-shrink-0 md:aspect-auto'
          )}
        >
          <img
            src={imgError ? PLACEHOLDER_IMAGE : (property.images[0] || PLACEHOLDER_IMAGE)}
            alt={property.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          {property.isFeatured && !isCompact && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-400 text-black text-[10px] font-bold uppercase">
              Featured
            </span>
          )}
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-semibold">
            {getPropertyTypeLabel(property.propertyType)}
          </span>
        </div>

        {/* Content */}
        <div
          className={cn(
            'flex flex-col flex-1 min-w-0 p-4 md:p-5',
            isCompact && 'p-3 md:p-4',
            isFeatured && 'md:justify-center'
          )}
        >
          <div className={cn('flex items-baseline justify-between gap-2', isCompact ? 'mb-1' : 'mb-2')}>
            <span className={cn('font-bold text-emerald-600 truncate', isCompact ? 'text-base' : 'text-lg')}>
              {priceDisplay.amount}
              {priceDisplay.suffix && (
                <span className="text-sm font-normal text-emerald-600/80 ml-0.5">{priceDisplay.suffix}</span>
              )}
            </span>
            <span className="text-xs text-[#8A8A8A] shrink-0">{priceModifier}</span>
          </div>

          <h3 className={cn('font-semibold text-[#1A1A1A] line-clamp-2 group-hover:text-[#E10600] transition-colors', isCompact ? 'text-sm mb-1' : 'text-base mb-1.5')}>
            {property.title}
          </h3>

          <div className={cn('flex items-center gap-1.5 text-[#6B6B6B] truncate', isCompact ? 'text-xs mb-2' : 'text-sm mb-4')}>
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{property.location.area}, {property.location.city}</span>
          </div>

          <div className={cn('flex items-center gap-4 text-[#6B6B6B]', isCompact ? 'text-xs mb-2' : 'text-sm mb-4')}>
            {property.propertyType === 'commercial' ? (
              <>
                {property.facings && (
                  <span className="flex items-center gap-1">
                    <Compass className="h-4 w-4 text-[#6B6B6B]/70" />
                    {property.facings}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-[#6B6B6B]/70" />
                  Commercial
                </span>
              </>
            ) : (
              <>
                {property.bedrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-[#6B6B6B]/70" />
                    {property.bedrooms} BHK
                  </span>
                )}
                {property.bathrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4 text-[#6B6B6B]/70" />
                    {property.bathrooms}
                  </span>
                )}
              </>
            )}
            <span className="flex items-center gap-1">
              <Square className="h-4 w-4 text-[#6B6B6B]/70" />
              {property.area.toLocaleString()} {property.areaUnit}
            </span>
          </div>

          <div className={cn('flex gap-2 mt-auto border-t border-[#E5E5E5]', isCompact ? 'pt-2' : 'pt-3')}>
            <a
              href={`tel:${property.ownerPhone.replace(/\s/g, '')}`}
              onClick={(e) => e.stopPropagation()}
              className={cn('flex-1 flex items-center justify-center gap-1.5 rounded-lg font-medium border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5] hover:border-[#E10600]/40 transition-colors', isCompact ? 'py-1.5 text-xs' : 'py-2 text-sm')}
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn('flex-1 flex items-center justify-center gap-1.5 rounded-lg font-medium bg-[#25D366] hover:bg-[#1DA851] text-white transition-colors', isCompact ? 'py-1.5 text-xs' : 'py-2 text-sm')}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PropertyCard;

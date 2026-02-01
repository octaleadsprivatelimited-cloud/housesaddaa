import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Phone } from 'lucide-react';
import { Property } from '@/types/property';
import { getPropertyTypeLabel } from '@/data/properties';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'featured' | 'compact';
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

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const priceDisplay = formatPriceDisplay(property.price, property.listingType);
  const priceModifier = getPriceModifier(property);
  const whatsappUrl = `https://wa.me/916301575658?text=${encodeURIComponent(`Hi, I'm interested in: ${property.title}`)}`;

  return (
    <div
      className={cn(
        'property-card group flex flex-col h-full bg-white rounded-[18px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300',
        isFeatured && 'md:flex-row',
      )}
    >
      <Link to={`/property/${property.slug}`} className={cn('flex flex-col flex-1 min-h-0', isFeatured && 'md:flex-row md:flex-1')}>
        {/* Image Section */}
        <div
          className={cn(
            'relative overflow-hidden',
            isFeatured ? 'md:w-2/5 h-48 md:h-auto min-h-[200px]' : isCompact ? 'h-36' : 'h-48 md:h-52',
          )}
        >
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"
            aria-hidden
          />

          {/* Top-left: FEATURED badge */}
          {property.isFeatured && !isCompact && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E10600] text-white text-[10px] font-bold uppercase tracking-wide">
                Featured
              </span>
            </div>
          )}

          {/* Top-right: Category tag */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#2B2B2B] text-white text-[10px] font-semibold">
              {getPropertyTypeLabel(property.propertyType)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={cn('flex flex-col flex-1 p-4', isFeatured && 'md:p-5')}>
          {/* Price Section */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-lg md:text-xl font-bold text-[#E10600]">
              <span className="font-extrabold">{priceDisplay.amount.charAt(0)}</span>
              {priceDisplay.amount.slice(1)}
              {priceDisplay.suffix && (
                <span className="text-sm font-normal text-[#E10600]/90">{priceDisplay.suffix}</span>
              )}
            </span>
            <span className="text-xs text-[#8A8A8A] shrink-0">{priceModifier}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#1A1A1A] text-base md:text-lg mb-1 line-clamp-1 group-hover:text-[#E10600] transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#6B6B6B] text-sm mb-3">
            <MapPin className="h-4 w-4 text-[#6B6B6B]/80 shrink-0" />
            <span className="line-clamp-1">
              {property.location.area}, {property.location.city}
            </span>
          </div>

          {/* Divider + Details Row */}
          <div className="border-t border-[#E5E5E5] pt-3 mt-auto">
            <div className="flex items-center gap-4 text-sm text-[#6B6B6B]">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-[#6B6B6B]/70" />
                  <span>{property.bedrooms} BHK</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-[#6B6B6B]/70" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4 text-[#6B6B6B]/70" />
                <span>
                  {property.area.toLocaleString()} {property.areaUnit}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={cn('flex items-center gap-2 mt-4', isCompact && 'mt-2')}>
                <a
                  href={`tel:${property.ownerPhone.replace(/\s/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white border-2 border-[#E10600] text-[#E10600] hover:bg-[#FADADD] transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-medium text-sm">Call</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#E10600] text-white hover:bg-[#B11226] transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="font-medium text-sm">WhatsApp</span>
                </a>
              </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PropertyCard;

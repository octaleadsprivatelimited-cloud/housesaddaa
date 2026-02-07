import { Link } from 'react-router-dom';
import { Maximize2, Heart, GitCompare } from 'lucide-react';
import { Property } from '@/types/property';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';

function formatPrice(price: number, listingType: 'sale' | 'rent'): string {
  if (listingType === 'rent') return `₹${price.toLocaleString('en-IN')}`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return `₹${price.toLocaleString('en-IN')}`;
}

function formatPriceSuffix(property: Property): string {
  if (property.listingType === 'rent') return 'per month';
  if (property.pricePerSqft) return `₹${property.pricePerSqft.toLocaleString()}/sqft`;
  return '';
}

interface FeaturedListingCardProps {
  property: Property;
}

export function FeaturedListingCard({ property }: FeaturedListingCardProps) {
  const { getPropertyTypeLabel } = usePropertyTypes();
  const priceStr = formatPrice(property.price, property.listingType);
  const priceSuffix = formatPriceSuffix(property);

  return (
    <Link to={`/property/${property.slug}`} className="block group">
      <div className="rounded-[16px] overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Bottom gradient for price readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
            aria-hidden
          />

          {/* Top-left: FEATURED badge */}
          {property.isFeatured && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E10600] text-white text-[10px] font-bold uppercase tracking-wide">
                Featured
              </span>
            </div>
          )}

          {/* Top-right: FOR SALE / FOR RENT */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#2B2B2B] text-white text-[10px] font-semibold">
              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Bottom-left: Price overlay */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="font-bold text-white text-lg">{priceStr}</div>
            {priceSuffix && (
              <div className="text-white/80 text-sm">{priceSuffix}</div>
            )}
          </div>

          {/* Bottom-right: Icons (Expand, Wishlist, Compare) - fade in on hover */}
          <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={`/property/${property.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="View full size"
            >
              <Maximize2 className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-9 h-9 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-9 h-9 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Compare"
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedListingCard;

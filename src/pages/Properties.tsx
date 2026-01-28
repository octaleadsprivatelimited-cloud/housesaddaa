import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid3X3, List, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyCard } from '@/components/property/PropertyCard';
import { propertyTypes, bhkOptions } from '@/data/properties';
import { Property, PropertyFilter } from '@/types/property';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { getProperties } from '@/services/propertyService';
import { useLocations } from '@/hooks/useLocations';

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const { allAreas, loading: locationsLoading } = useLocations();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  
  // Parse URL params
  const initialListingType = searchParams.get('type') as 'sale' | 'rent' | null;
  const initialArea = searchParams.get('area');
  const initialPropertyType = searchParams.get('propertyType');
  
  const [filters, setFilters] = useState<PropertyFilter>({
    listingType: initialListingType || undefined,
    location: initialArea ? { area: initialArea } : undefined,
    propertyTypes: initialPropertyType ? [initialPropertyType as any] : undefined,
  });

  // Fetch properties from Firestore
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const result = await getProperties({ ...filters, sortBy });
        setProperties(result.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, sortBy]);
  
  const activeFilterCount = [
    filters.listingType,
    filters.location?.area,
    filters.propertyTypes?.length,
    filters.bedrooms?.length,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Listing Type */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Listing Type</h4>
        <div className="flex gap-2">
          <Button
            variant={filters.listingType === 'sale' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters({ ...filters, listingType: filters.listingType === 'sale' ? undefined : 'sale' })}
          >
            Buy
          </Button>
          <Button
            variant={filters.listingType === 'rent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters({ ...filters, listingType: filters.listingType === 'rent' ? undefined : 'rent' })}
          >
            Rent
          </Button>
        </div>
      </div>

      {/* Area */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Area</h4>
        <Select 
          value={filters.location?.area || 'all'} 
          onValueChange={(value) => setFilters({ ...filters, location: value !== 'all' ? { area: value } : undefined })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="All Areas" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-60">
            <SelectItem value="all">All Areas</SelectItem>
            {locationsLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              allAreas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Property Type</h4>
        <div className="space-y-2">
          {propertyTypes.slice(0, 6).map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.propertyTypes?.includes(type.value) || false}
                onCheckedChange={(checked) => {
                  const current = filters.propertyTypes || [];
                  const updated = checked
                    ? [...current, type.value]
                    : current.filter((t) => t !== type.value);
                  setFilters({ ...filters, propertyTypes: updated.length ? updated : undefined });
                }}
              />
              <span className="text-sm text-foreground">{type.icon} {type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BHK */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Bedrooms</h4>
        <div className="flex flex-wrap gap-2">
          {bhkOptions.map((bhk) => (
            <Button
              key={bhk}
              variant={filters.bedrooms?.includes(bhk) ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const current = filters.bedrooms || [];
                const updated = current.includes(bhk)
                  ? current.filter((b) => b !== bhk)
                  : [...current, bhk];
                setFilters({ ...filters, bedrooms: updated.length ? updated : undefined });
              }}
            >
              {bhk} BHK
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="destructive" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Page Header */}
      <div className="bg-card border-b border-border py-6">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span>Properties</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {filters.listingType === 'rent' ? 'Properties for Rent' : 
             filters.listingType === 'sale' ? 'Properties for Sale' : 
             'All Properties'}
            {filters.location?.area && ` in ${filters.location.area}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading ? 'Loading...' : `${properties.length} properties found`}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount}</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-card">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Active Filters */}
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                  {filters.listingType && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.listingType === 'sale' ? 'Buy' : 'Rent'}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setFilters({ ...filters, listingType: undefined })} 
                      />
                    </Badge>
                  )}
                  {filters.location?.area && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.location.area}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setFilters({ ...filters, location: undefined })} 
                      />
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select 
                  value={sortBy} 
                  onValueChange={(v) => setSortBy(v as typeof sortBy)}
                >
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
                  <button
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : properties.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {properties.map((property, index) => (
                  <div
                    key={property.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PropertyCard 
                      property={property} 
                      variant={viewMode === 'list' ? 'featured' : 'default'}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to find more properties
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

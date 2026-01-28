import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { propertyTypes, locations, amenities, furnishingOptions, propertyStatusOptions, bhkOptions } from '@/data/properties';

export default function AdminAddProperty() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    propertyType: '',
    listingType: 'sale',
    price: '',
    city: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    areaSize: '',
    furnishing: '',
    propertyStatus: '',
    description: '',
    ownerName: '',
    ownerPhone: '',
    ownerType: 'owner',
    selectedAmenities: [] as string[],
    isFeatured: false,
  });

  const selectedCity = locations.find((l) => l.city === formData.city);
  const areas = selectedCity?.areas || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In production, this would save to Firebase
    await new Promise((r) => setTimeout(r, 1000));
    
    toast({
      title: 'Property Added!',
      description: 'The property has been successfully added.',
    });
    
    navigate('/admin/properties');
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenityId)
        ? prev.selectedAmenities.filter((a) => a !== amenityId)
        : [...prev.selectedAmenities, amenityId],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/properties">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Add New Property</h1>
          <p className="text-muted-foreground">Fill in the details to list a new property</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Title</label>
              <Input
                placeholder="e.g., 3 BHK Luxury Apartment in Jubilee Hills"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(v) => setFormData({ ...formData, propertyType: v })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Listing Type</label>
                <Select 
                  value={formData.listingType} 
                  onValueChange={(v) => setFormData({ ...formData, listingType: v })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price {formData.listingType === 'rent' ? '(per month)' : ''}
              </label>
              <Input
                type="number"
                placeholder={formData.listingType === 'rent' ? 'e.g., 25000' : 'e.g., 5000000'}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Location</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <Select 
                value={formData.city} 
                onValueChange={(v) => setFormData({ ...formData, city: v, area: '' })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {locations.map((loc) => (
                    <SelectItem key={loc.city} value={loc.city}>
                      {loc.city}, {loc.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Area</label>
              <Select 
                value={formData.area} 
                onValueChange={(v) => setFormData({ ...formData, area: v })}
                disabled={!formData.city}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={formData.city ? 'Select area' : 'Select city first'} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Property Details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Select 
                value={formData.bedrooms} 
                onValueChange={(v) => setFormData({ ...formData, bedrooms: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="BHK" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {bhkOptions.map((bhk) => (
                    <SelectItem key={bhk} value={bhk.toString()}>
                      {bhk} BHK
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <Input
                type="number"
                placeholder="e.g., 2"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Area (sqft)</label>
              <Input
                type="number"
                placeholder="e.g., 1500"
                value={formData.areaSize}
                onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Furnishing</label>
              <Select 
                value={formData.furnishing} 
                onValueChange={(v) => setFormData({ ...formData, furnishing: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {furnishingOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Property Status</label>
            <Select 
              value={formData.propertyStatus} 
              onValueChange={(v) => setFormData({ ...formData, propertyStatus: v })}
            >
              <SelectTrigger className="bg-background w-full sm:w-1/2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {propertyStatusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities.map((amenity) => (
              <label 
                key={amenity.id} 
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary/50"
              >
                <Checkbox
                  checked={formData.selectedAmenities.includes(amenity.id)}
                  onCheckedChange={() => toggleAmenity(amenity.id)}
                />
                <span className="text-sm">{amenity.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Description</h2>
          <Textarea
            placeholder="Describe the property in detail..."
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Owner Details */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Owner / Agent Details</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                placeholder="Full name"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select 
                value={formData.ownerType} 
                onValueChange={(v) => setFormData({ ...formData, ownerType: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="builder">Builder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="bg-card rounded-xl border border-border p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
            />
            <div>
              <span className="font-medium">Mark as Featured</span>
              <p className="text-sm text-muted-foreground">
                Featured properties appear on the homepage and get more visibility
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/properties')}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Property...' : 'Add Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}

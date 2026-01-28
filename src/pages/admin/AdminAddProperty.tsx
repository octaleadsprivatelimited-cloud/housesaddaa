import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { propertyTypes, locations, amenities, furnishingOptions, propertyStatusOptions, bhkOptions } from '@/data/properties';
import { addProperty } from '@/services/propertyService';
import { PropertyType } from '@/types/property';

// Generate slug from title
const generateSlug = (title: string, city: string): string => {
  const slug = `${title}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${Date.now().toString(36)}`;
};

export default function AdminAddProperty() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    propertyType: '',
    listingType: 'sale' as 'sale' | 'rent',
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
    ownerEmail: '',
    ownerType: 'owner' as 'owner' | 'agent' | 'builder',
    selectedAmenities: [] as string[],
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
  });

  const selectedCity = locations.find((l) => l.city === formData.city);
  const areas = selectedCity?.areas || [];

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    
    // Basic URL validation
    try {
      new URL(newImageUrl);
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid image URL',
        variant: 'destructive',
      });
      return;
    }

    if (imageUrls.length >= 10) {
      toast({
        title: 'Maximum images reached',
        description: 'You can add up to 10 images',
        variant: 'destructive',
      });
      return;
    }

    setImageUrls(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageUrls.length === 0) {
      toast({
        title: 'Images Required',
        description: 'Please add at least one property image URL',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare property data
      const propertyData = {
        title: formData.title,
        slug: generateSlug(formData.title, formData.city),
        propertyType: formData.propertyType as PropertyType,
        listingType: formData.listingType,
        price: parseInt(formData.price),
        pricePerSqft: formData.areaSize ? Math.round(parseInt(formData.price) / parseInt(formData.areaSize)) : undefined,
        location: {
          country: 'India',
          state: selectedCity?.state || '',
          city: formData.city,
          area: formData.area,
        },
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseInt(formData.areaSize) || 0,
        areaUnit: 'sqft' as const,
        furnishing: formData.furnishing as 'furnished' | 'semi-furnished' | 'unfurnished',
        propertyStatus: formData.propertyStatus as 'ready' | 'under-construction',
        amenities: formData.selectedAmenities,
        images: imageUrls,
        description: formData.description,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail || undefined,
        ownerType: formData.ownerType,
        isActive: true,
        isFeatured: formData.isFeatured,
        isVerified: false,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.description.slice(0, 160),
      };

      // Add to Firestore
      await addProperty(propertyData);
      
      toast({
        title: 'Property Added!',
        description: 'The property has been successfully added to the database.',
      });
      
      navigate('/admin/properties');
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add property. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Property Images */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Property Images</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add up to 10 image URLs. First image will be the cover photo.
          </p>
          
          {/* URL Input */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Paste image URL (e.g., https://example.com/image.jpg)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                className="pl-10"
              />
            </div>
            <Button type="button" onClick={addImageUrl} variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <img 
                  src={url} 
                  alt={`Property ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {imageUrls.length === 0 && (
            <p className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
              No images added yet. Paste an image URL above to add.
            </p>
          )}
        </div>

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
                  onValueChange={(v) => setFormData({ ...formData, listingType: v as 'sale' | 'rent' })}
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
            required
          />
        </div>

        {/* Owner Details */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Owner / Agent Details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium mb-2">Email (optional)</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select 
                value={formData.ownerType} 
                onValueChange={(v) => setFormData({ ...formData, ownerType: v as 'owner' | 'agent' | 'builder' })}
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

        {/* SEO Fields */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">SEO Settings (Optional)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <Input
                placeholder="Leave empty to use property title"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.metaTitle.length}/60 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <Textarea
                placeholder="Leave empty to use first 160 characters of description"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                maxLength={160}
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.metaDescription.length}/160 characters</p>
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
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Property...
              </>
            ) : (
              'Add Property'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

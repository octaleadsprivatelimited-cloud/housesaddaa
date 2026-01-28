import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { propertyTypes, locations, amenities, furnishingOptions, propertyStatusOptions, bhkOptions } from '@/data/properties';
import { getPropertyById, updateProperty } from '@/services/propertyService';
import { PropertyType } from '@/types/property';
import { imageToBase64, validateImage } from '@/services/imageService';

export default function AdminEditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  
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

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const property = await getPropertyById(id);
        if (!property) {
          toast({
            title: 'Property Not Found',
            description: 'The property you are trying to edit does not exist.',
            variant: 'destructive',
          });
          navigate('/admin/properties');
          return;
        }

        // Populate form with existing data
        setFormData({
          title: property.title,
          propertyType: property.propertyType || '',
          listingType: property.listingType,
          price: property.price.toString(),
          city: property.location.city,
          area: property.location.area,
          bedrooms: property.bedrooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          areaSize: property.area?.toString() || '',
          furnishing: property.furnishing || '',
          propertyStatus: property.propertyStatus || '',
          description: property.description || '',
          ownerName: property.ownerName || '',
          ownerPhone: property.ownerPhone || '',
          ownerEmail: property.ownerEmail || '',
          ownerType: property.ownerType || 'owner',
          selectedAmenities: property.amenities || [],
          isFeatured: property.isFeatured || false,
          metaTitle: property.metaTitle || '',
          metaDescription: property.metaDescription || '',
        });
        setImages(property.images || []);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: 'Error',
          description: 'Failed to load property data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate, toast]);

  const selectedCity = locations.find((l) => l.city === formData.city);
  const areas = selectedCity?.areas || [];

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      toast({
        title: 'Too many images',
        description: 'Maximum 5 images allowed',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessingImages(true);

    try {
      for (const file of files) {
        const validation = validateImage(file);
        if (!validation.valid) {
          toast({
            title: 'Invalid Image',
            description: validation.error,
            variant: 'destructive',
          });
          continue;
        }

        const base64 = await imageToBase64(file);
        setImages(prev => [...prev, base64]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process images',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    if (images.length === 0) {
      toast({
        title: 'Images Required',
        description: 'Please upload at least one property image',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyData = {
        title: formData.title,
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
        images: images,
        description: formData.description,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail || undefined,
        ownerType: formData.ownerType,
        isFeatured: formData.isFeatured,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.description.slice(0, 160),
      };

      await updateProperty(id, propertyData);
      
      toast({
        title: 'Property Updated!',
        description: 'The property has been successfully updated.',
      });
      
      navigate('/admin/properties');
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update property. Please try again.',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <h1 className="font-display text-2xl font-bold text-foreground">Edit Property</h1>
          <p className="text-muted-foreground">Update the property details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Images */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Property Images</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload up to 5 images. First image will be the cover photo.
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imgSrc, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <img 
                  src={imgSrc} 
                  alt={`Property ${index + 1}`} 
                  className="w-full h-full object-cover"
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
            
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImages}
                className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                {isProcessingImages ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8" />
                )}
                <span className="text-sm">{isProcessingImages ? 'Processing...' : 'Add Images'}</span>
              </button>
            )}
          </div>
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
                Updating Property...
              </>
            ) : (
              'Update Property'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

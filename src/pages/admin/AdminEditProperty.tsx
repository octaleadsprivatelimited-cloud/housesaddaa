import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2, FileText, Youtube, LayoutGrid, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { furnishingOptions, propertyStatusOptions, bhkOptions, facingOptions } from '@/data/properties';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';
import { useLocations } from '@/hooks/useLocations';
import { useAmenities } from '@/hooks/useAmenities';
import { getPropertyById, updateProperty } from '@/services/propertyService';
import { PropertyType, Property } from '@/types/property';
import { imageToBase64, validateImage } from '@/services/imageService';
import { uploadBrochure, validateBrochureFile } from '@/services/brochureService';
import { uploadFloorPlans, validateFloorPlanFile } from '@/services/floorPlanService';
import { parseYouTubeVideoId } from '@/services/galleryVideoService';

export default function AdminEditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [brochureUrl, setBrochureUrl] = useState('');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [floorPlanUrls, setFloorPlanUrls] = useState<string[]>([]);
  /** Preserve project-specific fields when editing a project listing (do not overwrite with undefined). */
  const projectFieldsRef = useRef<Partial<Property>>({});

  const [sizeOptions, setSizeOptions] = useState<{ bedrooms: string; bathrooms: string; areaSize: string }[]>([
    { bedrooms: '', bathrooms: '', areaSize: '' },
  ]);
  const [formData, setFormData] = useState({
    title: '',
    propertyType: '',
    listingType: 'sale' as 'sale' | 'rent',
    price: '',
    city: '',
    area: '',
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
  const [facingsOptions, setFacingsOptions] = useState<string[]>(['']);
  const isCommercial = formData.propertyType === 'commercial';

  const addSizeOption = () => setSizeOptions((prev) => [...prev, { bedrooms: '', bathrooms: '', areaSize: '' }]);
  const removeSizeOption = (index: number) => {
    if (sizeOptions.length <= 1) return;
    setSizeOptions((prev) => prev.filter((_, i) => i !== index));
  };
  const updateSizeOption = (index: number, field: 'bedrooms' | 'bathrooms' | 'areaSize', value: string) => {
    setSizeOptions((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addFacingsOption = () => setFacingsOptions((prev) => [...prev, '']);
  const removeFacingsOption = (index: number) => {
    if (facingsOptions.length <= 1) return;
    setFacingsOptions((prev) => prev.filter((_, i) => i !== index));
  };
  const updateFacingsOption = (index: number, value: string) => {
    setFacingsOptions((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

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
        if (property.facingsList && property.facingsList.length > 0) {
          setFacingsOptions(property.facingsList.length > 0 ? [...property.facingsList] : ['']);
        } else if (property.facings) {
          setFacingsOptions(property.facings.split(',').map((s) => s.trim()).filter(Boolean).length > 0
            ? property.facings.split(',').map((s) => s.trim())
            : ['']);
        } else {
          setFacingsOptions(['']);
        }
        if (property.sizeOptions && property.sizeOptions.length > 0) {
          setSizeOptions(
            property.sizeOptions.map((o) => ({
              bedrooms: o.bedrooms.toString(),
              bathrooms: o.bathrooms.toString(),
              areaSize: o.areaSqft.toString(),
            }))
          );
        } else {
          setSizeOptions([
            {
              bedrooms: property.bedrooms?.toString() || '',
              bathrooms: property.bathrooms?.toString() || '',
              areaSize: property.area?.toString() || '',
            },
          ]);
        }
        setImages(property.images || []);
        setBrochureUrl(property.brochureUrl || '');
        setYoutubeVideoUrl(property.youtubeVideoId ? `https://www.youtube.com/watch?v=${property.youtubeVideoId}` : '');
        setFloorPlanUrls(property.floorPlanUrls || []);
        // Preserve project fields so update does not remove them
        if (property.projectType || property.projectDetails || property.unitConfigurations) {
          projectFieldsRef.current = {
            projectType: property.projectType,
            projectDetails: property.projectDetails,
            unitConfigurations: property.unitConfigurations,
            plotVillaOptions: property.plotVillaOptions,
            projectStatus: property.projectStatus,
            possessionDate: property.possessionDate,
            legalApproval: property.legalApproval,
            masterPlanImageUrl: property.masterPlanImageUrl,
            customAmenities: property.customAmenities,
            metaKeywords: property.metaKeywords,
            socialSharingImageUrl: property.socialSharingImageUrl,
          };
        } else {
          projectFieldsRef.current = {};
        }
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

  const { propertyTypes } = usePropertyTypes();
  const { locations } = useLocations();
  const { amenities } = useAmenities();
  const selectedCity = locations.find((l) => l.city === formData.city);
  const areas = selectedCity?.areas ?? [];

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
      let finalBrochureUrl = brochureUrl;
      const brochureFile = brochureInputRef.current?.files?.[0];
      if (brochureFile) {
        setIsUploadingBrochure(true);
        try {
          finalBrochureUrl = await uploadBrochure(id, brochureFile);
        } catch (err: unknown) {
          toast({
            title: 'Brochure upload failed',
            description: err instanceof Error ? err.message : 'Please try again.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          setIsUploadingBrochure(false);
          return;
        }
        setIsUploadingBrochure(false);
      }
      const parsedYoutubeId = parseYouTubeVideoId(youtubeVideoUrl) || undefined;

      let finalFloorPlanUrls = floorPlanUrls;
      const newFloorPlanFiles = Array.from(floorPlanInputRef.current?.files || []);
      if (newFloorPlanFiles.length > 0) {
        const validFiles = newFloorPlanFiles.filter((f) => validateFloorPlanFile(f).valid);
        if (validFiles.length > 0) {
          try {
            const uploaded = await uploadFloorPlans(id, validFiles);
            finalFloorPlanUrls = [...floorPlanUrls, ...uploaded];
          } catch (err: unknown) {
            toast({
              title: 'Floor plan upload failed',
              description: err instanceof Error ? err.message : 'Saving property without new floor plans.',
              variant: 'destructive',
            });
          }
        }
      }

      const firstOption = sizeOptions[0];
      const firstBed = isCommercial ? 0 : parseInt(firstOption.bedrooms, 10) || 0;
      const firstBath = isCommercial ? 0 : parseInt(firstOption.bathrooms, 10) || 0;
      const firstArea = parseInt(firstOption.areaSize, 10) || 0;
      const parsedOptions = sizeOptions
        .map((row) => ({
          bedrooms: parseInt(row.bedrooms, 10) || 0,
          bathrooms: parseInt(row.bathrooms, 10) || 0,
          areaSqft: parseInt(row.areaSize, 10) || 0,
        }))
        .filter((o) => o.areaSqft > 0);
      const hasMultipleOptions = parsedOptions.length > 1;

      const propertyData = {
        title: formData.title,
        propertyType: formData.propertyType as PropertyType,
        listingType: formData.listingType,
        price: parseInt(formData.price),
        pricePerSqft: firstArea ? Math.round(parseInt(formData.price) / firstArea) : undefined,
        location: {
          country: 'India',
          state: selectedCity?.state || '',
          city: formData.city,
          area: formData.area,
        },
        bedrooms: firstBed,
        bathrooms: firstBath,
        area: firstArea,
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
        ...(finalBrochureUrl && { brochureUrl: finalBrochureUrl }),
        ...(parsedYoutubeId && { youtubeVideoId: parsedYoutubeId }),
        floorPlanUrls: finalFloorPlanUrls,
        ...((): { facings?: string; facingsList?: string[] } => {
          const list = facingsOptions.map((s) => s.trim()).filter(Boolean);
          if (list.length === 0) return {};
          return { facings: list.join(', '), facingsList: list };
        })(),
        sizeOptions: hasMultipleOptions ? parsedOptions : [],
        ...projectFieldsRef.current,
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

        {/* Brochure & YouTube Video */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Brochure & Video</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Brochure (PDF or Word)
              </label>
              {brochureUrl && (
                <p className="text-sm text-muted-foreground mb-2">
                  Current: <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download brochure</a>
                </p>
              )}
              <input
                type="file"
                ref={brochureInputRef}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">Upload a new file to replace. Max 10MB. PDF or Word. PDFs are compressed automatically.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Youtube className="h-4 w-4" /> YouTube Video
              </label>
              <Input
                placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                value={youtubeVideoUrl}
                onChange={(e) => setYoutubeVideoUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Paste the full YouTube link. Optional.</p>
            </div>
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
          {!isCommercial && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Add one or more options (e.g. 2 BHK / 1200 sqft, 3 BHK / 1500 sqft).</p>
              {sizeOptions.map((row, idx) => (
                <div key={idx} className="flex flex-wrap items-end gap-3 p-3 rounded-lg border border-border bg-muted/30 mb-2">
                  <div className="w-full sm:w-28">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">BHK</label>
                    <Select value={row.bedrooms} onValueChange={(v) => updateSizeOption(idx, 'bedrooms', v)}>
                      <SelectTrigger className="bg-background"><SelectValue placeholder="BHK" /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {bhkOptions.map((bhk) => (
                          <SelectItem key={bhk} value={bhk.toString()}>{bhk} BHK</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-24">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Bathrooms</label>
                    <Input
                      type="number"
                      placeholder="e.g., 2"
                      value={row.bathrooms}
                      onChange={(e) => updateSizeOption(idx, 'bathrooms', e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-28">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Area (sqft)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 1500"
                      value={row.areaSize}
                      onChange={(e) => updateSizeOption(idx, 'areaSize', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSizeOption(idx)}
                    disabled={sizeOptions.length <= 1}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addSizeOption} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add option
              </Button>
            </div>
          )}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Facings (add multiple if applicable)</p>
            {facingsOptions.map((value, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 mb-2">
                <div className="w-full sm:w-40">
                  <Select value={value || undefined} onValueChange={(v) => updateFacingsOption(idx, v)}>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Select facing" /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {facingOptions.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFacingsOption(idx)}
                  disabled={facingsOptions.length <= 1}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addFacingsOption} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add facing
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Floor Plans
            </label>
            {floorPlanUrls.length > 0 && (
              <p className="text-sm text-muted-foreground mb-2">
                Current: {floorPlanUrls.length} image(s). Upload more to add.
              </p>
            )}
            <input
              type="file"
              ref={floorPlanInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-xs text-muted-foreground mt-1">Images are compressed automatically. Max 10 per property, 5MB each.</p>
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
          <p className="text-sm text-muted-foreground mb-2">Line breaks and paragraphs you enter here will appear the same on the property page.</p>
          <Textarea
            placeholder="Describe the property in detail. Use line breaks for paragraphs and lists."
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

import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2, FileText, Youtube, LayoutGrid, Plus, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  furnishingOptions,
  propertyStatusOptions,
  bhkOptions,
  facingOptions,
  projectTypeOptions,
  landAreaUnitOptions,
  projectStatusOptions,
  unitBhkTypeOptions,
  plotFacingOptions,
  approvalAuthorityOptions,
  projectAmenityOptions,
} from '@/data/properties';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';
import { useLocations } from '@/hooks/useLocations';
import { useAmenities } from '@/hooks/useAmenities';
import { addProperty, updateProperty } from '@/services/propertyService';
import { PropertyType, ProjectType, UnitConfiguration, PlotVillaOption } from '@/types/property';
import { imageToBase64, validateImage } from '@/services/imageService';
import { uploadBrochure } from '@/services/brochureService';
import { uploadFloorPlans, validateFloorPlanFile } from '@/services/floorPlanService';
import { uploadApprovalDocs, validateApprovalDoc } from '@/services/approvalDocService';
import { parseYouTubeVideoId } from '@/services/galleryVideoService';

// Generate slug from title
const generateSlug = (title: string, city: string): string => {
  const slug = `${title}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${Date.now().toString(36)}`;
};

/** Map project type to PropertyType for storage. */
const projectTypeToPropertyType: Record<Exclude<ProjectType, 'individual'>, PropertyType> = {
  'gated-community': 'independent-house',
  'apartment-project': 'apartment',
  'villa-project': 'villa',
  'commercial-project': 'commercial',
  'mixed-use-project': 'commercial',
};

/** Default unit configuration for add row. */
const defaultUnitConfig = (): UnitConfiguration => ({
  bhkType: '2',
  unitSizeSqft: 0,
  priceMin: 0,
  priceMax: 0,
  numberOfUnits: 0,
});

/** Default plot/villa option. */
const defaultPlotVillaOption = (): PlotVillaOption => ({
  sizeSqYards: 0,
  facing: 'North',
  cornerPlot: false,
});

/** Project form state for step-based large project flow. */
interface ProjectFormState {
  title: string;
  listingType: 'sale' | 'rent';
  description: string;
  fullAddress: string;
  city: string;
  area: string;
  state: string;
  pincode: string;
  mapLat: string;
  mapLng: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerType: 'owner' | 'agent' | 'builder';
  totalLandArea: string;
  landAreaUnit: 'acres' | 'sqyards' | 'sqft';
  numberOfPhases: string;
  numberOfBlocksOrTowers: string;
  totalUnits: string;
  unitConfigurations: UnitConfiguration[];
  plotVillaOptions: PlotVillaOption[];
  projectStatus: string;
  possessionDate: string;
  reraNumber: string;
  approvalAuthority: string;
  approvalDocFiles: File[];
  selectedProjectAmenities: string[];
  customAmenities: string;
  images: string[];
  masterPlanImage: string;
  floorPlanFiles: File[];
  brochureFile: File | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  socialSharingImage: string;
  isFeatured: boolean;
  publishAsDraft: boolean;
}

const initialProjectForm: ProjectFormState = {
  title: '',
  listingType: 'sale',
  description: '',
  fullAddress: '',
  city: '',
  area: '',
  state: '',
  pincode: '',
  mapLat: '',
  mapLng: '',
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  ownerType: 'builder',
  totalLandArea: '',
  landAreaUnit: 'acres',
  numberOfPhases: '',
  numberOfBlocksOrTowers: '',
  totalUnits: '',
  unitConfigurations: [defaultUnitConfig()],
  plotVillaOptions: [],
  projectStatus: '',
  possessionDate: '',
  reraNumber: '',
  approvalAuthority: '',
  approvalDocFiles: [],
  selectedProjectAmenities: [],
  customAmenities: '',
  images: [],
  masterPlanImage: '',
  floorPlanFiles: [],
  brochureFile: null,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  socialSharingImage: '',
  isFeatured: false,
  publishAsDraft: false,
};

export default function AdminAddProperty() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectType, setProjectType] = useState<ProjectType>('individual');
  const [projectStep, setProjectStep] = useState(1);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(initialProjectForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const masterPlanInputRef = useRef<HTMLInputElement>(null);
  const projectFloorPlanInputRef = useRef<HTMLInputElement>(null);
  const approvalDocInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]); // Base64 strings
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [galleryVideos, setGalleryVideos] = useState<{ title: string; videoId: string }[]>([]);
  const [galleryVideoTitle, setGalleryVideoTitle] = useState('');
  const [galleryVideoUrl, setGalleryVideoUrl] = useState('');
  
  /** Per-row BHK / bathrooms / area (individual property). At least one row. */
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
    yearOfConstruction: '',
    yearOfCompletion: '',
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
  /** Multiple facings (e.g. North, East). At least one slot. */
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
        description: 'Maximum 5 images allowed (Firestore storage limit)',
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
      const parsedYoutubeId = parseYouTubeVideoId(youtubeVideoUrl) || undefined;

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
        slug: generateSlug(formData.title, formData.city),
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
        ...(hasMultipleOptions && { sizeOptions: parsedOptions }),
        furnishing: formData.furnishing as 'furnished' | 'semi-furnished' | 'unfurnished',
        propertyStatus: formData.propertyStatus as 'ready' | 'under-construction',
        ...(formData.yearOfConstruction && { yearOfConstruction: parseInt(formData.yearOfConstruction, 10) }),
        ...(formData.yearOfCompletion && { yearOfCompletion: parseInt(formData.yearOfCompletion, 10) }),
        amenities: formData.selectedAmenities,
        images: images,
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
        ...(parsedYoutubeId && { youtubeVideoId: parsedYoutubeId }),
        ...(galleryVideos.length > 0 && { galleryVideos }),
        ...((): { facings?: string; facingsList?: string[] } => {
          const list = facingsOptions.map((s) => s.trim()).filter(Boolean);
          if (list.length === 0) return {};
          return { facings: list.join(', '), facingsList: list };
        })(),
      };

      const newId = await addProperty(propertyData);

      const floorPlanFiles = Array.from(floorPlanInputRef.current?.files || []);
      if (floorPlanFiles.length > 0) {
        const validFiles = floorPlanFiles.filter((f) => validateFloorPlanFile(f).valid);
        if (validFiles.length > 0) {
          try {
            const floorPlanUrls = await uploadFloorPlans(newId, validFiles);
            await updateProperty(newId, { floorPlanUrls });
          } catch (err: unknown) {
            toast({
              title: 'Property added but floor plan upload failed',
              description: err instanceof Error ? err.message : 'You can add floor plans later by editing the property.',
              variant: 'destructive',
            });
          }
        }
      }

      const brochureFile = brochureInputRef.current?.files?.[0];
      if (brochureFile) {
        setIsUploadingBrochure(true);
        try {
          const brochureUrl = await uploadBrochure(newId, brochureFile);
          await updateProperty(newId, { brochureUrl });
        } catch (err: unknown) {
          toast({
            title: 'Property added but brochure upload failed',
            description: err instanceof Error ? err.message : 'You can add the brochure later by editing the property.',
            variant: 'destructive',
          });
        }
        setIsUploadingBrochure(false);
      }
      
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

  // ----- Project form handlers -----
  const updateProjectForm = (updates: Partial<ProjectFormState>) => {
    setProjectForm((prev) => ({ ...prev, ...updates }));
  };

  const addUnitConfig = () => {
    setProjectForm((prev) => ({
      ...prev,
      unitConfigurations: [...prev.unitConfigurations, defaultUnitConfig()],
    }));
  };
  const removeUnitConfig = (index: number) => {
    setProjectForm((prev) => ({
      ...prev,
      unitConfigurations: prev.unitConfigurations.filter((_, i) => i !== index),
    }));
  };
  const updateUnitConfig = (index: number, updates: Partial<UnitConfiguration>) => {
    setProjectForm((prev) => ({
      ...prev,
      unitConfigurations: prev.unitConfigurations.map((u, i) => (i === index ? { ...u, ...updates } : u)),
    }));
  };

  const addPlotVillaOption = () => {
    setProjectForm((prev) => ({ ...prev, plotVillaOptions: [...prev.plotVillaOptions, defaultPlotVillaOption()] }));
  };
  const removePlotVillaOption = (index: number) => {
    setProjectForm((prev) => ({ ...prev, plotVillaOptions: prev.plotVillaOptions.filter((_, i) => i !== index) }));
  };
  const updatePlotVillaOption = (index: number, updates: Partial<PlotVillaOption>) => {
    setProjectForm((prev) => ({
      ...prev,
      plotVillaOptions: prev.plotVillaOptions.map((o, i) => (i === index ? { ...o, ...updates } : o)),
    }));
  };

  const handleProjectImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setIsProcessingImages(true);
    try {
      const newImages: string[] = [];
      for (const file of files) {
        const validation = validateImage(file);
        if (!validation.valid) {
          toast({ title: 'Invalid Image', description: validation.error, variant: 'destructive' });
          continue;
        }
        const base64 = await imageToBase64(file);
        newImages.push(base64);
      }
      if (newImages.length > 0) {
        setProjectForm((prev) => {
          if (prev.images.length + newImages.length > 10) {
            toast({ title: 'Too many images', description: 'Maximum 10 images for projects', variant: 'destructive' });
            return prev;
          }
          return { ...prev, images: [...prev.images, ...newImages] };
        });
      }
    } finally {
      setIsProcessingImages(false);
      if (projectImageInputRef.current) projectImageInputRef.current.value = '';
    }
  };

  const handleProjectSubmit = async (asDraft: boolean) => {
    const p = projectForm;
    if (!p.title.trim()) {
      toast({ title: 'Required', description: 'Project title is required', variant: 'destructive' });
      return;
    }
    if (!p.city.trim()) {
      toast({ title: 'Required', description: 'City is required', variant: 'destructive' });
      return;
    }
    if (p.images.length === 0) {
      toast({ title: 'Required', description: 'Upload at least one project image', variant: 'destructive' });
      return;
    }
    const totalLand = parseFloat(p.totalLandArea);
    if (isNaN(totalLand) || totalLand <= 0) {
      toast({ title: 'Invalid', description: 'Total land area must be a positive number', variant: 'destructive' });
      return;
    }
    const blocks = parseInt(p.numberOfBlocksOrTowers, 10);
    const totalUnits = parseInt(p.totalUnits, 10);
    if (isNaN(blocks) || blocks < 0 || isNaN(totalUnits) || totalUnits < 0) {
      toast({ title: 'Invalid', description: 'Number of blocks and total units must be valid numbers', variant: 'destructive' });
      return;
    }
    const minPrice = p.unitConfigurations.reduce((min, u) => (u.priceMin > 0 && (min === 0 || u.priceMin < min) ? u.priceMin : min), 0);
    const propertyType = projectTypeToPropertyType[projectType as Exclude<ProjectType, 'individual'>];
    setIsSubmitting(true);
    try {
      const slug = generateSlug(p.title, p.city);
      const propertyPayload = {
        title: p.title,
        slug,
        propertyType,
        listingType: p.listingType,
        price: minPrice,
        location: {
          country: 'India',
          state: p.state || (locations.find((l) => l.city === p.city)?.state ?? ''),
          city: p.city,
          area: p.area,
          pincode: p.pincode || undefined,
          fullAddress: p.fullAddress || undefined,
        },
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        areaUnit: 'sqft' as const,
        furnishing: 'unfurnished' as const,
        propertyStatus: 'under-construction' as const,
        amenities: [...p.selectedProjectAmenities, ...p.customAmenities.split(',').map((a) => a.trim()).filter(Boolean)],
        images: p.images,
        description: p.description,
        ownerName: p.ownerName,
        ownerPhone: p.ownerPhone,
        ownerEmail: p.ownerEmail || undefined,
        ownerType: p.ownerType,
        isActive: !asDraft,
        isFeatured: p.isFeatured,
        isVerified: false,
        metaTitle: p.metaTitle || p.title,
        metaDescription: p.metaDescription || p.description.slice(0, 160),
        projectType: projectType as Exclude<ProjectType, 'individual'>,
        projectDetails: {
          totalLandArea: totalLand,
          landAreaUnit: p.landAreaUnit,
          numberOfPhases: p.numberOfPhases ? parseInt(p.numberOfPhases, 10) : undefined,
          numberOfBlocksOrTowers: blocks,
          totalUnits,
        },
        unitConfigurations: p.unitConfigurations,
        plotVillaOptions: p.plotVillaOptions.length > 0 ? p.plotVillaOptions : undefined,
        projectStatus: (p.projectStatus as 'pre-launch' | 'under-construction' | 'ready-to-move' | 'new-launch') || undefined,
        possessionDate: p.possessionDate || undefined,
        legalApproval:
          p.reraNumber || p.approvalAuthority
            ? { reraNumber: p.reraNumber || undefined, approvalAuthority: p.approvalAuthority || undefined }
            : undefined,
        masterPlanImageUrl: p.masterPlanImage || undefined,
        customAmenities: p.customAmenities.split(',').map((a) => a.trim()).filter(Boolean).length > 0
          ? p.customAmenities.split(',').map((a) => a.trim()).filter(Boolean)
          : undefined,
        metaKeywords: p.metaKeywords || undefined,
        socialSharingImageUrl: p.socialSharingImage || undefined,
        mapLocation:
          p.mapLat && p.mapLng && !isNaN(parseFloat(p.mapLat)) && !isNaN(parseFloat(p.mapLng))
            ? { lat: parseFloat(p.mapLat), lng: parseFloat(p.mapLng) }
            : undefined,
      };
      const newId = await addProperty(propertyPayload);
      if (p.approvalDocFiles.length > 0) {
        try {
          const urls = await uploadApprovalDocs(newId, p.approvalDocFiles);
          await updateProperty(newId, {
            legalApproval: {
              reraNumber: p.reraNumber || undefined,
              approvalAuthority: p.approvalAuthority || undefined,
              approvalDocUrls: urls,
            },
          });
        } catch (err) {
          toast({ title: 'Property saved; approval docs upload failed', description: (err as Error).message, variant: 'destructive' });
        }
      }
      if (p.floorPlanFiles.length > 0) {
        try {
          const urls = await uploadFloorPlans(newId, p.floorPlanFiles);
          await updateProperty(newId, { floorPlanUrls: urls });
        } catch (err) {
          toast({ title: 'Property saved; floor plans upload failed', variant: 'destructive' });
        }
      }
      if (p.brochureFile) {
        setIsUploadingBrochure(true);
        try {
          const brochureUrl = await uploadBrochure(newId, p.brochureFile);
          await updateProperty(newId, { brochureUrl });
        } catch (err) {
          toast({ title: 'Property saved; brochure upload failed', variant: 'destructive' });
        }
        setIsUploadingBrochure(false);
      }
      toast({
        title: asDraft ? 'Saved as Draft' : 'Project Added',
        description: asDraft ? 'You can publish it later from the properties list.' : 'The project has been published.',
      });
      navigate('/admin/properties');
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to add project.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProject = projectType !== 'individual';

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

      {/* Project Type Selector */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-lg mb-2">Project Type</h2>
        <p className="text-sm text-muted-foreground mb-4">Choose whether you are adding a single property or a large project (e.g. gated community, apartment project).</p>
        <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
          <SelectTrigger className="bg-background max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {projectTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Individual Property Form (existing) */}
      {!isProject && (
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Images */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Property Images</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload up to 5 images (compressed for Firestore). First image will be the cover photo.
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
          />
          
          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((base64, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <img 
                  src={base64} 
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

        {/* Brochure & YouTube Video (optional) */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4">Brochure & Video (optional)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Brochure (PDF or Word)
              </label>
              <input
                type="file"
                ref={brochureInputRef}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">Max 10MB. PDF or Word. PDFs are compressed automatically before upload.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Youtube className="h-4 w-4" /> YouTube Video
              </label>
              <Input
                placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID"
                value={youtubeVideoUrl}
                onChange={(e) => setYoutubeVideoUrl(e.target.value)}
              />
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Gallery videos (this property)</h3>
              <p className="text-xs text-muted-foreground mb-3">Add multiple YouTube videos to show in this property&apos;s gallery.</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Input
                  placeholder="Video title"
                  value={galleryVideoTitle}
                  onChange={(e) => setGalleryVideoTitle(e.target.value)}
                  className="max-w-[200px]"
                />
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={galleryVideoUrl}
                  onChange={(e) => setGalleryVideoUrl(e.target.value)}
                  className="flex-1 min-w-[200px]"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const videoId = parseYouTubeVideoId(galleryVideoUrl);
                    if (!videoId) {
                      toast({ title: 'Invalid URL', description: 'Enter a valid YouTube URL', variant: 'destructive' });
                      return;
                    }
                    setGalleryVideos((prev) => [...prev, { title: galleryVideoTitle.trim() || 'Video', videoId }]);
                    setGalleryVideoTitle('');
                    setGalleryVideoUrl('');
                  }}
                >
                  Add video
                </Button>
              </div>
              {galleryVideos.length > 0 && (
                <ul className="space-y-2">
                  {galleryVideos.map((v, i) => (
                    <li key={i} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                      <span className="text-sm truncate flex-1">{v.title}</span>
                      <span className="text-xs text-muted-foreground">{v.videoId}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setGalleryVideos((prev) => prev.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
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
          
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Status</label>
              <Select value={formData.propertyStatus} onValueChange={(v) => setFormData({ ...formData, propertyStatus: v })}>
                <SelectTrigger className="bg-background w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {propertyStatusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year of Construction</label>
              <Input
                type="number"
                min={1900}
                max={2100}
                placeholder="e.g. 2022"
                value={formData.yearOfConstruction}
                onChange={(e) => setFormData({ ...formData, yearOfConstruction: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year of Completion</label>
              <Input
                type="number"
                min={1900}
                max={2100}
                placeholder="e.g. 2024"
                value={formData.yearOfCompletion}
                onChange={(e) => setFormData({ ...formData, yearOfCompletion: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Floor Plans
            </label>
            <input
              type="file"
              ref={floorPlanInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-xs text-muted-foreground mt-1">Images are compressed automatically. Max 10 images, 5MB each.</p>
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
                Adding Property...
              </>
            ) : (
              'Add Property'
            )}
          </Button>
        </div>
      </form>
      )}

      {/* Project Step Form (large projects) */}
      {isProject && (
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setProjectStep(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  projectStep === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s === 1 && 'Basic Info'}
                {s === 2 && 'Project Details'}
                {s === 3 && 'Units'}
                {s === 4 && 'Media'}
                {s === 5 && 'SEO'}
              </button>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {projectStep === 1 && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg">Basic Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">Project Title *</label>
                  <Input
                    value={projectForm.title}
                    onChange={(e) => updateProjectForm({ title: e.target.value })}
                    placeholder="e.g. Green Valley Gated Community"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Listing Type</label>
                  <Select value={projectForm.listingType} onValueChange={(v) => updateProjectForm({ listingType: v as 'sale' | 'rent' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="sale">For Sale</SelectItem><SelectItem value="rent">For Rent</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea value={projectForm.description} onChange={(e) => updateProjectForm({ description: e.target.value })} rows={4} placeholder="Describe the project..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">Full Address</label>
                  <Input value={projectForm.fullAddress} onChange={(e) => updateProjectForm({ fullAddress: e.target.value })} placeholder="Street, landmark, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <Select value={projectForm.city} onValueChange={(v) => updateProjectForm({ city: v, area: '' })}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.city} value={loc.city}>{loc.city}, {loc.state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area / Locality</label>
                  <Select
                    value={projectForm.area}
                    onValueChange={(v) => updateProjectForm({ area: v })}
                    disabled={!projectForm.city}
                  >
                    <SelectTrigger><SelectValue placeholder={projectForm.city ? 'Select area' : 'Select city first'} /></SelectTrigger>
                    <SelectContent>
                      {(locations.find((l) => l.city === projectForm.city)?.areas ?? []).map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <Input value={projectForm.state} onChange={(e) => updateProjectForm({ state: e.target.value })} placeholder="e.g. Telangana" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pin Code</label>
                  <Input value={projectForm.pincode} onChange={(e) => updateProjectForm({ pincode: e.target.value })} placeholder="500032" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1"><MapPin className="h-4 w-4" /> Map Latitude</label>
                  <Input value={projectForm.mapLat} onChange={(e) => updateProjectForm({ mapLat: e.target.value })} placeholder="17.3850" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Map Longitude</label>
                  <Input value={projectForm.mapLng} onChange={(e) => updateProjectForm({ mapLng: e.target.value })} placeholder="78.4867" />
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3">Owner / Builder / Agent</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input placeholder="Name" value={projectForm.ownerName} onChange={(e) => updateProjectForm({ ownerName: e.target.value })} />
                  <Input placeholder="Phone" value={projectForm.ownerPhone} onChange={(e) => updateProjectForm({ ownerPhone: e.target.value })} />
                  <Input placeholder="Email" value={projectForm.ownerEmail} onChange={(e) => updateProjectForm({ ownerEmail: e.target.value })} />
                  <Select value={projectForm.ownerType} onValueChange={(v) => updateProjectForm({ ownerType: v as 'owner' | 'agent' | 'builder' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="owner">Owner</SelectItem><SelectItem value="agent">Agent</SelectItem><SelectItem value="builder">Builder</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={() => setProjectStep(2)}>Next: Project Details</Button>
              </div>
            </div>
          )}

          {/* Step 2: Project Details (land, phases, blocks, status, legal) */}
          {projectStep === 2 && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg">Project Size & Land Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Land Area *</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={projectForm.totalLandArea}
                    onChange={(e) => updateProjectForm({ totalLandArea: e.target.value })}
                    placeholder="e.g. 99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <Select value={projectForm.landAreaUnit} onValueChange={(v) => updateProjectForm({ landAreaUnit: v as 'acres' | 'sqyards' | 'sqft' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {landAreaUnitOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Phases (optional)</label>
                  <Input type="number" min={0} value={projectForm.numberOfPhases} onChange={(e) => updateProjectForm({ numberOfPhases: e.target.value })} placeholder="e.g. 2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Blocks / Towers *</label>
                  <Input type="number" min={0} value={projectForm.numberOfBlocksOrTowers} onChange={(e) => updateProjectForm({ numberOfBlocksOrTowers: e.target.value })} placeholder="e.g. 4" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Units *</label>
                  <Input type="number" min={0} value={projectForm.totalUnits} onChange={(e) => updateProjectForm({ totalUnits: e.target.value })} placeholder="e.g. 120" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Status</label>
                  <Select value={projectForm.projectStatus} onValueChange={(v) => updateProjectForm({ projectStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      {projectStatusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Possession Date</label>
                  <Input type="date" value={projectForm.possessionDate} onChange={(e) => updateProjectForm({ possessionDate: e.target.value })} />
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Legal & Approval</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="RERA Number" value={projectForm.reraNumber} onChange={(e) => updateProjectForm({ reraNumber: e.target.value })} />
                  <Select value={projectForm.approvalAuthority} onValueChange={(v) => updateProjectForm({ approvalAuthority: v })}>
                    <SelectTrigger><SelectValue placeholder="Approval Authority" /></SelectTrigger>
                    <SelectContent>
                      {approvalAuthorityOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2">Upload Approval Documents (PDF)</label>
                    <input
                      type="file"
                      ref={approvalDocInputRef}
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={(e) => updateProjectForm({ approvalDocFiles: Array.from(e.target.files || []) })}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground"
                    />
                    {projectForm.approvalDocFiles.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">{projectForm.approvalDocFiles.length} file(s) selected</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {projectAmenityOptions.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary/50">
                      <Checkbox
                        checked={projectForm.selectedProjectAmenities.includes(opt.id)}
                        onCheckedChange={(c) => {
                          updateProjectForm({
                            selectedProjectAmenities: c
                              ? [...projectForm.selectedProjectAmenities, opt.id]
                              : projectForm.selectedProjectAmenities.filter((id) => id !== opt.id),
                          });
                        }}
                      />
                      <span className="text-sm">{opt.icon} {opt.name}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Custom amenities (comma-separated)</label>
                  <Input value={projectForm.customAmenities} onChange={(e) => updateProjectForm({ customAmenities: e.target.value })} placeholder="e.g. Spa, Co-working space" />
                </div>
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setProjectStep(1)}>Back</Button>
                <Button type="button" onClick={() => setProjectStep(3)}>Next: Units</Button>
              </div>
            </div>
          )}

          {/* Step 3: Unit Configuration & Plot/Villa options */}
          {projectStep === 3 && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg">Unit Configuration</h2>
              <p className="text-sm text-muted-foreground">Add one or more unit types with BHK, size, price range, and count.</p>
              {projectForm.unitConfigurations.map((u, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border space-y-3 flex flex-col sm:flex-row sm:items-end sm:gap-3 flex-wrap">
                  <Select value={u.bhkType} onValueChange={(v) => updateUnitConfig(idx, { bhkType: v as UnitConfiguration['bhkType'] })}>
                    <SelectTrigger className="w-full sm:w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {unitBhkTypeOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Unit size (sq ft)" value={u.unitSizeSqft || ''} onChange={(e) => updateUnitConfig(idx, { unitSizeSqft: parseInt(e.target.value, 10) || 0 })} className="w-full sm:w-32" />
                  <Input type="number" placeholder="Min price" value={u.priceMin || ''} onChange={(e) => updateUnitConfig(idx, { priceMin: parseInt(e.target.value, 10) || 0 })} className="w-full sm:w-28" />
                  <Input type="number" placeholder="Max price" value={u.priceMax || ''} onChange={(e) => updateUnitConfig(idx, { priceMax: parseInt(e.target.value, 10) || 0 })} className="w-full sm:w-28" />
                  <Input type="number" placeholder="No. of units" value={u.numberOfUnits || ''} onChange={(e) => updateUnitConfig(idx, { numberOfUnits: parseInt(e.target.value, 10) || 0 })} className="w-full sm:w-24" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeUnitConfig(idx)} className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addUnitConfig}><Plus className="h-4 w-4 mr-2" />Add unit type</Button>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Plot / Villa size options (optional)</h3>
                {projectForm.plotVillaOptions.map((o, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border mb-2">
                    <Input type="number" placeholder="Size (Sq Yards)" value={o.sizeSqYards || ''} onChange={(e) => updatePlotVillaOption(idx, { sizeSqYards: parseInt(e.target.value, 10) || 0 })} className="w-28" />
                    <Select value={o.facing} onValueChange={(v) => updatePlotVillaOption(idx, { facing: v })}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {plotFacingOptions.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <label className="flex items-center gap-2">
                      <Checkbox checked={o.cornerPlot} onCheckedChange={(c) => updatePlotVillaOption(idx, { cornerPlot: !!c })} />
                      <span className="text-sm">Corner</span>
                    </label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removePlotVillaOption(idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addPlotVillaOption}><Plus className="h-4 w-4 mr-2" />Add plot/villa option</Button>
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setProjectStep(2)}>Back</Button>
                <Button type="button" onClick={() => setProjectStep(4)}>Next: Media</Button>
              </div>
            </div>
          )}

          {/* Step 4: Media */}
          {projectStep === 4 && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg">Media</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Project Images * (first = cover)</label>
                <input type="file" ref={projectImageInputRef} accept="image/*" multiple onChange={handleProjectImageSelect} className="hidden" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {projectForm.images.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => updateProjectForm({ images: projectForm.images.filter((_, j) => j !== i) })} className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                  {projectForm.images.length < 10 && (
                    <button type="button" onClick={() => projectImageInputRef.current?.click()} disabled={isProcessingImages} className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary">
                      {isProcessingImages ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Images are compressed before upload. Max 10.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Master Plan Image</label>
                <input
                  type="file"
                  ref={masterPlanInputRef}
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const valid = validateImage(f);
                    if (!valid.valid) { toast({ title: 'Invalid image', description: valid.error, variant: 'destructive' }); return; }
                    const b64 = await imageToBase64(f);
                    updateProjectForm({ masterPlanImage: b64 });
                  }}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Floor Plans (multiple)</label>
                <input
                  type="file"
                  ref={projectFloorPlanInputRef}
                  accept="image/*"
                  multiple
                  onChange={(e) => updateProjectForm({ floorPlanFiles: Array.from(e.target.files || []) })}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground"
                />
                {projectForm.floorPlanFiles.length > 0 && <p className="text-xs text-muted-foreground mt-1">{projectForm.floorPlanFiles.length} file(s)</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Brochure (PDF)</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => updateProjectForm({ brochureFile: e.target.files?.[0] ?? null })}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground"
                />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setProjectStep(3)}>Back</Button>
                <Button type="button" onClick={() => setProjectStep(5)}>Next: SEO</Button>
              </div>
            </div>
          )}

          {/* Step 5: SEO & Submit */}
          {projectStep === 5 && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg">SEO & Sharing</h2>
              <Input placeholder="Meta Title" value={projectForm.metaTitle} onChange={(e) => updateProjectForm({ metaTitle: e.target.value })} />
              <Textarea placeholder="Meta Description" value={projectForm.metaDescription} onChange={(e) => updateProjectForm({ metaDescription: e.target.value })} rows={2} />
              <Input placeholder="SEO Keywords (comma-separated)" value={projectForm.metaKeywords} onChange={(e) => updateProjectForm({ metaKeywords: e.target.value })} />
              <div>
                <label className="block text-sm font-medium mb-2">Social Sharing Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const valid = validateImage(f);
                    if (!valid.valid) return;
                    const b64 = await imageToBase64(f);
                    updateProjectForm({ socialSharingImage: b64 });
                  }}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={projectForm.isFeatured} onCheckedChange={(c) => updateProjectForm({ isFeatured: !!c })} />
                <span>Mark as Featured</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={projectForm.publishAsDraft} onCheckedChange={(c) => updateProjectForm({ publishAsDraft: !!c })} />
                <span>Save as Draft (do not publish yet)</span>
              </label>
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setProjectStep(4)}>Back</Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => handleProjectSubmit(true)} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save as Draft'}
                  </Button>
                  <Button type="button" onClick={() => handleProjectSubmit(false)} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

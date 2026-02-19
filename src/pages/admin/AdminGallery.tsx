import { useState, useEffect, useRef } from 'react';
import { Video, Plus, Trash2, Loader2, ImageIcon, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { GalleryVideo } from '@/types/property';
import {
  getGalleryVideos,
  addGalleryVideo,
  deleteGalleryVideo,
  parseYouTubeVideoId,
} from '@/services/galleryVideoService';
import {
  getInteriorDesignGallery,
  setInteriorDesignGallery,
  type InteriorDesignGalleryImage,
} from '@/services/interiorDesignGalleryService';
import {
  getMainGalleryImages,
  setMainGalleryImages,
  type MainGalleryImage,
} from '@/services/mainGalleryService';
import {
  getPropertyGalleryImages,
  setPropertyGalleryImages,
  type PropertyGalleryImage,
} from '@/services/propertyGalleryService';
import {
  getGallerySectionVideos,
  addGallerySectionVideo,
  deleteGallerySectionVideo,
  type GallerySectionVideo,
  type GallerySectionKey,
} from '@/services/gallerySectionVideoService';
import { imageToBase64, validateImage } from '@/services/imageService';

export default function AdminGallery() {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const { toast } = useToast();

  const [interiorImages, setInteriorImages] = useState<InteriorDesignGalleryImage[]>([]);
  const [interiorLoading, setInteriorLoading] = useState(true);
  const [interiorSaving, setInteriorSaving] = useState(false);
  const [interiorDeleteIndex, setInteriorDeleteIndex] = useState<number | null>(null);
  const [newInteriorUrl, setNewInteriorUrl] = useState('');
  const [newInteriorAlt, setNewInteriorAlt] = useState('');
  const [addingInterior, setAddingInterior] = useState(false);
  const [uploadingInterior, setUploadingInterior] = useState(false);
  const interiorFileInputRef = useRef<HTMLInputElement>(null);

  const [mainImages, setMainImages] = useState<MainGalleryImage[]>([]);
  const [mainLoading, setMainLoading] = useState(true);
  const [mainDeleteIndex, setMainDeleteIndex] = useState<number | null>(null);
  const [newMainUrl, setNewMainUrl] = useState('');
  const [newMainAlt, setNewMainAlt] = useState('');
  const [addingMain, setAddingMain] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const mainFileInputRef = useRef<HTMLInputElement>(null);

  const [propertyImages, setPropertyImages] = useState<PropertyGalleryImage[]>([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyDeleteIndex, setPropertyDeleteIndex] = useState<number | null>(null);
  const [newPropertyUrl, setNewPropertyUrl] = useState('');
  const [newPropertyAlt, setNewPropertyAlt] = useState('');
  const [addingProperty, setAddingProperty] = useState(false);
  const [uploadingProperty, setUploadingProperty] = useState(false);
  const propertyFileInputRef = useRef<HTMLInputElement>(null);

  const [mainSectionVideos, setMainSectionVideos] = useState<GallerySectionVideo[]>([]);
  const [interiorSectionVideos, setInteriorSectionVideos] = useState<GallerySectionVideo[]>([]);
  const [propertySectionVideos, setPropertySectionVideos] = useState<GallerySectionVideo[]>([]);
  const [mainVideoTitle, setMainVideoTitle] = useState('');
  const [mainVideoUrl, setMainVideoUrl] = useState('');
  const [interiorVideoTitle, setInteriorVideoTitle] = useState('');
  const [interiorVideoUrl, setInteriorVideoUrl] = useState('');
  const [propertyVideoTitle, setPropertyVideoTitle] = useState('');
  const [propertyVideoUrl, setPropertyVideoUrl] = useState('');
  const [sectionVideoSubmitting, setSectionVideoSubmitting] = useState<string | null>(null);
  const [sectionVideoDeleteId, setSectionVideoDeleteId] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const list = await getGalleryVideos();
      setVideos(list);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load gallery videos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInteriorGallery = async () => {
    setInteriorLoading(true);
    try {
      const list = await getInteriorDesignGallery();
      setInteriorImages(list);
    } catch {
      toast({ title: 'Error', description: 'Failed to load Interior Design gallery', variant: 'destructive' });
    } finally {
      setInteriorLoading(false);
    }
  };

  const fetchMainGallery = async () => {
    setMainLoading(true);
    try {
      const list = await getMainGalleryImages();
      setMainImages(list);
    } catch {
      toast({ title: 'Error', description: 'Failed to load main gallery photos', variant: 'destructive' });
    } finally {
      setMainLoading(false);
    }
  };

  const fetchPropertyGallery = async () => {
    setPropertyLoading(true);
    try {
      const list = await getPropertyGalleryImages();
      setPropertyImages(list);
    } catch {
      toast({ title: 'Error', description: 'Failed to load Property gallery', variant: 'destructive' });
    } finally {
      setPropertyLoading(false);
    }
  };

  const fetchSectionVideos = async () => {
    try {
      const [main, interior, prop] = await Promise.all([
        getGallerySectionVideos('main'),
        getGallerySectionVideos('interior'),
        getGallerySectionVideos('property'),
      ]);
      setMainSectionVideos(main);
      setInteriorSectionVideos(interior);
      setPropertySectionVideos(prop);
    } catch {
      toast({ title: 'Error', description: 'Failed to load section videos', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchInteriorGallery();
    fetchMainGallery();
    fetchPropertyGallery();
    fetchSectionVideos();
  }, []);

  const handleAddSectionVideo = async (section: GallerySectionKey) => {
    const title = section === 'main' ? mainVideoTitle : section === 'interior' ? interiorVideoTitle : propertyVideoTitle;
    const url = section === 'main' ? mainVideoUrl : section === 'interior' ? interiorVideoUrl : propertyVideoUrl;
    if (!title.trim() || !url.trim()) {
      toast({ title: 'Validation', description: 'Title and YouTube URL are required', variant: 'destructive' });
      return;
    }
    setSectionVideoSubmitting(section);
    try {
      await addGallerySectionVideo(section, title, url);
      toast({ title: 'Added', description: 'YouTube video added to this section' });
      if (section === 'main') {
        setMainVideoTitle('');
        setMainVideoUrl('');
      } else if (section === 'interior') {
        setInteriorVideoTitle('');
        setInteriorVideoUrl('');
      } else {
        setPropertyVideoTitle('');
        setPropertyVideoUrl('');
      }
      await fetchSectionVideos();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to add video',
        variant: 'destructive',
      });
    } finally {
      setSectionVideoSubmitting(null);
    }
  };

  const handleDeleteSectionVideo = async () => {
    if (!sectionVideoDeleteId) return;
    setSubmitting(true);
    try {
      await deleteGallerySectionVideo(sectionVideoDeleteId);
      toast({ title: 'Removed', description: 'Video removed' });
      setSectionVideoDeleteId(null);
      await fetchSectionVideos();
    } catch {
      toast({ title: 'Error', description: 'Failed to remove video', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMainByUrl = async () => {
    const url = newMainUrl.trim();
    if (!url) {
      toast({ title: 'Validation', description: 'Image URL is required', variant: 'destructive' });
      return;
    }
    setAddingMain(true);
    try {
      const next = [...mainImages, { imageUrl: url, alt: newMainAlt.trim() || undefined }];
      setMainImages(next);
      await setMainGalleryImages(next);
      toast({ title: 'Added', description: 'Image added to main gallery' });
      setNewMainUrl('');
      setNewMainAlt('');
    } catch {
      toast({ title: 'Error', description: 'Failed to add image', variant: 'destructive' });
    } finally {
      setAddingMain(false);
    }
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      toast({ title: 'Invalid image', description: validation.error, variant: 'destructive' });
      return;
    }
    setUploadingMain(true);
    try {
      const imageUrl = await imageToBase64(file);
      const next = [...mainImages, { imageUrl, alt: newMainAlt.trim() || undefined }];
      setMainImages(next);
      await setMainGalleryImages(next);
      toast({ title: 'Added', description: 'Image uploaded to main gallery' });
      setNewMainAlt('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save image to database.',
        variant: 'destructive',
      });
    } finally {
      setUploadingMain(false);
      if (mainFileInputRef.current) mainFileInputRef.current.value = '';
    }
  };

  const handleRemoveMain = async (index: number) => {
    const next = mainImages.filter((_, i) => i !== index);
    setMainImages(next);
    setMainDeleteIndex(null);
    try {
      await setMainGalleryImages(next);
      toast({ title: 'Removed', description: 'Image removed from gallery' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove', variant: 'destructive' });
    }
  };

  const handleAddInteriorByUrl = async () => {
    const url = newInteriorUrl.trim();
    if (!url) {
      toast({ title: 'Validation', description: 'Image URL is required', variant: 'destructive' });
      return;
    }
    setAddingInterior(true);
    try {
      const next = [...interiorImages, { imageUrl: url, alt: newInteriorAlt.trim() || undefined }];
      setInteriorImages(next);
      await setInteriorDesignGallery(next);
      toast({ title: 'Added', description: 'Image added to Interior Design gallery' });
      setNewInteriorUrl('');
      setNewInteriorAlt('');
    } catch {
      toast({ title: 'Error', description: 'Failed to add image', variant: 'destructive' });
    } finally {
      setAddingInterior(false);
    }
  };

  const handleInteriorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      toast({ title: 'Invalid image', description: validation.error, variant: 'destructive' });
      return;
    }
    setUploadingInterior(true);
    try {
      const imageUrl = await imageToBase64(file);
      const next = [...interiorImages, { imageUrl, alt: newInteriorAlt.trim() || undefined }];
      setInteriorImages(next);
      await setInteriorDesignGallery(next);
      toast({ title: 'Added', description: 'Image uploaded to Interior Design gallery' });
      setNewInteriorAlt('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save image to database.',
        variant: 'destructive',
      });
    } finally {
      setUploadingInterior(false);
      if (interiorFileInputRef.current) interiorFileInputRef.current.value = '';
    }
  };

  const handleRemoveInterior = async (index: number) => {
    const next = interiorImages.filter((_, i) => i !== index);
    setInteriorImages(next);
    setInteriorDeleteIndex(null);
    try {
      await setInteriorDesignGallery(next);
      toast({ title: 'Removed', description: 'Image removed from gallery' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove', variant: 'destructive' });
    }
  };

  const handleAddPropertyByUrl = async () => {
    const url = newPropertyUrl.trim();
    if (!url) {
      toast({ title: 'Validation', description: 'Image URL is required', variant: 'destructive' });
      return;
    }
    setAddingProperty(true);
    try {
      const next = [...propertyImages, { imageUrl: url, alt: newPropertyAlt.trim() || undefined }];
      setPropertyImages(next);
      await setPropertyGalleryImages(next);
      toast({ title: 'Added', description: 'Image added to Property gallery' });
      setNewPropertyUrl('');
      setNewPropertyAlt('');
    } catch {
      toast({ title: 'Error', description: 'Failed to add image', variant: 'destructive' });
    } finally {
      setAddingProperty(false);
    }
  };

  const handlePropertyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      toast({ title: 'Invalid image', description: validation.error, variant: 'destructive' });
      return;
    }
    setUploadingProperty(true);
    try {
      const imageUrl = await imageToBase64(file);
      const next = [...propertyImages, { imageUrl, alt: newPropertyAlt.trim() || undefined }];
      setPropertyImages(next);
      await setPropertyGalleryImages(next);
      toast({ title: 'Added', description: 'Image uploaded to Property gallery' });
      setNewPropertyAlt('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save image to database.',
        variant: 'destructive',
      });
    } finally {
      setUploadingProperty(false);
      if (propertyFileInputRef.current) propertyFileInputRef.current.value = '';
    }
  };

  const handleRemoveProperty = async (index: number) => {
    const next = propertyImages.filter((_, i) => i !== index);
    setPropertyImages(next);
    setPropertyDeleteIndex(null);
    try {
      await setPropertyGalleryImages(next);
      toast({ title: 'Removed', description: 'Image removed from Property gallery' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove', variant: 'destructive' });
    }
  };

  const handleAdd = async () => {
    const videoId = parseYouTubeVideoId(newUrl);
    if (!videoId) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid YouTube URL (e.g. youtube.com/watch?v=... or youtu.be/...)',
        variant: 'destructive',
      });
      return;
    }
    if (!newTitle.trim()) {
      toast({ title: 'Validation', description: 'Title is required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await addGalleryVideo(newTitle.trim(), videoId);
      toast({ title: 'Success', description: 'Video added to gallery' });
      setNewTitle('');
      setNewUrl('');
      fetchVideos();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add video',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await deleteGalleryVideo(deleteId);
      toast({ title: 'Success', description: 'Video removed' });
      setDeleteId(null);
      fetchVideos();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete video', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gallery Videos</h1>
        <p className="text-muted-foreground">
          Add or remove YouTube videos. They appear on the public Gallery page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Add YouTube Video
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste a YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Title</Label>
            <Input
              id="video-title"
              placeholder="e.g. Property walkthrough"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-url">YouTube URL</Label>
            <Input
              id="video-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Video
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Videos ({videos.length})</CardTitle>
          <p className="text-sm text-muted-foreground">These videos are shown on the Gallery page.</p>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No videos yet. Add one above.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-lg border bg-card overflow-hidden"
                >
                  <div className="aspect-video bg-[#1a1a1a] relative">
                    <iframe
                      title={video.title}
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{video.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => setDeleteId(video.id)}
                      aria-label={`Remove ${video.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Gallery Photos - shown on the public /gallery page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Main Gallery Photos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Photos shown on the main <strong>Gallery</strong> page (/gallery). Add by URL or upload images.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input
                placeholder="https://..."
                value={newMainUrl}
                onChange={(e) => setNewMainUrl(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="space-y-1">
              <Label>Alt text (optional)</Label>
              <Input
                placeholder="e.g. Luxury living room"
                value={newMainAlt}
                onChange={(e) => setNewMainAlt(e.target.value)}
                className="w-48"
              />
            </div>
            <Button onClick={handleAddMainByUrl} disabled={addingMain}>
              {addingMain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add by URL
            </Button>
            <input
              ref={mainFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleMainUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => mainFileInputRef.current?.click()}
              disabled={uploadingMain}
            >
              {uploadingMain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload image
            </Button>
          </div>
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-2">YouTube videos (this section)</h4>
            <div className="flex flex-wrap items-end gap-3 mb-3">
              <Input placeholder="Video title" value={mainVideoTitle} onChange={(e) => setMainVideoTitle(e.target.value)} className="w-48" />
              <Input placeholder="YouTube URL" value={mainVideoUrl} onChange={(e) => setMainVideoUrl(e.target.value)} className="w-64" />
              <Button onClick={() => handleAddSectionVideo('main')} disabled={sectionVideoSubmitting === 'main'}>
                {sectionVideoSubmitting === 'main' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add video
              </Button>
            </div>
            {mainSectionVideos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mainSectionVideos.map((v) => (
                  <div key={v.id} className="rounded-lg border overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <iframe title={v.title} src={`https://www.youtube.com/embed/${v.videoId}`} className="absolute inset-0 w-full h-full" allowFullScreen />
                    </div>
                    <div className="p-2 flex items-center justify-between gap-2">
                      <span className="text-sm truncate">{v.title}</span>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0 h-8 w-8" onClick={() => setSectionVideoDeleteId(v.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {mainLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading…
            </div>
          ) : mainImages.length === 0 ? (
            <p className="text-muted-foreground py-6">No images yet. Add by URL or upload above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mainImages.map((img, i) => (
                <div key={i} className="relative rounded-lg border overflow-hidden bg-muted">
                  <div className="aspect-square">
                    <img src={img.imageUrl} alt={img.alt || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground truncate flex-1">{img.alt || '—'}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive shrink-0 h-8 w-8"
                      onClick={() => setMainDeleteIndex(i)}
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interior Design Gallery - separate from main Gallery page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Interior Design Gallery
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Images and YouTube videos for the <strong>Interior Design</strong> service page. Add photos and videos below; they appear on the Interior Design page (/services/interior-design).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input
                placeholder="https://..."
                value={newInteriorUrl}
                onChange={(e) => setNewInteriorUrl(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="space-y-1">
              <Label>Alt text (optional)</Label>
              <Input
                placeholder="e.g. Modern living room"
                value={newInteriorAlt}
                onChange={(e) => setNewInteriorAlt(e.target.value)}
                className="w-48"
              />
            </div>
            <Button onClick={handleAddInteriorByUrl} disabled={addingInterior}>
              {addingInterior ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add by URL
            </Button>
            <input
              ref={interiorFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleInteriorUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => interiorFileInputRef.current?.click()}
              disabled={uploadingInterior}
            >
              {uploadingInterior ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload image
            </Button>
          </div>
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-1">YouTube videos</h4>
            <p className="text-xs text-muted-foreground mb-2">Shown in the gallery on the Interior Design service page. Paste a YouTube URL and click Add video.</p>
            <div className="flex flex-wrap items-end gap-3 mb-3">
              <Input placeholder="Video title" value={interiorVideoTitle} onChange={(e) => setInteriorVideoTitle(e.target.value)} className="w-48" />
              <Input placeholder="https://www.youtube.com/watch?v=..." value={interiorVideoUrl} onChange={(e) => setInteriorVideoUrl(e.target.value)} className="w-64" />
              <Button onClick={() => handleAddSectionVideo('interior')} disabled={sectionVideoSubmitting === 'interior'}>
                {sectionVideoSubmitting === 'interior' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add video
              </Button>
            </div>
            {interiorSectionVideos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interiorSectionVideos.map((v) => (
                  <div key={v.id} className="rounded-lg border overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <iframe title={v.title} src={`https://www.youtube.com/embed/${v.videoId}`} className="absolute inset-0 w-full h-full" allowFullScreen />
                    </div>
                    <div className="p-2 flex items-center justify-between gap-2">
                      <span className="text-sm truncate">{v.title}</span>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0 h-8 w-8" onClick={() => setSectionVideoDeleteId(v.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {interiorLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading…
            </div>
          ) : interiorImages.length === 0 ? (
            <p className="text-muted-foreground py-6">No images yet. Add by URL or upload above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {interiorImages.map((img, i) => (
                <div key={i} className="relative rounded-lg border overflow-hidden bg-muted">
                  <div className="aspect-[4/3]">
                    <img src={img.imageUrl} alt={img.alt || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground truncate flex-1">{img.alt || '—'}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive shrink-0 h-8 w-8"
                      onClick={() => setInteriorDeleteIndex(i)}
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Gallery - separate section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Property Gallery
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Images and YouTube videos for the <strong>Property Promotions</strong> service page. Add photos and videos below; they appear on the Property Promotions page (/services/property-promotions).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input
                placeholder="https://..."
                value={newPropertyUrl}
                onChange={(e) => setNewPropertyUrl(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="space-y-1">
              <Label>Alt text (optional)</Label>
              <Input
                placeholder="e.g. Property exterior"
                value={newPropertyAlt}
                onChange={(e) => setNewPropertyAlt(e.target.value)}
                className="w-48"
              />
            </div>
            <Button onClick={handleAddPropertyByUrl} disabled={addingProperty}>
              {addingProperty ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add by URL
            </Button>
            <input
              ref={propertyFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePropertyUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => propertyFileInputRef.current?.click()}
              disabled={uploadingProperty}
            >
              {uploadingProperty ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload image
            </Button>
          </div>
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-1">YouTube videos</h4>
            <p className="text-xs text-muted-foreground mb-2">Shown in the gallery on the Property Promotions service page. Paste a YouTube URL and click Add video.</p>
            <div className="flex flex-wrap items-end gap-3 mb-3">
              <Input placeholder="Video title" value={propertyVideoTitle} onChange={(e) => setPropertyVideoTitle(e.target.value)} className="w-48" />
              <Input placeholder="https://www.youtube.com/watch?v=..." value={propertyVideoUrl} onChange={(e) => setPropertyVideoUrl(e.target.value)} className="w-64" />
              <Button onClick={() => handleAddSectionVideo('property')} disabled={sectionVideoSubmitting === 'property'}>
                {sectionVideoSubmitting === 'property' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add video
              </Button>
            </div>
            {propertySectionVideos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propertySectionVideos.map((v) => (
                  <div key={v.id} className="rounded-lg border overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <iframe title={v.title} src={`https://www.youtube.com/embed/${v.videoId}`} className="absolute inset-0 w-full h-full" allowFullScreen />
                    </div>
                    <div className="p-2 flex items-center justify-between gap-2">
                      <span className="text-sm truncate">{v.title}</span>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0 h-8 w-8" onClick={() => setSectionVideoDeleteId(v.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {propertyLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading…
            </div>
          ) : propertyImages.length === 0 ? (
            <p className="text-muted-foreground py-6">No images yet. Add by URL or upload above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {propertyImages.map((img, i) => (
                <div key={i} className="relative rounded-lg border overflow-hidden bg-muted">
                  <div className="aspect-square">
                    <img src={img.imageUrl} alt={img.alt || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground truncate flex-1">{img.alt || '—'}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive shrink-0 h-8 w-8"
                      onClick={() => setPropertyDeleteIndex(i)}
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove video?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the video from the Gallery page. You can add it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={interiorDeleteIndex !== null} onOpenChange={(open) => !open && setInteriorDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this image?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the Interior Design page gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => interiorDeleteIndex !== null && handleRemoveInterior(interiorDeleteIndex)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={mainDeleteIndex !== null} onOpenChange={(open) => !open && setMainDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this image?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the main Gallery page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mainDeleteIndex !== null && handleRemoveMain(mainDeleteIndex)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={propertyDeleteIndex !== null} onOpenChange={(open) => !open && setPropertyDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this image?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the Property gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => propertyDeleteIndex !== null && handleRemoveProperty(propertyDeleteIndex)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!sectionVideoDeleteId} onOpenChange={(open) => !open && setSectionVideoDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this video?</AlertDialogTitle>
            <AlertDialogDescription>
              This YouTube video will be removed from the gallery section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteSectionVideo}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

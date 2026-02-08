import { useState, useEffect } from 'react';
import { BarChart3, Building2, Plus, Trash2, Loader2, Sparkles, Youtube } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  getStats,
  setStats,
  getServiceHighlights,
  setServiceHighlights,
  getYoutubeVideos,
  setYoutubeVideos,
  type StatItem,
  type ServiceHighlightKey,
  type YouTubeVideoItem,
} from '@/services/siteSettingsService';
import {
  getPropertyTypesFromFirestore,
  getDefaultPropertyTypes,
  addPropertyType,
  deletePropertyType,
  seedDefaultPropertyTypes,
  type PropertyTypeOption,
} from '@/services/propertyTypeService';

export default function AdminSiteContent() {
  const { toast } = useToast();
  const [stats, setStatsState] = useState<StatItem[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeOption[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [savingStats, setSavingStats] = useState(false);
  const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null);
  const [newTypeValue, setNewTypeValue] = useState('');
  const [newTypeLabel, setNewTypeLabel] = useState('');
  const [newTypeIcon, setNewTypeIcon] = useState('🏠');
  const [addingType, setAddingType] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [highlightsKey, setHighlightsKey] = useState<ServiceHighlightKey>('homeLoans');
  const [highlights, setHighlightsState] = useState<StatItem[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState(true);
  const [savingHighlights, setSavingHighlights] = useState(false);
  const [youtubeVideos, setYoutubeVideosState] = useState<YouTubeVideoItem[]>([]);
  const [loadingYoutube, setLoadingYoutube] = useState(true);
  const [savingYoutube, setSavingYoutube] = useState(false);
  const [newYoutubeId, setNewYoutubeId] = useState('');
  const [newYoutubeTitle, setNewYoutubeTitle] = useState('');
  const [addingYoutube, setAddingYoutube] = useState(false);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getStats();
      setStatsState(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load stats', variant: 'destructive' });
    } finally {
      setLoadingStats(false);
    }
  };

  const loadPropertyTypes = async () => {
    setLoadingTypes(true);
    try {
      const fromFirestore = await getPropertyTypesFromFirestore();
      setPropertyTypes(fromFirestore.length > 0 ? fromFirestore : getDefaultPropertyTypes());
    } catch {
      toast({ title: 'Error', description: 'Failed to load property types', variant: 'destructive' });
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const count = await seedDefaultPropertyTypes();
      if (count > 0) {
        toast({ title: 'Seeded', description: `${count} default property types added` });
        loadPropertyTypes();
      } else {
        toast({ title: 'Already set', description: 'Property types already exist' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to seed', variant: 'destructive' });
    } finally {
      setSeeding(false);
    }
  };

  const loadHighlights = async (key: ServiceHighlightKey) => {
    setLoadingHighlights(true);
    try {
      const data = await getServiceHighlights(key);
      setHighlightsState(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load highlights', variant: 'destructive' });
    } finally {
      setLoadingHighlights(false);
    }
  };

  useEffect(() => {
    loadHighlights(highlightsKey);
  }, [highlightsKey]);

  const loadYoutubeVideos = async () => {
    setLoadingYoutube(true);
    try {
      const data = await getYoutubeVideos();
      setYoutubeVideosState(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load YouTube videos', variant: 'destructive' });
    } finally {
      setLoadingYoutube(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadPropertyTypes();
    loadYoutubeVideos();
  }, []);

  const handleSaveStats = async () => {
    if (stats.length === 0) return;
    setSavingStats(true);
    try {
      await setStats(stats);
      toast({ title: 'Saved', description: 'Stats updated successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save stats', variant: 'destructive' });
    } finally {
      setSavingStats(false);
    }
  };

  const handleSaveHighlights = async () => {
    if (highlights.length === 0) return;
    setSavingHighlights(true);
    try {
      await setServiceHighlights(highlightsKey, highlights);
      toast({ title: 'Saved', description: 'Service highlights updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save highlights', variant: 'destructive' });
    } finally {
      setSavingHighlights(false);
    }
  };

  function parseYoutubeVideoId(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;
    const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    return null;
  }

  const handleAddYoutubeVideo = async () => {
    const videoId = parseYoutubeVideoId(newYoutubeId);
    if (!videoId) {
      toast({
        title: 'Invalid video',
        description: 'Paste a YouTube URL (e.g. youtube.com/watch?v=...) or an 11-character video ID',
        variant: 'destructive',
      });
      return;
    }
    if (youtubeVideos.some((v) => v.videoId === videoId)) {
      toast({ title: 'Duplicate', description: 'This video is already in the list', variant: 'destructive' });
      return;
    }
    setAddingYoutube(true);
    try {
      const next = [...youtubeVideos, { videoId, title: newYoutubeTitle.trim() || undefined }];
      setYoutubeVideosState(next);
      await setYoutubeVideos(next);
      toast({ title: 'Added', description: 'Video added to home page section' });
      setNewYoutubeId('');
      setNewYoutubeTitle('');
    } catch {
      toast({ title: 'Error', description: 'Failed to add video', variant: 'destructive' });
    } finally {
      setAddingYoutube(false);
    }
  };

  const handleRemoveYoutubeVideo = async (index: number) => {
    const next = youtubeVideos.filter((_, i) => i !== index);
    setYoutubeVideosState(next);
    try {
      await setYoutubeVideos(next);
      toast({ title: 'Removed', description: 'Video removed from section' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove', variant: 'destructive' });
    }
  };

  const handleSaveYoutubeVideos = async () => {
    setSavingYoutube(true);
    try {
      await setYoutubeVideos(youtubeVideos);
      toast({ title: 'Saved', description: 'YouTube section updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    } finally {
      setSavingYoutube(false);
    }
  };

  const handleAddType = async () => {
    const value = newTypeValue.trim().toLowerCase().replace(/\s+/g, '-');
    const label = newTypeLabel.trim();
    if (!value || !label) {
      toast({ title: 'Validation', description: 'Value and label are required', variant: 'destructive' });
      return;
    }
    if (propertyTypes.some((t) => t.value === value)) {
      toast({ title: 'Duplicate', description: 'This property type already exists', variant: 'destructive' });
      return;
    }
    setAddingType(true);
    try {
      await addPropertyType({ value, label, icon: newTypeIcon.trim() || '🏠' });
      toast({ title: 'Added', description: 'Property type added' });
      setNewTypeValue('');
      setNewTypeLabel('');
      setNewTypeIcon('🏠');
      loadPropertyTypes();
    } catch {
      toast({ title: 'Error', description: 'Failed to add property type', variant: 'destructive' });
    } finally {
      setAddingType(false);
    }
  };

  const handleDeleteType = async () => {
    if (!deleteTypeId) return;
    try {
      await deletePropertyType(deleteTypeId);
      toast({ title: 'Removed', description: 'Property type removed' });
      setDeleteTypeId(null);
      loadPropertyTypes();
    } catch {
      toast({ title: 'Error', description: 'Failed to remove property type', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Site Content</h1>
        <p className="text-muted-foreground">Edit stats shown on the site and manage property types</p>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Stats (About page & elsewhere)
          </CardTitle>
          <CardDescription>
            Edit the counts and labels shown e.g. &quot;500+ Properties Listed&quot;, &quot;1000+ Happy Clients&quot;
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingStats ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border p-3">
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const next = [...stats];
                        next[i] = { ...next[i], value: e.target.value };
                        setStatsState(next);
                      }}
                      placeholder="e.g. 500+"
                      className="max-w-[120px]"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const next = [...stats];
                        next[i] = { ...next[i], label: e.target.value };
                        setStatsState(next);
                      }}
                      placeholder="Label"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveStats} disabled={savingStats}>
                {savingStats ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save stats
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Service page highlights (Home Loans, Interior Design, Property Promotions) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Service page highlights
          </CardTitle>
          <CardDescription>
            Edit the quick stats shown on Home Loans, Interior Design, and Property Promotions pages (value + label per card).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 border-b pb-2">
            {(['homeLoans', 'interiorDesign', 'propertyPromotions'] as const).map((key) => (
              <Button
                key={key}
                variant={highlightsKey === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHighlightsKey(key)}
              >
                {key === 'homeLoans' ? 'Home Loans' : key === 'interiorDesign' ? 'Interior Design' : 'Property Promotions'}
              </Button>
            ))}
          </div>
          {loadingHighlights ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border p-3">
                    <Input
                      value={item.value}
                      onChange={(e) => {
                        const next = [...highlights];
                        next[i] = { ...next[i], value: e.target.value };
                        setHighlightsState(next);
                      }}
                      placeholder="Value (e.g. 6+)"
                      className="max-w-[120px]"
                    />
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const next = [...highlights];
                        next[i] = { ...next[i], label: e.target.value };
                        setHighlightsState(next);
                      }}
                      placeholder="Label"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveHighlights} disabled={savingHighlights}>
                {savingHighlights ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save highlights
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* YouTube channel (home page section) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5" />
            YouTube channel (home page)
          </CardTitle>
          <CardDescription>
            Videos from <a href="https://www.youtube.com/@Housesadda" target="_blank" rel="noopener noreferrer" className="text-primary underline">youtube.com/@Housesadda</a>. Add video ID or paste full URL. Clicking a video on the site opens it on YouTube; visitors can go to your channel from the section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="youtube-video-id">Video URL or ID</Label>
              <Input
                id="youtube-video-id"
                value={newYoutubeId}
                onChange={(e) => setNewYoutubeId(e.target.value)}
                placeholder="youtube.com/watch?v=... or video ID"
                className="w-[280px]"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="youtube-video-title">Title (optional)</Label>
              <Input
                id="youtube-video-title"
                value={newYoutubeTitle}
                onChange={(e) => setNewYoutubeTitle(e.target.value)}
                placeholder="Video title"
                className="w-[200px]"
              />
            </div>
            <Button onClick={handleAddYoutubeVideo} disabled={addingYoutube}>
              {addingYoutube ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              Add video
            </Button>
          </div>
          {loadingYoutube ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : youtubeVideos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No videos yet. Add videos above to show them on the home page.</p>
          ) : (
            <>
              <div className="rounded-lg border divide-y">
                {youtubeVideos.map((v, i) => (
                  <div key={`${v.videoId}-${i}`} className="flex items-center gap-4 px-4 py-3">
                    <img
                      src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                      alt=""
                      className="w-24 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{v.title || `Video ${v.videoId}`}</p>
                      <p className="text-xs text-muted-foreground">{v.videoId}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveYoutubeVideo(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveYoutubeVideos} disabled={savingYoutube}>
                {savingYoutube ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save order
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Property Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property types
          </CardTitle>
          <CardDescription>
            Add or remove property types used in filters, hero, and add property form. Value is used in URLs (e.g. apartment, villa).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Input
              value={newTypeValue}
              onChange={(e) => setNewTypeValue(e.target.value)}
              placeholder="Value (e.g. apartment)"
              className="w-[160px]"
            />
            <Input
              value={newTypeLabel}
              onChange={(e) => setNewTypeLabel(e.target.value)}
              placeholder="Label (e.g. Apartment)"
              className="w-[160px]"
            />
            <Input
              value={newTypeIcon}
              onChange={(e) => setNewTypeIcon(e.target.value)}
              placeholder="Icon (emoji)"
              className="w-[80px]"
            />
            <Button onClick={handleAddType} disabled={addingType}>
              {addingType ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              Add type
            </Button>
          </div>

          {!loadingTypes && propertyTypes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No property types in database. Add one above or seed defaults.
            </p>
          )}
          {!loadingTypes && propertyTypes.length > 0 && propertyTypes.some((t) => !t.id) && (
            <Button variant="outline" size="sm" onClick={handleSeedDefaults} disabled={seeding}>
              {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Seed default property types
            </Button>
          )}
          {loadingTypes ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <div className="rounded-lg border">
              <div className="grid gap-0 divide-y">
                {propertyTypes.map((t) => (
                  <div
                    key={t.id ?? t.value}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <span className="font-medium">{t.label}</span>
                      <span className="text-sm text-muted-foreground">{t.value}</span>
                    </div>
                    {t.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTypeId(t.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Default (add in Firestore to delete)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTypeId} onOpenChange={(open) => !open && setDeleteTypeId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Remove property type?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the type from filters and dropdowns. Existing properties with this type will keep it but the label may show as the value.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteType} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

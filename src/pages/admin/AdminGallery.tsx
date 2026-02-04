import { useState, useEffect } from 'react';
import { Video, Plus, Trash2, Loader2 } from 'lucide-react';
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

export default function AdminGallery() {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const { toast } = useToast();

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

  useEffect(() => {
    fetchVideos();
  }, []);

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
    </div>
  );
}

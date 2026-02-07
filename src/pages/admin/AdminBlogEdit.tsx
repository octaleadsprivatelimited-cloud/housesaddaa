import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getBlogById, createBlog, updateBlog } from '@/services/blogService';
import { imageToBase64, validateImage } from '@/services/imageService';

function slugFromTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getBlogById(id)
      .then((post) => {
        if (cancelled || !post) return;
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setImageUrl(post.imageUrl ?? '');
        setAuthor(post.author ?? '');
        setIsPublished(post.isPublished);
      })
      .catch(() => {
        if (!cancelled) toast({ title: 'Error', description: 'Failed to load post', variant: 'destructive' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, toast]);

  const handleTitleBlur = () => {
    if (!slug.trim() && title.trim()) setSlug(slugFromTitle(title));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      toast({ title: 'Invalid image', description: validation.error, variant: 'destructive' });
      return;
    }
    setUploadingImage(true);
    try {
      const dataUrl = await imageToBase64(file);
      setImageUrl(dataUrl);
      toast({ title: 'Image added', description: 'You can save the post to keep it.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to process image', variant: 'destructive' });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: 'Validation', description: 'Title is required', variant: 'destructive' });
      return;
    }
    const finalSlug = (slug || slugFromTitle(title)).trim();
    if (!finalSlug) {
      toast({ title: 'Validation', description: 'Slug is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateBlog(id, {
          title: title.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || undefined,
          author: author.trim() || undefined,
          isPublished,
        });
        toast({ title: 'Saved', description: 'Post updated' });
        navigate('/admin/blog');
      } else {
        await createBlog({
          title: title.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim() || undefined,
          author: author.trim() || undefined,
          isPublished,
        });
        toast({ title: 'Created', description: 'Post added' });
        navigate('/admin/blog');
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/blog">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? 'Edit post' : 'Add post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Post details</CardTitle>
            <CardDescription>
              Title and slug are required. Slug is used in the URL (e.g. /blog/your-slug).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Post title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
              />
              <p className="text-xs text-muted-foreground">Leave empty to generate from title.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary for listing"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full post content (plain text or HTML)"
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Featured image</Label>
              {imageUrl ? (
                <div className="space-y-2">
                  <div className="relative inline-block rounded-lg overflow-hidden border bg-muted max-w-sm">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-48 w-auto object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Remove above or upload a different image.</p>
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload image
                </Button>
                <span className="text-sm text-muted-foreground">JPEG, PNG, WebP or GIF, max 5MB</span>
              </div>
              <div className="pt-1">
                <Label htmlFor="imageUrl" className="text-muted-foreground text-xs">Or paste image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isPublished"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="isPublished">Published (visible on public blog)</Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isEdit ? 'Save changes' : 'Create post'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/blog">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

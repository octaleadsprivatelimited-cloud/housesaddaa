import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import type { BlogPost } from '@/services/blogService';
import {
  getBlogPostsAdmin,
  deleteBlog,
} from '@/services/blogService';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

const PAGE_SIZE = 10;

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const loadPage = useCallback(async (cursor: QueryDocumentSnapshot | null) => {
    if (cursor) setLoadingMore(true);
    else setLoading(true);
    try {
      const { posts: next, lastDoc: nextLast } = await getBlogPostsAdmin({
        pageSize: PAGE_SIZE,
        startAfterDoc: cursor,
      });
      if (cursor) {
        setPosts((prev) => [...prev, ...next]);
      } else {
        setPosts(next);
      }
      setLastDoc(nextLast);
    } catch {
      toast({ title: 'Error', description: 'Failed to load posts', variant: 'destructive' });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPage(null);
  }, [loadPage]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteId);
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      toast({ title: 'Deleted', description: 'Blog post removed' });
      setDeleteId(null);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground">Manage blog posts. Add or edit from below.</p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/add">
            <Plus className="h-4 w-4 mr-2" />
            Add post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Posts
          </CardTitle>
          <CardDescription>
            Only published posts appear on the public blog. Paginated to reduce Firebase reads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading…
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground py-8">No posts yet. Add one to get started.</p>
          ) : (
            <>
              <ul className="divide-y">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-4 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{p.title}</span>
                        {!p.isPublished && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">{p.excerpt || p.slug}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/blog/edit/${p.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {lastDoc && (
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => loadPage(lastDoc)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. The post will be removed from the blog.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

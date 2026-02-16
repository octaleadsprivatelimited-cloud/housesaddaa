import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { getBlogBySlug } from '@/services/blogService';
import { Button } from '@/components/ui/button';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Awaited<ReturnType<typeof getBlogBySlug>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getBlogBySlug(slug)
      .then((p) => {
        if (!cancelled) setPost(p);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-8" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt || undefined}
        url={`/blog/${post.slug}`}
        image={post.imageUrl}
      />
      <div className="min-h-screen bg-background">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Blog
              </Link>
            </Button>
            <article>
              {post.imageUrl && (
                <div className="rounded-xl overflow-hidden mb-6 aspect-video bg-muted">
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
                {post.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                )}
              </div>
              {post.excerpt && (
                <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
              )}
              <div
                className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:mb-3 prose-headings:mt-6 first:prose-headings:mt-0"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const c = post.content?.trim() ?? '';
                    if (!c) return '';
                    if (/<[a-z][\s\S]*>/i.test(c)) return c;
                    const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return c
                      .split(/\n\n+/)
                      .map((p) => `<p class="mb-4">${escape(p).replace(/\n/g, '<br />')}</p>`)
                      .join('');
                  })(),
                }}
              />
            </article>
          </div>
        </div>
      </div>
    </>
  );
}

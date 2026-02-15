import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Loader2, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { getBlogPosts } from '@/services/blogService';
import type { BlogPost } from '@/services/blogService';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

const PAGE_SIZE = 10;

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(async (cursor: QueryDocumentSnapshot | null) => {
    if (cursor) setLoadingMore(true);
    else setLoading(true);
    try {
      const { posts: next, lastDoc: nextLast } = await getBlogPosts({
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
      // keep previous state on error
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPage(null);
  }, [loadPage]);

  return (
    <>
      <SEO
        title="Blog"
        description="Latest insights, tips, and news about real estate in India. Stay updated with market trends, buying guides, and expert advice from Houses Adda."
        url="/blog"
      />
      <div className="min-h-screen bg-background">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Latest insights, tips, and news about real estate in India.
            </p>

            {/* Contact form CTA */}
            <div className="mb-12 rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg mb-1">Have questions or want to get in touch?</h2>
                  <p className="text-sm text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                </div>
              </div>
              <Button asChild className="shrink-0 w-full sm:w-auto">
                <Link to="/contact-form">
                  Contact us
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-12">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading…
              </div>
            ) : posts.length === 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3">No posts yet</h2>
                  <p className="text-muted-foreground mb-4">
                    Check back soon for real estate news, market insights, and expert tips.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/properties">Browse Properties</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="border rounded-lg overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      {post.imageUrl && (
                        <div className="aspect-video bg-muted">
                          <img
                            src={post.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-2 hover:text-primary">
                          {post.title}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
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
                          <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
                {lastDoc && (
                  <div className="flex justify-center pt-4">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

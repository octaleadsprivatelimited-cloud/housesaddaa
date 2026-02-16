import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const BLOGS_COLLECTION = 'blogs';
const PAGE_SIZE = 10;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
  createdAt: Date;
  isPublished: boolean;
}

function docToBlog(d: DocumentSnapshot): BlogPost {
  const data = d.data();
  if (!data) throw new Error('Missing blog data');
  return {
    id: d.id,
    title: data.title ?? '',
    slug: data.slug ?? '',
    excerpt: data.excerpt ?? '',
    content: data.content ?? '',
    imageUrl: data.imageUrl,
    author: data.author,
    publishedAt: data.publishedAt?.toDate() ?? new Date(),
    createdAt: data.createdAt?.toDate() ?? new Date(),
    isPublished: data.isPublished !== false,
  };
}

/** Public: get published posts. Fetches and filters in memory so no composite index is required. */
export async function getBlogPosts(opts: {
  pageSize?: number;
  startAfterDoc?: QueryDocumentSnapshot | null;
}): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null }> {
  const pageSize = opts.pageSize ?? PAGE_SIZE;
  const snapshot = await getDocs(collection(db, BLOGS_COLLECTION));
  const all = snapshot.docs.map((d) => docToBlog(d));
  const published = all.filter((p) => p.isPublished).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  const lastId = opts.startAfterDoc?.id;
  const start = lastId ? published.findIndex((p) => p.id === lastId) + 1 : 0;
  const slice = published.slice(start, start + pageSize);
  const hasMore = published.length > start + slice.length;
  const lastDoc = hasMore && slice.length > 0
    ? snapshot.docs.find((d) => d.id === slice[slice.length - 1].id) ?? null
    : null;
  return { posts: slice, lastDoc };
}

/** Public: get single post by slug. Fetches and filters in memory so no composite index is required. */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const snapshot = await getDocs(collection(db, BLOGS_COLLECTION));
  const post = snapshot.docs.map((d) => docToBlog(d)).find((p) => p.slug === slug && p.isPublished) ?? null;
  return post;
}

/** Admin: list all posts (paginated) */
export async function getBlogPostsAdmin(opts: {
  pageSize?: number;
  startAfterDoc?: QueryDocumentSnapshot | null;
}): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null }> {
  const pageSize = opts.pageSize ?? PAGE_SIZE;
  const constraints = [orderBy('createdAt', 'desc'), limit(pageSize + 1)];
  if (opts.startAfterDoc) constraints.push(startAfter(opts.startAfterDoc));
  const snapshot = await getDocs(query(collection(db, BLOGS_COLLECTION), ...constraints));
  const docs = snapshot.docs;
  const hasMore = docs.length > pageSize;
  const useDocs = hasMore ? docs.slice(0, pageSize) : docs;
  const list = useDocs.map((d) => docToBlog(d));
  return { posts: list, lastDoc: hasMore ? useDocs[useDocs.length - 1] : null };
}

/** Admin: get by id */
export async function getBlogById(id: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, BLOGS_COLLECTION, id));
  if (!snap.exists()) return null;
  return docToBlog(snap);
}

/** Admin: create */
export async function createBlog(data: Omit<BlogPost, 'id' | 'createdAt' | 'publishedAt'> & { publishedAt?: Date }): Promise<string> {
  const ref = await addDoc(collection(db, BLOGS_COLLECTION), {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? '',
    content: data.content ?? '',
    imageUrl: data.imageUrl ?? null,
    author: data.author ?? null,
    isPublished: data.isPublished === true,
    publishedAt: data.publishedAt ? Timestamp.fromDate(data.publishedAt) : Timestamp.now(),
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

/** Admin: update */
export async function updateBlog(id: string, data: Partial<Pick<BlogPost, 'title' | 'slug' | 'excerpt' | 'content' | 'imageUrl' | 'author' | 'isPublished' | 'publishedAt'>>): Promise<void> {
  const payload: Record<string, unknown> = { ...data };
  if (data.publishedAt) payload.publishedAt = Timestamp.fromDate(data.publishedAt);
  await updateDoc(doc(db, BLOGS_COLLECTION, id), payload);
}

/** Admin: delete */
export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, BLOGS_COLLECTION, id));
}

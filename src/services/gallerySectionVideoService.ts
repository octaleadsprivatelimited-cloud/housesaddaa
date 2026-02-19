import { collection, getDocs, addDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { parseYouTubeVideoId } from '@/services/galleryVideoService';

const COLLECTION = 'gallerySectionVideos';

export type GallerySectionKey = 'main' | 'interior' | 'property';

export interface GallerySectionVideo {
  id: string;
  section: GallerySectionKey;
  title: string;
  videoId: string;
  order: number;
  createdAt: Date;
}

function docToVideo(id: string, data: Record<string, unknown>): GallerySectionVideo {
  const createdAt = data.createdAt as { toDate?: () => Date } | undefined;
  return {
    id,
    section: (data.section as GallerySectionKey) || 'main',
    title: (data.title as string) || '',
    videoId: (data.videoId as string) || '',
    order: (data.order as number) ?? 0,
    createdAt: typeof createdAt?.toDate === 'function' ? createdAt.toDate() : new Date(),
  };
}

export async function getGallerySectionVideos(section: GallerySectionKey): Promise<GallerySectionVideo[]> {
  const q = query(collection(db, COLLECTION), where('section', '==', section));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((d) => docToVideo(d.id, d.data()));
  list.sort((a, b) => a.order - b.order);
  return list;
}

export async function addGallerySectionVideo(
  section: GallerySectionKey,
  title: string,
  urlOrVideoId: string
): Promise<string> {
  const videoId = parseYouTubeVideoId(urlOrVideoId) || urlOrVideoId.trim();
  if (!videoId || videoId.length !== 11) {
    throw new Error('Please enter a valid YouTube URL or video ID.');
  }
  const existing = await getGallerySectionVideos(section);
  const order = existing.length;
  const ref = await addDoc(collection(db, COLLECTION), {
    section,
    title: title.trim(),
    videoId,
    order,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function deleteGallerySectionVideo(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

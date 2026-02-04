import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GalleryVideo } from '@/types/property';

const GALLERY_VIDEOS_COLLECTION = 'galleryVideos';

function docToGalleryVideo(docSnap: DocumentSnapshot): GalleryVideo {
  const data = docSnap.data();
  if (!data) throw new Error('Document data is undefined');
  return {
    ...data,
    id: docSnap.id,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as GalleryVideo;
}

/** Extract YouTube video ID from URL (watch, youtu.be, or embed) */
export function parseYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  const snapshot = await getDocs(collection(db, GALLERY_VIDEOS_COLLECTION));
  const list = snapshot.docs.map(docToGalleryVideo);
  list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.createdAt.getTime() - b.createdAt.getTime());
  return list;
}

export async function addGalleryVideo(title: string, videoId: string): Promise<string> {
  const videos = await getGalleryVideos();
  const order = videos.length;
  const docRef = await addDoc(collection(db, GALLERY_VIDEOS_COLLECTION), {
    title: title.trim(),
    videoId,
    order,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteGalleryVideo(id: string): Promise<void> {
  await deleteDoc(doc(db, GALLERY_VIDEOS_COLLECTION, id));
}

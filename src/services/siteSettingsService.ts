import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SITE_SETTINGS_COLLECTION = 'siteSettings';
const STATS_DOC_ID = 'stats';

export interface StatItem {
  value: string;
  label: string;
}

const defaultStats: StatItem[] = [
  { value: '500+', label: 'Properties Listed' },
  { value: '1000+', label: 'Happy Clients' },
  { value: '50+', label: 'Locations' },
  { value: '24/7', label: 'Support' },
];

export async function getStats(): Promise<StatItem[]> {
  try {
    const ref = doc(db, SITE_SETTINGS_COLLECTION, STATS_DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists() && Array.isArray(snap.data()?.items)) {
      return snap.data().items as StatItem[];
    }
  } catch (e) {
    console.error('getStats error', e);
  }
  return defaultStats;
}

export async function setStats(items: StatItem[]): Promise<void> {
  const ref = doc(db, SITE_SETTINGS_COLLECTION, STATS_DOC_ID);
  await setDoc(ref, { items });
}

// Service page quick highlights (Home Loans, Interior Design, Property Promotions)
export type ServiceHighlightKey = 'homeLoans' | 'interiorDesign' | 'propertyPromotions';

const defaultServiceHighlights: Record<ServiceHighlightKey, StatItem[]> = {
  homeLoans: [
    { value: '6+', label: 'Partner Banks' },
    { value: 'Best', label: 'Interest Rates' },
    { value: 'Quick', label: 'Processing' },
    { value: '0', label: 'Hidden Charges' },
  ],
  interiorDesign: [
    { value: '6+', label: 'Design Services' },
    { value: '4-Step', label: 'Proven Process' },
    { value: '3D', label: 'Visualizations' },
    { value: 'End-to-End', label: 'Execution' },
  ],
  propertyPromotions: [
    { value: 'Digital +', label: 'Offline Reach' },
    { value: 'Targeted', label: 'Audience' },
    { value: 'Quick', label: 'Listing Setup' },
    { value: 'Max', label: 'Visibility' },
  ],
};

export async function getServiceHighlights(key: ServiceHighlightKey): Promise<StatItem[]> {
  try {
    const ref = doc(db, SITE_SETTINGS_COLLECTION, `highlights_${key}`);
    const snap = await getDoc(ref);
    if (snap.exists() && Array.isArray(snap.data()?.items)) {
      return snap.data().items as StatItem[];
    }
  } catch (e) {
    console.error('getServiceHighlights error', e);
  }
  return defaultServiceHighlights[key];
}

export async function setServiceHighlights(key: ServiceHighlightKey, items: StatItem[]): Promise<void> {
  const ref = doc(db, SITE_SETTINGS_COLLECTION, `highlights_${key}`);
  await setDoc(ref, { items });
}

// YouTube channel videos (home page section)
export interface YouTubeVideoItem {
  videoId: string;
  title?: string;
}

const YOUTUBE_DOC_ID = 'youtube';

// Default videos from @Housesadda channel – add more from Admin → Site Content → YouTube
const defaultYoutubeVideos: YouTubeVideoItem[] = [
  { videoId: 'FsyIlU2Gl_0' },
  { videoId: 'Latvgu9xuts' },
  { videoId: '_Z1_M42-EXg' },
  { videoId: 'cjHG8mpaHEk' },
  { videoId: 'rrRkQeVOq-k' },
  { videoId: 'y___vn0_E7s' },
];

export async function getYoutubeVideos(): Promise<YouTubeVideoItem[]> {
  try {
    const ref = doc(db, SITE_SETTINGS_COLLECTION, YOUTUBE_DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists() && Array.isArray(snap.data()?.items) && (snap.data()?.items as YouTubeVideoItem[]).length > 0) {
      return snap.data().items as YouTubeVideoItem[];
    }
  } catch (e) {
    console.error('getYoutubeVideos error', e);
  }
  return defaultYoutubeVideos;
}

export async function setYoutubeVideos(items: YouTubeVideoItem[]): Promise<void> {
  const ref = doc(db, SITE_SETTINGS_COLLECTION, YOUTUBE_DOC_ID);
  await setDoc(ref, { items });
}

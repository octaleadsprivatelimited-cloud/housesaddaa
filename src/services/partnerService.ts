import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Partner, PartnerType } from '@/types/property';

const PARTNERS_COLLECTION = 'partners';

const docToPartner = (docSnap: DocumentSnapshot): Partner => {
  const data = docSnap.data();
  if (!data) throw new Error('Document data is undefined');
  return {
    ...data,
    id: docSnap.id,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Partner;
};

export const getPartners = async (type?: PartnerType): Promise<Partner[]> => {
  const q = type
    ? query(collection(db, PARTNERS_COLLECTION), where('type', '==', type))
    : query(collection(db, PARTNERS_COLLECTION));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map(docToPartner);
  list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.createdAt.getTime() - b.createdAt.getTime());
  return list;
};

export const getPartnersByType = async (type: PartnerType): Promise<Partner[]> => {
  const q = query(collection(db, PARTNERS_COLLECTION), where('type', '==', type));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map(docToPartner);
  list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.createdAt.getTime() - b.createdAt.getTime());
  return list;
};

export const addPartner = async (
  type: PartnerType,
  title: string,
  imageUrl: string
): Promise<string> => {
  const partners = await getPartnersByType(type);
  const order = partners.length;
  const docRef = await addDoc(collection(db, PARTNERS_COLLECTION), {
    type,
    title,
    imageUrl,
    order,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updatePartner = async (
  id: string,
  updates: { title?: string; imageUrl?: string; order?: number }
): Promise<void> => {
  const ref = doc(db, PARTNERS_COLLECTION, id);
  await updateDoc(ref, updates as Record<string, unknown>);
};

export const deletePartner = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, PARTNERS_COLLECTION, id));
};

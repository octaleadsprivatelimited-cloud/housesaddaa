import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Enquiry } from "@/types/property";

const ENQUIRIES_COLLECTION = "enquiries";

// Convert Firestore document to Enquiry
const docToEnquiry = (d: DocumentSnapshot): Enquiry => {
  const data = d.data();
  if (!data) throw new Error("Document data is undefined");
  return {
    ...data,
    id: d.id,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Enquiry;
};

/** Payload for new enquiry (all optional except name, email, phone, message for contact form) */
export type EnquiryInput = Partial<Omit<Enquiry, 'id' | 'createdAt' | 'status'>> & {
  name: string;
  email: string;
  phone: string;
  message: string;
};

// Submit new enquiry (public) - accepts new contact form fields and legacy fields
export const submitEnquiry = async (enquiry: EnquiryInput): Promise<string> => {
  const payload: Record<string, unknown> = {
    ...enquiry,
    status: 'new',
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, ENQUIRIES_COLLECTION), payload);
  return docRef.id;
};

// Admin: Get all enquiries
export const getAllEnquiries = async (): Promise<Enquiry[]> => {
  const q = query(
    collection(db, ENQUIRIES_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToEnquiry);
};

// Admin: Get enquiries by property
export const getEnquiriesByProperty = async (propertyId: string): Promise<Enquiry[]> => {
  const q = query(
    collection(db, ENQUIRIES_COLLECTION),
    where("propertyId", "==", propertyId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToEnquiry);
};

// Admin: Update enquiry status
export const updateEnquiryStatus = async (
  id: string, 
  status: 'new' | 'contacted' | 'closed'
): Promise<void> => {
  const docRef = doc(db, ENQUIRIES_COLLECTION, id);
  await updateDoc(docRef, { status });
};

// Admin: Get new enquiries count
export const getNewEnquiriesCount = async (): Promise<number> => {
  const q = query(
    collection(db, ENQUIRIES_COLLECTION),
    where("status", "==", "new")
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

// Admin: Real-time subscription to enquiries (projectType filter applied client-side to avoid composite index)
export const subscribeEnquiries = (
  onUpdate: (enquiries: Enquiry[]) => void,
  projectTypeFilter?: 'residential' | 'commercial'
): (() => void) => {
  const q = query(
    collection(db, ENQUIRIES_COLLECTION),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    let list = snapshot.docs.map((d) => docToEnquiry(d));
    if (projectTypeFilter) {
      list = list.filter((e) => e.projectType === projectTypeFilter);
    }
    onUpdate(list);
  });
};

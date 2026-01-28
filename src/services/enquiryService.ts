import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Enquiry } from "@/types/property";

const ENQUIRIES_COLLECTION = "enquiries";

// Convert Firestore document to Enquiry
const docToEnquiry = (doc: DocumentSnapshot): Enquiry => {
  const data = doc.data();
  if (!data) throw new Error("Document data is undefined");
  
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Enquiry;
};

// Submit new enquiry (public)
export const submitEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  const docRef = await addDoc(collection(db, ENQUIRIES_COLLECTION), {
    ...enquiry,
    status: 'new',
    createdAt: Timestamp.now()
  });
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

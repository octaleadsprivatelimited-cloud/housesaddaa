import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { propertyTypes as defaultPropertyTypes } from '@/data/properties';

const PROPERTY_TYPES_COLLECTION = 'propertyTypes';

export interface PropertyTypeOption {
  id?: string;
  value: string;
  label: string;
  icon: string;
  order: number;
}

export async function getPropertyTypesFromFirestore(): Promise<PropertyTypeOption[]> {
  try {
    const snap = await getDocs(collection(db, PROPERTY_TYPES_COLLECTION));
    if (snap.empty) return [];
    const list = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        value: data.value ?? '',
        label: data.label ?? '',
        icon: data.icon ?? '🏠',
        order: data.order ?? 999,
      };
    });
    list.sort((a, b) => a.order - b.order);
    return list;
  } catch (e) {
    console.error('getPropertyTypesFromFirestore error', e);
    return [];
  }
}

export function getDefaultPropertyTypes(): PropertyTypeOption[] {
  return defaultPropertyTypes.map((t, i) => ({
    value: t.value,
    label: t.label,
    icon: t.icon,
    order: i,
  }));
}

export async function addPropertyType(option: {
  value: string;
  label: string;
  icon: string;
}): Promise<string> {
  const list = await getPropertyTypesFromFirestore();
  const order = list.length > 0 ? Math.max(...list.map((x) => x.order)) + 1 : 0;
  const ref = await addDoc(collection(db, PROPERTY_TYPES_COLLECTION), {
    value: option.value.trim().toLowerCase().replace(/\s+/g, '-'),
    label: option.label.trim(),
    icon: option.icon.trim() || '🏠',
    order,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function deletePropertyType(id: string): Promise<void> {
  await deleteDoc(doc(db, PROPERTY_TYPES_COLLECTION, id));
}

export async function seedDefaultPropertyTypes(): Promise<number> {
  const existing = await getPropertyTypesFromFirestore();
  if (existing.length > 0) return 0;
  const defaults = getDefaultPropertyTypes();
  for (let i = 0; i < defaults.length; i++) {
    await addDoc(collection(db, PROPERTY_TYPES_COLLECTION), {
      ...defaults[i],
      order: i,
      createdAt: Timestamp.now(),
    });
  }
  return defaults.length;
}

export function getPropertyTypeLabel(
  value: string,
  types: PropertyTypeOption[]
): string {
  const t = types.find((x) => x.value === value);
  return t ? t.label : value.replace(/-/g, ' ');
}

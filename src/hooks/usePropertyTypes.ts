import { useQuery } from '@tanstack/react-query';
import {
  getPropertyTypesFromFirestore,
  getDefaultPropertyTypes,
  getPropertyTypeLabel as getLabel,
  type PropertyTypeOption,
} from '@/services/propertyTypeService';

export function usePropertyTypes() {
  const { data: propertyTypes = [], isLoading } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      const fromFirestore = await getPropertyTypesFromFirestore();
      return fromFirestore.length > 0 ? fromFirestore : getDefaultPropertyTypes();
    },
  });

  const getPropertyTypeLabel = (value: string) => getLabel(value, propertyTypes);

  return { propertyTypes, loading: isLoading, getPropertyTypeLabel };
}

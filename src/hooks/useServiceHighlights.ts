import { useQuery } from '@tanstack/react-query';
import {
  getServiceHighlights,
  type ServiceHighlightKey,
} from '@/services/siteSettingsService';

export function useServiceHighlights(key: ServiceHighlightKey) {
  const { data: highlights = [], isLoading } = useQuery({
    queryKey: ['serviceHighlights', key],
    queryFn: () => getServiceHighlights(key),
    staleTime: 5 * 60 * 1000,
  });
  return { highlights, loading: isLoading };
}

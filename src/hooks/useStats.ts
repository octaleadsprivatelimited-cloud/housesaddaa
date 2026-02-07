import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/services/siteSettingsService';

export function useStats() {
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['siteStats'],
    queryFn: getStats,
  });
  return { stats, loading: isLoading };
}

import { useState, useEffect } from 'react';
import { Amenity } from '@/types/property';
import { getAmenities } from '@/services/amenityService';

export function useAmenities(): { amenities: Amenity[]; loading: boolean } {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAmenities().then((data) => {
      if (!cancelled) {
        setAmenities(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { amenities, loading };
}

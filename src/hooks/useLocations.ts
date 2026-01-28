import { useState, useEffect } from 'react';
import { LocationOption } from '@/types/property';
import { getLocations } from '@/services/locationService';

// Default Hyderabad location as fallback
const defaultHyderabadLocation: LocationOption = {
  id: 'default-hyderabad',
  country: 'India',
  state: 'Telangana',
  city: 'Hyderabad',
  areas: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'HITEC City', 'Madhapur', 'Kondapur', 'Kukatpally', 'Miyapur'],
};

export function useLocations() {
  const [locations, setLocations] = useState<LocationOption[]>([defaultHyderabadLocation]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const firestoreLocations = await getLocations();
        if (firestoreLocations.length > 0) {
          setLocations(firestoreLocations);
        } else {
          // Use default Hyderabad location if no data in Firestore
          setLocations([defaultHyderabadLocation]);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
        // Fallback to default
        setLocations([defaultHyderabadLocation]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Get all areas from all locations (flattened)
  const allAreas = locations.flatMap(loc => loc.areas);

  // Get unique cities
  const cities = locations.map(loc => loc.city);

  return { locations, allAreas, cities, loading, error };
}

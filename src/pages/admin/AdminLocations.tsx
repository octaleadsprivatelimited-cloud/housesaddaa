import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { locations } from '@/data/properties';

export default function AdminLocations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Locations</h1>
        <p className="text-muted-foreground">Manage available locations for properties</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                {location.city}, {location.state}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{location.country}</p>
              <div className="flex flex-wrap gap-2">
                {location.areas.map((area) => (
                  <span
                    key={area}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center text-sm">
            Location management with add/edit/delete functionality coming soon.
            <br />
            Currently using predefined locations from the data file.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, X, Loader2, Edit, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { LocationOption } from '@/types/property';
import {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
  addAreaToLocation,
  removeAreaFromLocation,
  seedLocations,
} from '@/services/locationService';

export default function AdminLocations() {
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null);
  const [deleteAreaData, setDeleteAreaData] = useState<{ locationId: string; area: string } | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  // Form states
  const [newLocation, setNewLocation] = useState({
    country: 'India',
    state: '',
    city: '',
    areas: '',
  });
  const [editLocation, setEditLocation] = useState({
    country: '',
    state: '',
    city: '',
  });
  const [newArea, setNewArea] = useState('');

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch locations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedLocations = async () => {
    setSeeding(true);
    try {
      const count = await seedLocations();
      toast({
        title: 'Success',
        description: `${count} locations have been added from static data`,
      });
      fetchLocations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to seed locations',
        variant: 'destructive',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.state.trim() || !newLocation.city.trim()) {
      toast({
        title: 'Validation Error',
        description: 'State and City are required',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const areasArray = newLocation.areas
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      await addLocation({
        country: newLocation.country.trim(),
        state: newLocation.state.trim(),
        city: newLocation.city.trim(),
        areas: areasArray,
      });

      toast({
        title: 'Success',
        description: 'Location added successfully',
      });

      setNewLocation({ country: 'India', state: '', city: '', areas: '' });
      setIsAddLocationOpen(false);
      fetchLocations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add location',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditLocation = async () => {
    if (!editingLocation) return;
    if (!editLocation.state.trim() || !editLocation.city.trim()) {
      toast({
        title: 'Validation Error',
        description: 'State and City are required',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await updateLocation(editingLocation.id, {
        country: editLocation.country.trim(),
        state: editLocation.state.trim(),
        city: editLocation.city.trim(),
      });

      toast({
        title: 'Success',
        description: 'Location updated successfully',
      });

      setIsEditLocationOpen(false);
      setEditingLocation(null);
      fetchLocations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update location',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (location: LocationOption) => {
    setEditingLocation(location);
    setEditLocation({
      country: location.country,
      state: location.state,
      city: location.city,
    });
    setIsEditLocationOpen(true);
  };

  const handleDeleteLocation = async () => {
    if (!deleteLocationId) return;

    setSubmitting(true);
    try {
      await deleteLocation(deleteLocationId);
      toast({
        title: 'Success',
        description: 'Location deleted successfully',
      });
      setDeleteLocationId(null);
      fetchLocations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete location',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddArea = async () => {
    if (!selectedLocationId || !newArea.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Area name is required',
        variant: 'destructive',
      });
      return;
    }

    const location = locations.find(l => l.id === selectedLocationId);
    if (!location) return;

    setSubmitting(true);
    try {
      await addAreaToLocation(selectedLocationId, newArea.trim(), location.areas);
      toast({
        title: 'Success',
        description: 'Area added successfully',
      });
      setNewArea('');
      setIsAddAreaOpen(false);
      setSelectedLocationId(null);
      fetchLocations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add area',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArea = async () => {
    if (!deleteAreaData) return;

    const location = locations.find(l => l.id === deleteAreaData.locationId);
    if (!location) return;

    setSubmitting(true);
    try {
      await removeAreaFromLocation(deleteAreaData.locationId, deleteAreaData.area, location.areas);
      toast({
        title: 'Success',
        description: 'Area removed successfully',
      });
      setDeleteAreaData(null);
      fetchLocations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove area',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openAddAreaDialog = (locationId: string) => {
    setSelectedLocationId(locationId);
    setNewArea('');
    setIsAddAreaOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Locations</h1>
          <p className="text-muted-foreground">Manage available locations for properties</p>
        </div>
        <div className="flex gap-2">
          {locations.length === 0 && (
            <Button variant="outline" onClick={handleSeedLocations} disabled={seeding}>
              {seeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
              Load Default Locations
            </Button>
          )}
          <Button onClick={() => setIsAddLocationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {locations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No locations added yet. Click "Load Default Locations" to import existing locations or "Add Location" to create new ones.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    {location.city}, {location.state}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEditDialog(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteLocationId(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{location.country}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {location.areas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs group"
                    >
                      {area}
                      <button
                        onClick={() => setDeleteAreaData({ locationId: location.id, area })}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => openAddAreaDialog(location.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Area
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Location Dialog */}
      <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Add a new city location where properties are available.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={newLocation.country}
                onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                placeholder="e.g., India"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={newLocation.state}
                onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                placeholder="e.g., Telangana"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={newLocation.city}
                onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                placeholder="e.g., Hyderabad"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areas">Areas (comma-separated)</Label>
              <Input
                id="areas"
                value={newLocation.areas}
                onChange={(e) => setNewLocation({ ...newLocation, areas: e.target.value })}
                placeholder="e.g., Jubilee Hills, Banjara Hills, Gachibowli"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLocation} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update the location details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                value={editLocation.country}
                onChange={(e) => setEditLocation({ ...editLocation, country: e.target.value })}
                placeholder="e.g., India"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-state">State *</Label>
              <Input
                id="edit-state"
                value={editLocation.state}
                onChange={(e) => setEditLocation({ ...editLocation, state: e.target.value })}
                placeholder="e.g., Telangana"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">City *</Label>
              <Input
                id="edit-city"
                value={editLocation.city}
                onChange={(e) => setEditLocation({ ...editLocation, city: e.target.value })}
                placeholder="e.g., Hyderabad"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLocation} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Area Dialog */}
      <Dialog open={isAddAreaOpen} onOpenChange={setIsAddAreaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Area</DialogTitle>
            <DialogDescription>
              Add a new area to the selected location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newArea">Area Name *</Label>
              <Input
                id="newArea"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="e.g., Kondapur"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAreaOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddArea} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Area
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Location Confirmation */}
      <AlertDialog open={!!deleteLocationId} onOpenChange={() => setDeleteLocationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
              All areas within this location will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLocation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Area Confirmation */}
      <AlertDialog open={!!deleteAreaData} onOpenChange={() => setDeleteAreaData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Area</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{deleteAreaData?.area}" from this location?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteArea}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

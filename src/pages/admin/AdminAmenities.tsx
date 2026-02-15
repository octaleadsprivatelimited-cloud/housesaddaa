import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Loader2, Edit, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Amenity } from '@/types/property';
import {
  getAmenities,
  getStaticAmenities,
  hasAmenitiesInFirestore,
  addAmenity,
  updateAmenity,
  deleteAmenity,
  seedAmenities,
} from '@/services/amenityService';

const CATEGORIES = ['basic', 'lifestyle', 'sports', 'safety'];
const ICON_OPTIONS = ['car', 'arrow-up', 'zap', 'shield', 'dumbbell', 'waves', 'home', 'flower', 'baby', 'footprints', 'circle', 'gamepad', 'flame', 'video', 'phone'];

export default function AdminAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirestoreData, setIsFirestoreData] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  const [newAmenity, setNewAmenity] = useState({
    name: '',
    icon: 'shield',
    category: 'basic',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    icon: 'shield',
    category: 'basic',
  });

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const [data, inFirestore] = await Promise.all([getAmenities(), hasAmenitiesInFirestore()]);
      setAmenities(data);
      setIsFirestoreData(inFirestore);
    } catch {
      setAmenities(getStaticAmenities());
      setIsFirestoreData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const count = await seedAmenities();
      toast({
        title: 'Success',
        description: count ? `${count} amenities have been added from default data` : 'Amenities already in database.',
      });
      if (count) fetchAmenities();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to seed amenities.',
        variant: 'destructive',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleAdd = async () => {
    if (!newAmenity.name.trim()) {
      toast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await addAmenity({
        name: newAmenity.name.trim(),
        icon: newAmenity.icon,
        category: newAmenity.category,
      });
      toast({ title: 'Success', description: 'Amenity added successfully' });
      setNewAmenity({ name: '', icon: 'shield', category: 'basic' });
      setIsAddOpen(false);
      fetchAmenities();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add amenity',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (a: Amenity) => {
    setEditingAmenity(a);
    setEditForm({ name: a.name, icon: a.icon, category: a.category });
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editingAmenity) return;
    if (!editForm.name.trim()) {
      toast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await updateAmenity(editingAmenity.id, {
        name: editForm.name.trim(),
        icon: editForm.icon,
        category: editForm.category,
      });
      toast({ title: 'Success', description: 'Amenity updated successfully' });
      setIsEditOpen(false);
      setEditingAmenity(null);
      fetchAmenities();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update amenity',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await deleteAmenity(deleteId);
      toast({ title: 'Success', description: 'Amenity deleted successfully' });
      setDeleteId(null);
      fetchAmenities();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete amenity',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-foreground">Amenities</h1>
          <p className="text-muted-foreground">Manage amenities shown in property descriptions</p>
        </div>
        <div className="flex gap-2">
          {!isFirestoreData && amenities.length > 0 && (
            <Button variant="outline" onClick={handleSeed} disabled={seeding}>
              {seeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
              Save to Database
            </Button>
          )}
          {isFirestoreData && (
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Amenity
            </Button>
          )}
        </div>
      </div>

      {!isFirestoreData && amenities.length > 0 && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-3 py-4">
            <Database className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              These are default amenities. Click &quot;Save to Database&quot; to enable adding, editing, and deleting.
            </p>
          </CardContent>
        </Card>
      )}

      {amenities.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">No amenities found.</p>
            <Button onClick={handleSeed} disabled={seeding}>
              {seeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
              Load Default Amenities
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    {a.name}
                  </CardTitle>
                  {isFirestoreData && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => openEdit(a)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(a.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Icon: {a.icon} · Category: {a.category}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Amenity</DialogTitle>
            <DialogDescription>Add an amenity that can be selected when adding or editing properties.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name *</Label>
              <Input
                id="add-name"
                value={newAmenity.name}
                onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                placeholder="e.g., Parking"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newAmenity.category} onValueChange={(v) => setNewAmenity({ ...newAmenity, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={newAmenity.icon} onValueChange={(v) => setNewAmenity({ ...newAmenity, icon: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={(open) => !open && setEditingAmenity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Amenity</DialogTitle>
            <DialogDescription>Update the amenity details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="e.g., Parking"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={editForm.icon} onValueChange={(v) => setEditForm({ ...editForm, icon: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete amenity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the amenity from the list. Properties that use it will still have its id stored; you may want to edit those properties after.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

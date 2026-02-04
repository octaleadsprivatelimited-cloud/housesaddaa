import { useState, useEffect, useRef } from 'react';
import { Landmark, Building2, Plus, Trash2, Loader2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Partner, PartnerType } from '@/types/property';
import {
  getPartnersByType,
  addPartner,
  deletePartner,
} from '@/services/partnerService';
import { imageToBase64, validateImage } from '@/services/imageService';

export default function AdminPartners() {
  const [banks, setBanks] = useState<Partner[]>([]);
  const [companies, setCompanies] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const [banksList, companiesList] = await Promise.all([
        getPartnersByType('bank'),
        getPartnersByType('company'),
      ]);
      setBanks(banksList);
      setCompanies(companiesList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load partners',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: PartnerType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      toast({ title: 'Invalid Image', description: validation.error, variant: 'destructive' });
      return;
    }
    setProcessingImage(true);
    try {
      const base64 = await imageToBase64(file);
      setNewImage(base64);
    } catch {
      toast({ title: 'Error', description: 'Failed to process image', variant: 'destructive' });
    } finally {
      setProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAdd = async (type: PartnerType) => {
    if (!newTitle.trim()) {
      toast({ title: 'Validation', description: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!newImage) {
      toast({ title: 'Validation', description: 'Please select an image', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await addPartner(type, newTitle.trim(), newImage);
      toast({ title: 'Success', description: `${type === 'bank' ? 'Bank' : 'Company'} added` });
      setNewTitle('');
      setNewImage(null);
      fetchPartners();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add partner',
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
      await deletePartner(deleteId);
      toast({ title: 'Success', description: 'Partner removed' });
      setDeleteId(null);
      fetchPartners();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partners</h1>
        <p className="text-muted-foreground">
          Add or remove partner banks and companies. Banks appear on the Home Loans page; companies appear on the homepage.
        </p>
      </div>

      <Tabs defaultValue="banks" className="space-y-4" onValueChange={() => { setNewTitle(''); setNewImage(null); }}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="banks" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Banks
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">{banks.length}</span>
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Companies
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">{companies.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Bank</CardTitle>
              <p className="text-sm text-muted-foreground">Add a partner bank (title + logo). Shown on Home Loans page.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Bank name</Label>
                <Input
                  placeholder="e.g. HDFC Bank"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => {}}
                />
              </div>
              <div className="space-y-2">
                <Label>Logo image</Label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, 'bank')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processingImage}
                  >
                    {processingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {newImage ? 'Change image' : 'Choose image'}
                  </Button>
                  {newImage && (
                    <img src={newImage} alt="Preview" className="h-12 w-auto object-contain rounded border" />
                  )}
                </div>
              </div>
              <Button onClick={() => handleAdd('bank')} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Bank
              </Button>
            </CardContent>
          </Card>
          <PartnerList partners={banks} onDelete={setDeleteId} />
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Company</CardTitle>
              <p className="text-sm text-muted-foreground">Add a partner company (title + logo). Shown on homepage Our Partners.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company name</Label>
                <Input
                  placeholder="e.g. DLF"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Logo image</Label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, 'company')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processingImage}
                  >
                    {processingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {newImage ? 'Change image' : 'Choose image'}
                  </Button>
                  {newImage && (
                    <img src={newImage} alt="Preview" className="h-12 w-auto object-contain rounded border" />
                  )}
                </div>
              </div>
              <Button onClick={() => handleAdd('company')} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Company
              </Button>
            </CardContent>
          </Card>
          <PartnerList partners={companies} onDelete={setDeleteId} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove partner?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the partner from the website. You can add it again later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PartnerList({ partners, onDelete }: { partners: Partner[]; onDelete: (id: string) => void }) {
  if (partners.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No partners yet. Add one above.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current partners</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-12 w-16 object-contain rounded border bg-white shrink-0"
              />
              <span className="font-medium flex-1 truncate">{p.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(p.id)}
                aria-label={`Remove ${p.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

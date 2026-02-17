import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, EyeOff, Loader2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/data/properties';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';
import { Property } from '@/types/property';
import { getAllPropertiesAdmin, togglePropertyStatus, deleteProperty } from '@/services/propertyService';
import { getHomePagePropertyOrder, setHomePagePropertyOrder } from '@/services/siteSettingsService';
import { useToast } from '@/hooks/use-toast';

export default function AdminProperties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [homePageOrderIds, setHomePageOrderIds] = useState<string[]>([]);
  const [homePageOrderLoading, setHomePageOrderLoading] = useState(true);
  const [homePageOrderSaving, setHomePageOrderSaving] = useState(false);
  const { toast } = useToast();
  const { getPropertyTypeLabel } = usePropertyTypes();
  
  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    getHomePagePropertyOrder()
      .then(setHomePageOrderIds)
      .catch(() => setHomePageOrderIds([]))
      .finally(() => setHomePageOrderLoading(false));
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllPropertiesAdmin();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load properties',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await togglePropertyStatus(id, !currentStatus);
      setProperties(prev => 
        prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p)
      );
      toast({
        title: currentStatus ? 'Property Deactivated' : 'Property Activated',
        description: `The property has been ${currentStatus ? 'deactivated' : 'activated'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Property Deleted',
        description: 'The property has been permanently deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      });
    }
  };
  
  const filteredProperties = properties.filter((p) => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const moveHomePageOrder = (index: number, direction: 'up' | 'down') => {
    const next = [...homePageOrderIds];
    const swap = direction === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setHomePageOrderIds(next);
  };

  const removeFromHomePageOrder = (index: number) => {
    setHomePageOrderIds(homePageOrderIds.filter((_, i) => i !== index));
  };

  const addToHomePageOrder = (propertyId: string) => {
    if (!propertyId || propertyId === '_none' || homePageOrderIds.includes(propertyId)) return;
    setHomePageOrderIds([...homePageOrderIds, propertyId]);
  };

  const saveHomePageOrder = async () => {
    setHomePageOrderSaving(true);
    try {
      await setHomePagePropertyOrder(homePageOrderIds);
      toast({ title: 'Saved', description: 'Home page Properties order updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save order', variant: 'destructive' });
    } finally {
      setHomePageOrderSaving(false);
    }
  };

  const homePageOrderProperties = homePageOrderIds
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean) as Property[];
  const availableToAdd = properties.filter((p) => p.isActive !== false && !homePageOrderIds.includes(p.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage all property listings ({properties.length} total)</p>
        </div>
        <Button variant="accent" asChild>
          <Link to="/admin/properties/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search properties..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Home page Properties section order */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Home page Properties section order</CardTitle>
          <CardDescription>
            Set the order of properties shown in the &quot;Properties&quot; section on the home page. Leave empty to use default order (newest first).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {homePageOrderLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading order…
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1 min-w-[200px]">
                  <label className="text-sm font-medium">Add property to home page</label>
                  <Select onValueChange={addToHomePageOrder} value="">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableToAdd.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title} — {p.location.city}
                        </SelectItem>
                      ))}
                      {availableToAdd.length === 0 && (
                        <SelectItem value="_none" disabled>No more properties to add</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={saveHomePageOrder} disabled={homePageOrderSaving || homePageOrderIds.length === 0}>
                  {homePageOrderSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save order
                </Button>
              </div>
              {homePageOrderProperties.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No properties in order. Home page will show newest first. Add properties above to set a custom order.</p>
              ) : (
                <ul className="space-y-2 border rounded-lg divide-y divide-border">
                  {homePageOrderProperties.map((p, index) => (
                    <li key={p.id} className="flex items-center gap-2 p-3 bg-secondary/30">
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 truncate font-medium">{p.title}</span>
                      <span className="text-sm text-muted-foreground shrink-0">{p.location.city}</span>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveHomePageOrder(index, 'up')} disabled={index === 0} aria-label="Move up">
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveHomePageOrder(index, 'down')} disabled={index === homePageOrderProperties.length - 1} aria-label="Move down">
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeFromHomePageOrder(index)} aria-label="Remove from home page">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Properties Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Property</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Location</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={property.images[0] || '/home-image.jpg'} 
                        alt={property.title}
                        className="w-16 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/home-image.jpg';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-foreground line-clamp-1">{property.title}</h3>
                        <p className="text-sm text-muted-foreground md:hidden">
                          {property.location.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-sm">
                      <div>{property.location.area}</div>
                      <div className="text-muted-foreground">{property.location.city}</div>
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <Badge variant="secondary" className="capitalize">
                      {property.propertyType ? getPropertyTypeLabel(property.propertyType) : 'N/A'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-primary">
                      {formatPrice(property.price, property.listingType)}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      For {property.listingType}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge 
                      variant={property.isActive ? 'default' : 'secondary'}
                      className={property.isActive ? 'bg-success' : ''}
                    >
                      {property.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/properties/edit/${property.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(property.id, property.isActive)}>
                          {property.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No properties found</p>
            <Button asChild className="mt-4">
              <Link to="/admin/properties/add">Add Your First Property</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

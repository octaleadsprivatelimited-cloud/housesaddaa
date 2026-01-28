import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { sampleProperties, formatPrice } from '@/data/properties';

export default function AdminProperties() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProperties = sampleProperties.filter((p) => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage all property listings</p>
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
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-16 h-12 rounded-lg object-cover"
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
                      {property.propertyType.replace('-', ' ')}
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
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
                        <DropdownMenuItem className="text-destructive">
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
          </div>
        )}
      </div>
    </div>
  );
}

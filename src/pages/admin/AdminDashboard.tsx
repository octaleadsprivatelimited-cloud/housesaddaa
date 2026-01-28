import { useState, useEffect } from 'react';
import { Building2, MapPin, Eye, MessageSquare, ArrowUpRight, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '@/types/property';
import { getAllPropertiesAdmin, migratePropertiesToActive } from '@/services/propertyService';
import { getNewEnquiriesCount } from '@/services/enquiryService';
import { formatPrice } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiriesCount, setEnquiriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propertiesData, enquiries] = await Promise.all([
        getAllPropertiesAdmin(),
        getNewEnquiriesCount()
      ]);
      setProperties(propertiesData);
      setEnquiriesCount(enquiries);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    setMigrating(true);
    try {
      const count = await migratePropertiesToActive();
      toast({
        title: 'Migration Complete',
        description: `Updated ${count} properties to active status.`,
      });
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Migration Failed',
        description: 'Could not update properties. Check console for details.',
        variant: 'destructive',
      });
      console.error('Migration error:', error);
    } finally {
      setMigrating(false);
    }
  };

  // Calculate stats from real data
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const uniqueCities = new Set(properties.map(p => p.location.city)).size;
  
  const stats = [
    { 
      name: 'Total Properties', 
      value: properties.length.toString(), 
      change: '+12%', 
      trend: 'up',
      icon: Building2,
      color: 'bg-primary/10 text-primary'
    },
    { 
      name: 'Total Views', 
      value: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(), 
      change: '+8%', 
      trend: 'up',
      icon: Eye,
      color: 'bg-accent/10 text-accent'
    },
    { 
      name: 'New Enquiries', 
      value: enquiriesCount.toString(), 
      change: '+24%', 
      trend: 'up',
      icon: MessageSquare,
      color: 'bg-success/10 text-success'
    },
    { 
      name: 'Active Cities', 
      value: uniqueCities.toString(), 
      change: '0%', 
      trend: 'neutral',
      icon: MapPin,
      color: 'bg-warning/10 text-warning'
    },
  ];

  // Calculate property type stats
  const propertyTypeCounts = properties.reduce((acc, p) => {
    const type = p.propertyType || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyTypeStats = Object.entries(propertyTypeCounts)
    .map(([type, count]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentProperties = properties.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Migration Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your property overview.</p>
        </div>
        {properties.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMigration}
            disabled={migrating}
          >
            {migrating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Activate All Properties
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {stat.change}
                {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-semibold text-lg">Recent Properties</h2>
            <Link to="/admin/properties" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                  <img 
                    src={property.images[0] || '/placeholder.svg'} 
                    alt={property.title}
                    className="w-16 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.location.area}, {property.location.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {formatPrice(property.price, property.listingType)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {property.views || 0} views
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No properties yet.{' '}
                <Link to="/admin/properties/add" className="text-primary hover:underline">
                  Add your first property
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Property Types */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-lg">Properties by Type</h2>
          </div>
          <div className="p-5 space-y-4">
            {propertyTypeStats.length > 0 ? (
              propertyTypeStats.map((stat) => (
                <div key={stat.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{stat.type}</span>
                    <span className="text-sm font-medium">{stat.count}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(stat.count / properties.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No properties to display</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link 
            to="/admin/properties/add"
            className="p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors text-center"
          >
            <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
            <span className="text-sm font-medium">Add Property</span>
          </Link>
          <Link 
            to="/admin/enquiries"
            className="p-4 bg-accent/10 rounded-xl hover:bg-accent/20 transition-colors text-center"
          >
            <MessageSquare className="h-8 w-8 text-accent mx-auto mb-2" />
            <span className="text-sm font-medium">View Enquiries</span>
          </Link>
          <Link 
            to="/admin/locations"
            className="p-4 bg-success/10 rounded-xl hover:bg-success/20 transition-colors text-center"
          >
            <MapPin className="h-8 w-8 text-success mx-auto mb-2" />
            <span className="text-sm font-medium">Manage Locations</span>
          </Link>
          <Link 
            to="/"
            className="p-4 bg-warning/10 rounded-xl hover:bg-warning/20 transition-colors text-center"
          >
            <Eye className="h-8 w-8 text-warning mx-auto mb-2" />
            <span className="text-sm font-medium">View Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

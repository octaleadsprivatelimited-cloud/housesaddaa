import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Mail, Phone, Calendar, Building2, MapPin, IndianRupee, Home, BedDouble, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const INTENT_LABELS: Record<string, string> = {
  buy: 'Buy',
  sell: 'Sell',
  'take-a-rent': 'Take a Rent',
  'give-for-rental': 'Give For a Rental',
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  flat: 'Flat',
  villa: 'Villa',
  'independent-house': 'Independent House',
  'open-plot': 'Open plot',
  'commercial-space': 'Commercial Space',
  other: 'Other',
};

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  createdAt: Date;
  intent?: string;
  propertyLocation?: string;
  budgetExpecting?: string;
  propertyType?: string;
  bhk?: string;
  pricingLooking?: string;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Enquiry[];
        setEnquiries(data);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Enquiries</h1>
        <p className="text-muted-foreground">Manage customer enquiries and leads</p>
      </div>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Enquiries Yet</h3>
            <p className="text-muted-foreground text-center">
              Customer enquiries will appear here when they submit the contact form.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{enquiry.name}</CardTitle>
                    {enquiry.propertyTitle && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Building2 className="h-3 w-3" />
                        {enquiry.propertyTitle}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {enquiry.createdAt.toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Mail className="h-4 w-4" />
                    {enquiry.email}
                  </a>
                  <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Phone className="h-4 w-4" />
                    {enquiry.phone}
                  </a>
                </div>
                {enquiry.intent && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Intent: </span>
                    {INTENT_LABELS[enquiry.intent] || enquiry.intent}
                  </div>
                )}
                {(enquiry.propertyLocation || enquiry.budgetExpecting) && (
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {enquiry.propertyLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {enquiry.propertyLocation}
                      </span>
                    )}
                    {enquiry.budgetExpecting && (
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {enquiry.budgetExpecting}
                      </span>
                    )}
                  </div>
                )}
                {(enquiry.propertyType || enquiry.bhk || enquiry.pricingLooking) && (
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {enquiry.propertyType && (
                      <span className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        {PROPERTY_TYPE_LABELS[enquiry.propertyType] || enquiry.propertyType.replace(/-/g, ' ')}
                      </span>
                    )}
                    {enquiry.bhk && (
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        {enquiry.bhk} BHK
                      </span>
                    )}
                    {enquiry.pricingLooking && (
                      <span className="flex items-center gap-1">
                        <Wallet className="h-4 w-4" />
                        {enquiry.pricingLooking}
                      </span>
                    )}
                  </div>
                )}
                {enquiry.message && <p className="text-muted-foreground">{enquiry.message}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
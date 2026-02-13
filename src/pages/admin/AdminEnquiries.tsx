import { useState, useEffect } from 'react';
import { Loader2, Mail, Phone, PhoneCall } from 'lucide-react';
import { Enquiry } from '@/types/property';
import { subscribeEnquiries, updateEnquiryStatus } from '@/services/enquiryService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const PROJECT_TYPE_LABELS: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
};

const STATUS_OPTIONS: { value: Enquiry['status']; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

type ProjectTypeFilter = 'all' | 'residential' | 'commercial';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectTypeFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const projectFilter =
      filter === 'all' ? undefined : (filter as 'residential' | 'commercial');
    const unsubscribe = subscribeEnquiries(
      (data) => {
        setEnquiries(data);
        setLoading(false);
      },
      projectFilter
    );
    return () => unsubscribe();
  }, [filter]);

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    setUpdatingId(id);
    try {
      await updateEnquiryStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enquiries</h1>
          <p className="text-muted-foreground">Manage enquiries with real-time updates</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as ProjectTypeFilter)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All enquiries</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Enquiries Yet</h3>
            <p className="text-muted-foreground text-center">
              {filter === 'all'
                ? 'Enquiries will appear here when users submit the contact form.'
                : `No ${filter} enquiries. Try "All enquiries".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Alternate Phone</TableHead>
                  <TableHead>Project Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-medium">{enquiry.name}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        {enquiry.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {enquiry.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      {enquiry.alternatePhone ? (
                        <a
                          href={`tel:${enquiry.alternatePhone.replace(/\s/g, '')}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <PhoneCall className="h-3 w-3" />
                          {enquiry.alternatePhone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {enquiry.projectType ? (
                        <Badge variant="secondary">
                          {PROJECT_TYPE_LABELS[enquiry.projectType] || enquiry.projectType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[240px]">
                      <span className="line-clamp-2 text-muted-foreground">
                        {enquiry.message || '—'}
                      </span>
                      {enquiry.intent && (
                        <div className="text-xs mt-1">
                          <span className="font-medium">Intent:</span> {enquiry.intent.replace(/-/g, ' ')}
                        </div>
                      )}
                      {(enquiry.propertyType || enquiry.bhk) && (
                        <div className="text-xs">
                          <span className="font-medium">Property:</span>{' '}
                          {[enquiry.propertyType?.replace(/-/g, ' '), enquiry.bhk && `${enquiry.bhk} BHK`].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      {enquiry.propertyLocation && (
                        <div className="text-xs">
                          <span className="font-medium">Location:</span> {enquiry.propertyLocation}
                        </div>
                      )}
                      {enquiry.budgetExpecting && (
                        <div className="text-xs">
                          <span className="font-medium">Budget:</span> {enquiry.budgetExpecting}
                        </div>
                      )}
                      {enquiry.companyName && (
                        <div className="text-xs">
                          <span className="font-medium">Company:</span> {enquiry.companyName}
                        </div>
                      )}
                      {enquiry.projectLocation && (
                        <div className="text-xs">
                          <span className="font-medium">Project location:</span> {enquiry.projectLocation}
                        </div>
                      )}
                      {enquiry.estimatedBudget && (
                        <div className="text-xs">
                          <span className="font-medium">Est. budget:</span> {enquiry.estimatedBudget}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {enquiry.createdAt instanceof Date
                        ? enquiry.createdAt.toLocaleString()
                        : new Date(enquiry.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={enquiry.status}
                        onValueChange={(v) =>
                          handleStatusChange(enquiry.id, v as Enquiry['status'])
                        }
                        disabled={updatingId === enquiry.id}
                      >
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue />
                          {updatingId === enquiry.id && (
                            <Loader2 className="h-4 w-4 animate-spin ml-2" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

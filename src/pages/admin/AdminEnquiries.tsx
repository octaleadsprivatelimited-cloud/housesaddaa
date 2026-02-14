import { useState, useEffect, useMemo } from 'react';
import { Loader2, Mail, Phone, PhoneCall, Download, Calendar } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import * as XLSX from 'xlsx';

const PROJECT_TYPE_LABELS: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
};

const SOURCE_LABELS: Record<string, string> = {
  'contact-form': 'Contact Form',
  contact: 'Contact Page',
  'home-loans': 'Home Loans',
  'interior-design': 'Interior Design',
  'property-promotions': 'Property Promotions',
};

const STATUS_OPTIONS: { value: Enquiry['status']; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

type ProjectTypeFilter = 'all' | 'residential' | 'commercial';

function getEnquiryDate(enquiry: Enquiry): number {
  const created = enquiry.createdAt;
  return created instanceof Date ? created.getTime() : new Date(created).getTime();
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectTypeFilter>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
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

  const filteredEnquiries = useMemo(() => {
    let list = enquiries;
    if (fromDate) {
      const fromTs = new Date(fromDate).setHours(0, 0, 0, 0);
      list = list.filter((e) => getEnquiryDate(e) >= fromTs);
    }
    if (toDate) {
      const toTs = new Date(toDate).setHours(23, 59, 59, 999);
      list = list.filter((e) => getEnquiryDate(e) <= toTs);
    }
    return list;
  }, [enquiries, fromDate, toDate]);

  const downloadExcel = () => {
    const rows = filteredEnquiries.map((e) => {
      const created = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt);
      const propertyTypeDisplay =
        e.propertyType === 'other' && e.propertyTypeOther
          ? `Other: ${e.propertyTypeOther}`
          : e.propertyType?.replace(/-/g, ' ') || '';
      return {
        'Date & Time': created.toLocaleString(),
        Name: e.name,
        Email: e.email,
        Phone: e.phone,
        'Alternate Phone': e.alternatePhone || '',
        Status: e.status,
        Source: e.enquirySource ? (SOURCE_LABELS[e.enquirySource] || e.enquirySource) : '',
        Message: e.message || '',
        Intent: e.intent?.replace(/-/g, ' ') || '',
        'Property Type': propertyTypeDisplay,
        BHK: e.bhk || '',
        Location: e.propertyLocation || '',
        Budget: e.budgetExpecting || '',
        'Company Name': e.companyName || '',
        'Project Location': e.projectLocation || '',
        'Estimated Budget': e.estimatedBudget || '',
        'Preferred Bank': e.preferredBank || '',
        'Property Details': e.propertyDetails || '',
        'Interior/Project Details': e.interiorProjectDetails || '',
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');
    const fromLabel = fromDate ? fromDate.replace(/-/g, '') : 'all';
    const toLabel = toDate ? toDate.replace(/-/g, '') : 'all';
    XLSX.writeFile(wb, `contact-form-responses_${fromLabel}_to_${toLabel}.xlsx`);
  };

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Enquiries</h1>
            <p className="text-muted-foreground">Manage contact form responses with filters and export</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={downloadExcel}
              disabled={filteredEnquiries.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
          </div>
        </div>

        {/* Date range filter */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border bg-card">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter by date:</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="from-date" className="text-sm text-muted-foreground whitespace-nowrap">
                From
              </label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-[160px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="to-date" className="text-sm text-muted-foreground whitespace-nowrap">
                To
              </label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-[160px]"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFromDate('');
                setToDate('');
              }}
            >
              Clear dates
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            Showing {filteredEnquiries.length} of {enquiries.length} response(s)
          </span>
        </div>
      </div>

      {filteredEnquiries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Enquiries Yet</h3>
            <p className="text-muted-foreground text-center">
              {enquiries.length === 0
                ? filter === 'all'
                  ? 'Enquiries will appear here when users submit the contact form.'
                  : `No ${filter} enquiries. Try "All enquiries".`
                : 'No responses match the selected date range. Try changing From/To dates.'}
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
                {filteredEnquiries.map((enquiry) => (
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
                          {enquiry.propertyType === 'other' && enquiry.propertyTypeOther
                            ? `Other: ${enquiry.propertyTypeOther}`
                            : [enquiry.propertyType?.replace(/-/g, ' '), enquiry.bhk && `${enquiry.bhk} BHK`].filter(Boolean).join(' · ')}
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
                      {enquiry.enquirySource && (
                        <div className="text-xs">
                          <span className="font-medium">Source:</span>{' '}
                          {enquiry.enquirySource === 'home-loans'
                            ? 'Home Loans'
                            : enquiry.enquirySource === 'interior-design'
                              ? 'Interior Design'
                              : enquiry.enquirySource === 'property-promotions'
                                ? 'Property Promotions'
                                : enquiry.enquirySource}
                        </div>
                      )}
                      {enquiry.preferredBank && (
                        <div className="text-xs">
                          <span className="font-medium">Preferred bank:</span> {enquiry.preferredBank}
                        </div>
                      )}
                      {enquiry.propertyDetails && (
                        <div className="text-xs">
                          <span className="font-medium">Property details:</span>{' '}
                          <span className="line-clamp-2">{enquiry.propertyDetails}</span>
                        </div>
                      )}
                      {enquiry.interiorProjectDetails && (
                        <div className="text-xs">
                          <span className="font-medium">Project details:</span>{' '}
                          <span className="line-clamp-2">{enquiry.interiorProjectDetails}</span>
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

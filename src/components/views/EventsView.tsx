import { useState } from 'react';
import { SecurityEvent } from '../../utils/syntheticData';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Download, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface EventsViewProps {
  allEvents: SecurityEvent[];
}

type SortField = 'timestamp' | 'severity' | 'risk_score' | 'eventType';
type SortDirection = 'asc' | 'desc';

const SEVERITY_ORDER = { high: 3, medium: 2, low: 1 };

export function EventsView({ allEvents }: EventsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 25;

  // Get unique event types
  const eventTypes = Array.from(new Set(allEvents.map(e => e.eventType)));

  // Filter events
  let filteredEvents = allEvents.filter(event => {
    const matchesSearch = searchTerm === '' ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ip.includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesEventType = eventTypeFilter === 'all' || event.eventType === eventTypeFilter;
    
    return matchesSearch && matchesSeverity && matchesEventType;
  });

  // Sort events
  filteredEvents.sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'timestamp':
        comparison = a.timestamp.getTime() - b.timestamp.getTime();
        break;
      case 'severity':
        comparison = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        break;
      case 'risk_score':
        comparison = a.risk_score - b.risk_score;
        break;
      case 'eventType':
        comparison = a.eventType.localeCompare(b.eventType);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Event Type', 'Severity', 'IP', 'Username', 'Location', 'Details', 'Risk Score'];
    const rows = filteredEvents.map(e => [
      e.id,
      e.timestamp.toISOString(),
      e.eventType,
      e.severity,
      e.ip,
      e.username,
      e.location,
      `"${e.details}"`,
      e.risk_score
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (severity: SecurityEvent['severity']) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[severity]} className="capitalize">
        {severity}
      </Badge>
    );
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1>All Security Events</h1>
          <p className="text-muted-foreground">
            Browse and filter all security events in the system
          </p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, username, IP, location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block">Severity</label>
            <Select value={severityFilter} onValueChange={(value) => {
              setSeverityFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm mb-2 block">Event Type</label>
            <Select value={eventTypeFilter} onValueChange={(value) => {
              setEventTypeFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {eventTypes.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredEvents.length} of {allEvents.length} events</span>
          {(searchTerm || severityFilter !== 'all' || eventTypeFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSeverityFilter('all');
                setEventTypeFilter('all');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Events Table */}
      <Card className="p-6">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>
                  <SortButton field="timestamp">Timestamp</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="eventType">Event Type</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="severity">Severity</SortButton>
                </TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>
                  <SortButton field="risk_score">Risk</SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{event.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {event.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{event.eventType.replace('_', ' ')}</TableCell>
                  <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                  <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                  <TableCell>{event.username}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{event.details}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      event.risk_score >= 70 ? 'text-destructive' :
                      event.risk_score >= 40 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {event.risk_score}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length})
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

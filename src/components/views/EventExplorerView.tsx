import { useState } from 'react';
import { SecurityEvent } from '../../utils/syntheticData';
import { AuditLogEntry } from '../../App';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Database, FileText, Search, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

interface EventExplorerViewProps {
  allEvents: SecurityEvent[];
  auditLogs: AuditLogEntry[];
}

export function EventExplorerView({ allEvents, auditLogs }: EventExplorerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'risk_score'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Filter events
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = 
      event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ip.includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesType = eventTypeFilter === 'all' || event.eventType === eventTypeFilter;
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'timestamp') {
      comparison = a.timestamp.getTime() - b.timestamp.getTime();
    } else if (sortBy === 'severity') {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      comparison = severityOrder[a.severity] - severityOrder[b.severity];
    } else if (sortBy === 'risk_score') {
      comparison = a.risk_score - b.risk_score;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Paginate
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const eventTypes = Array.from(new Set(allEvents.map(e => e.eventType)));

  const exportCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'Type', 'Severity', 'IP', 'Username', 'Location', 'Risk Score'];
    const rows = filteredEvents.map(e => [
      e.id,
      e.timestamp.toISOString(),
      e.eventType,
      e.severity,
      e.ip,
      e.username,
      e.location,
      e.risk_score.toString()
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astroguard-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h1>Event Explorer</h1>
        </div>
        <p className="text-muted-foreground">
          Unified view for security events and query audit logs
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="events" className="gap-2">
            <Database className="h-4 w-4" />
            Security Events ({allEvents.length})
          </TabsTrigger>
          <TabsTrigger value="queries" className="gap-2">
            <FileText className="h-4 w-4" />
            Query Logs ({auditLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, username, IP, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {paginatedEvents.length} of {filteredEvents.length} events
                </span>
                {searchTerm || severityFilter !== 'all' || eventTypeFilter !== 'all' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSeverityFilter('all');
                      setEventTypeFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </Card>

          {/* Events Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted-foreground/10" onClick={() => {
                      setSortBy('timestamp');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}>
                      Timestamp {sortBy === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3">Event ID</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted-foreground/10" onClick={() => {
                      setSortBy('severity');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}>
                      Severity {sortBy === 'severity' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left p-3">IP</th>
                    <th className="text-left p-3">Username</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-muted-foreground/10" onClick={() => {
                      setSortBy('risk_score');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}>
                      Risk {sortBy === 'risk_score' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((event, idx) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 text-sm">{event.timestamp.toLocaleString()}</td>
                      <td className="p-3 font-mono text-sm">{event.id}</td>
                      <td className="p-3 text-sm capitalize">
                        {event.eventType.replace(/_/g, ' ')}
                        {event.isMissionCritical && (
                          <Badge variant="outline" className="ml-2 text-xs border-orange-600 text-orange-600">
                            ISRO
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant={
                          event.severity === 'high' ? 'destructive' :
                          event.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {event.severity}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-sm">{event.ip}</td>
                      <td className="p-3 text-sm">{event.username}</td>
                      <td className="p-3 text-sm">{event.location}</td>
                      <td className="p-3">
                        <Badge variant={event.risk_score >= 70 ? 'destructive' : 'outline'}>
                          {event.risk_score}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="queries" className="space-y-4">
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Total Queries</p>
                <p className="text-2xl font-semibold">{auditLogs.length}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-semibold">
                  {auditLogs.length > 0
                    ? Math.round(auditLogs.reduce((sum, log) => sum + log.result.confidence, 0) / auditLogs.length)
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Events Found</p>
                <p className="text-2xl font-semibold">
                  {auditLogs.reduce((sum, log) => sum + log.result.events.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">Latest Query</p>
                <p className="text-sm">
                  {auditLogs.length > 0
                    ? auditLogs[0].timestamp.toLocaleTimeString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{log.query}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{log.result.confidence}% confidence</Badge>
                      <Badge>{log.result.events.length} results</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.result.summary}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { SecurityEvent } from '../utils/syntheticData';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Table as TableIcon, BarChart3, PieChart as PieChartIcon, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EnhancedResultsPanelProps {
  summary: string;
  events: SecurityEvent[];
  stats: {
    total: number;
    highSeverity: number;
    mediumSeverity: number;
    lowSeverity: number;
  };
}

type SortField = 'timestamp' | 'severity' | 'risk_score' | 'eventType';
type SortDirection = 'asc' | 'desc';

const SEVERITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
};

const SEVERITY_ORDER = { high: 3, medium: 2, low: 1 };

export function EnhancedResultsPanel({ summary, events, stats }: EnhancedResultsPanelProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 20;

  // Prepare chart data
  const severityData = [
    { name: 'High', value: stats.highSeverity, color: SEVERITY_COLORS.high },
    { name: 'Medium', value: stats.mediumSeverity, color: SEVERITY_COLORS.medium },
    { name: 'Low', value: stats.lowSeverity, color: SEVERITY_COLORS.low }
  ].filter(d => d.value > 0);

  // Timeline data (events by date)
  const timelineData = events.reduce((acc, event) => {
    const date = event.timestamp.toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, count: 0, high: 0, medium: 0, low: 0 };
    }
    acc[date].count++;
    acc[date][event.severity]++;
    return acc;
  }, {} as Record<string, { date: string; count: number; high: number; medium: number; low: number }>);

  const timelineArray = Object.values(timelineData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Event type distribution
  const eventTypeData = events.reduce((acc, event) => {
    const type = event.eventType.replace('_', ' ');
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);

  const eventTypeArray = Object.entries(eventTypeData).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count
  }));

  // Risk distribution
  const riskRanges = [
    { name: '0-25', min: 0, max: 25, count: 0 },
    { name: '26-50', min: 26, max: 50, count: 0 },
    { name: '51-75', min: 51, max: 75, count: 0 },
    { name: '76-100', min: 76, max: 100, count: 0 }
  ];

  events.forEach(e => {
    const range = riskRanges.find(r => e.risk_score >= r.min && e.risk_score <= r.max);
    if (range) range.count++;
  });

  const riskDistribution = riskRanges.filter(r => r.count > 0);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Filter and sort events
  let filteredEvents = events.filter(e => 
    searchTerm === '' ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.ip.includes(searchTerm) ||
    e.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    a.download = `siem-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    <Card className="p-6">
      <div className="space-y-6">
        {/* Summary Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3>Query Results</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportCSV}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <p className="text-muted-foreground">{summary}</p>
          
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.high }} />
              <span className="text-sm">High: {stats.highSeverity}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.medium }} />
              <span className="text-sm">Medium: {stats.mediumSeverity}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.low }} />
              <span className="text-sm">Low: {stats.lowSeverity}</span>
            </div>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table" className="gap-2">
              <TableIcon className="h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4 space-y-4">
            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by ID, username, IP, or event type..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="max-w-md"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredEvents.length} events
              </span>
            </div>

            <ScrollArea className="h-[500px]">
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
                    <TableHead>
                      <SortButton field="risk_score">Risk Score</SortButton>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{event.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{event.timestamp.toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{event.eventType.replace('_', ' ')}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                      <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                      <TableCell>{event.username}</TableCell>
                      <TableCell>{event.location}</TableCell>
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
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length}
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
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
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
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-6">
              <div>
                <h4 className="mb-4">Events Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Total Events" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="mb-4">Severity Breakdown Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timelineArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill={SEVERITY_COLORS.high} name="High" />
                    <Bar dataKey="medium" stackId="a" fill={SEVERITY_COLORS.medium} name="Medium" />
                    <Bar dataKey="low" stackId="a" fill={SEVERITY_COLORS.low} name="Low" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="mb-4">Event Types</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventTypeArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Event Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-4 text-center">Severity Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="mb-4 text-center">Event Type Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventTypeArray}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#82ca9d"
                      dataKey="count"
                    >
                      {eventTypeArray.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(${index * 360 / eventTypeArray.length}, 70%, 50%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="mb-4 text-center">Risk Score Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Risk Score Range', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Event Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center">
                <div className="space-y-4 w-full">
                  <h4 className="text-center">Quick Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Avg Risk Score:</span>
                      <span className="font-medium">
                        {(events.reduce((sum, e) => sum + e.risk_score, 0) / events.length).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Unique IPs:</span>
                      <span className="font-medium">
                        {new Set(events.map(e => e.ip)).size}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Unique Users:</span>
                      <span className="font-medium">
                        {new Set(events.map(e => e.username)).size}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <span>Locations:</span>
                      <span className="font-medium">
                        {new Set(events.map(e => e.location)).size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}

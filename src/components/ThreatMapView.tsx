import { useState } from 'react';
import { SecurityEvent } from '../utils/syntheticData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Globe, AlertTriangle, ZoomIn, ZoomOut, Filter } from 'lucide-react';

interface ThreatMapViewProps {
  events: SecurityEvent[];
}

export function ThreatMapView({ events }: ThreatMapViewProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [zoom, setZoom] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Filter events based on user selection
  const filteredEvents = events.filter(event => {
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesType = eventTypeFilter === 'all' || event.eventType === eventTypeFilter;
    return matchesSeverity && matchesType;
  });

  // Get unique event types
  const eventTypes = Array.from(new Set(events.map(e => e.eventType)));

  // Calculate threat intensity by location
  const locationThreats = filteredEvents.reduce((acc, event) => {
    if (!acc[event.location]) {
      acc[event.location] = {
        count: 0,
        high: 0,
        medium: 0,
        low: 0,
        lat: event.latitude || 0,
        lon: event.longitude || 0
      };
    }
    acc[event.location].count++;
    acc[event.location][event.severity]++;
    return acc;
  }, {} as Record<string, { count: number; high: number; medium: number; low: number; lat: number; lon: number }>);

  const topThreats = Object.entries(locationThreats)
    .map(([location, data]) => ({ location, ...data }))
    .sort((a, b) => (b.high * 3 + b.medium * 2 + b.low) - (a.high * 3 + a.medium * 2 + a.low))
    .slice(0, 10);

  // Calculate position on map (simplified projection)
  const getMapPosition = (lat: number, lon: number) => {
    // Convert lat/lon to percentage position on map
    // Mercator-like projection (simplified)
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  // Get marker size based on threat count
  const getMarkerSize = (count: number) => {
    if (count > 20) return 'w-6 h-6';
    if (count > 10) return 'w-5 h-5';
    if (count > 5) return 'w-4 h-4';
    return 'w-3 h-3';
  };

  // Get marker color based on severity distribution
  const getMarkerColor = (high: number, medium: number, low: number) => {
    if (high > medium && high > low) return 'bg-red-500 border-red-600';
    if (medium > low) return 'bg-yellow-500 border-yellow-600';
    return 'bg-green-500 border-green-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
          <h2>Global Threat Map</h2>
        </div>
        <p className="text-muted-foreground">
          Interactive visualization of security events by geographic location
        </p>
      </div>

      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">High Only</SelectItem>
              <SelectItem value="medium">Medium Only</SelectItem>
              <SelectItem value="low">Low Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Event Types</SelectItem>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              disabled={zoom >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground flex items-center px-2">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <Badge variant="outline">
            {filteredEvents.length} events shown
          </Badge>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-950">
        <div 
          className="relative w-full aspect-[2/1] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-indigo-900 rounded-lg overflow-hidden border-2 border-blue-300 dark:border-blue-700"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
        >
          {/* World Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1000 500">
              {/* Simplified world map continents */}
              {/* Landmasses */}
              <g fill="currentColor" className="text-blue-400 dark:text-blue-600">
                {/* North America */}
                <path d="M100,80 L180,60 L250,90 L280,150 L250,180 L200,200 L150,180 Z" />
                {/* South America */}
                <path d="M220,250 L260,270 L280,340 L260,380 L220,360 Z" />
                {/* Europe */}
                <path d="M420,100 L500,80 L520,140 L480,160 L440,140 Z" />
                {/* Africa */}
                <path d="M450,180 L520,200 L540,300 L500,360 L460,340 L440,260 Z" />
                {/* Asia */}
                <path d="M520,60 L700,50 L780,120 L760,200 L680,180 L600,140 Z" />
                {/* Australia */}
                <path d="M720,320 L800,310 L820,360 L780,380 L720,370 Z" />
              </g>
              {/* Grid lines */}
              <g stroke="currentColor" strokeWidth="0.5" className="text-blue-300 dark:text-blue-700 opacity-50">
                {Array.from({ length: 11 }).map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
                ))}
                {Array.from({ length: 21 }).map((_, i) => (
                  <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
                ))}
              </g>
            </svg>
          </div>

          {/* Threat Markers */}
          {Object.entries(locationThreats).map(([location, data]) => {
            const pos = getMapPosition(data.lat, data.lon);
            const size = getMarkerSize(data.count);
            const color = getMarkerColor(data.high, data.medium, data.low);
            
            return (
              <div
                key={location}
                className={`absolute ${size} ${color} rounded-full border-2 ${selectedLocation === location ? 'ring-4 ring-white' : 'animate-pulse'} cursor-pointer group transition-all hover:scale-125`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
                title={`${location}: ${data.count} events`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                    <p className="font-medium">{location}</p>
                    <p>Total: {data.count} events</p>
                    <p className="text-red-300">High: {data.high}</p>
                    <p className="text-yellow-300">Medium: {data.medium}</p>
                    <p className="text-green-300">Low: {data.low}</p>
                  </div>
                </div>
                
                {/* Ripple effect for high-threat locations */}
                {data.high > 0 && (
                  <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                )}
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg p-3 text-xs space-y-1">
            <p className="font-medium mb-2">Threat Level</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600" />
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600" />
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600" />
              <span>Low Risk</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card className="p-6 border-2 border-primary animate-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {selectedLocation} - Detailed Analysis
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedLocation(null)}>
              Close
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(locationThreats).find(([loc]) => loc === selectedLocation)?.[1] && (
              <>
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-semibold">
                    {locationThreats[selectedLocation].count}
                  </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded">
                  <p className="text-sm text-red-600">High Severity</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {locationThreats[selectedLocation].high}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded">
                  <p className="text-sm text-yellow-600">Medium Severity</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {locationThreats[selectedLocation].medium}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded">
                  <p className="text-sm text-green-600">Low Severity</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {locationThreats[selectedLocation].low}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="mt-4">
            <h4 className="mb-2">Recent Events from this Location:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredEvents
                .filter(e => e.location === selectedLocation)
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="text-sm p-2 bg-muted rounded flex items-center justify-between">
                    <span>{event.eventType.replace(/_/g, ' ')}</span>
                    <Badge variant={
                      event.severity === 'high' ? 'destructive' :
                      event.severity === 'medium' ? 'default' : 'secondary'
                    }>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}

      {/* Top Threat Locations Table */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-600" />
          Top Threat Locations
        </h3>
        <div className="space-y-2">
          {topThreats.map((threat, index) => (
            <div 
              key={threat.location} 
              className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all ${
                selectedLocation === threat.location ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedLocation(threat.location)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <span className="font-medium">{index + 1}</span>
              </div>
              
              <div className="flex-1">
                <p className="font-medium">{threat.location}</p>
                <p className="text-sm text-muted-foreground">
                  {threat.count} total events
                </p>
              </div>

              <div className="flex gap-2">
                {threat.high > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {threat.high}
                  </Badge>
                )}
                {threat.medium > 0 && (
                  <Badge variant="default" className="gap-1">
                    {threat.medium}
                  </Badge>
                )}
                {threat.low > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {threat.low}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Suspicious Non-Indian Locations */}
      {filteredEvents.some(e => !e.location.includes(', IN')) && (
        <Card className="p-6 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 animate-pulse" />
            <h3 className="text-orange-900 dark:text-orange-100">🚨 Suspicious Foreign Access Detected</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Security Alert:</strong> Security events detected from locations outside India may indicate unauthorized access attempts to ISRO infrastructure
          </p>
          <div className="space-y-2">
            {Object.entries(locationThreats)
              .filter(([location]) => !location.includes(', IN'))
              .slice(0, 5)
              .map(([location, data]) => (
                <div 
                  key={location} 
                  className="flex items-center justify-between p-3 bg-background rounded border border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 cursor-pointer transition-all"
                  onClick={() => setSelectedLocation(location)}
                >
                  <div>
                    <span className="font-medium">{location}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {data.high > 0 && `${data.high} high-severity events`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    {data.count} events
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}

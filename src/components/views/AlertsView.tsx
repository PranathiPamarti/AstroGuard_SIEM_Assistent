import { SecurityEvent } from '../../utils/syntheticData';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertTriangle, Bell, X, Shield, Activity } from 'lucide-react';
import { useState } from 'react';

interface AlertsViewProps {
  allEvents: SecurityEvent[];
}

export function AlertsView({ allEvents }: AlertsViewProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Get high-risk events
  const highRiskEvents = allEvents.filter(
    e => (e.severity === 'high' || e.risk_score >= 80) && !dismissedAlerts.has(e.id)
  );

  // Detect anomalies (multiple failed logins from same IP)
  const ipCounts = allEvents.reduce((acc, e) => {
    if (e.eventType === 'failed_login') {
      acc[e.ip] = (acc[e.ip] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const suspiciousIPs = Object.entries(ipCounts)
    .filter(([_, count]) => count >= 5)
    .map(([ip, count]) => ({ ip, count }));

  // Malware alerts
  const malwareAlerts = allEvents.filter(e => e.eventType === 'malware_detection');

  const dismissAlert = (eventId: string) => {
    setDismissedAlerts(prev => new Set([...prev, eventId]));
  };

  const totalActiveAlerts = highRiskEvents.length + suspiciousIPs.length;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Security Alerts</h1>
          <p className="text-muted-foreground">
            Proactive alerts and anomaly detection
          </p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {totalActiveAlerts} Active
        </Badge>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Risk Events</p>
              <p className="text-3xl font-semibold mt-1">{highRiskEvents.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Anomalies Detected</p>
              <p className="text-3xl font-semibold mt-1">{suspiciousIPs.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Malware Detections</p>
              <p className="text-3xl font-semibold mt-1">{malwareAlerts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* High Risk Events */}
      {highRiskEvents.length > 0 && (
        <div>
          <h2 className="mb-4">High Risk Events</h2>
          <div className="space-y-3">
            {highRiskEvents.map((event) => (
              <Card key={event.id} className="p-4 border-red-200 dark:border-red-900">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="capitalize">{event.eventType.replace('_', ' ')}</h4>
                      <Badge variant="destructive">
                        Risk: {event.risk_score}
                      </Badge>
                      <Badge variant="outline" className="ml-auto">
                        {event.id}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-3">{event.details}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">User:</span>
                        <p className="font-medium">{event.username}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">IP:</span>
                        <p className="font-mono text-sm">{event.ip}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p>{event.location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <p>{event.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dismissAlert(event.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Anomaly Alerts */}
      {suspiciousIPs.length > 0 && (
        <div>
          <h2 className="mb-4">Detected Anomalies</h2>
          <div className="space-y-3">
            {suspiciousIPs.map(({ ip, count }) => {
              const relatedEvents = allEvents.filter(e => e.ip === ip && e.eventType === 'failed_login');
              const latestEvent = relatedEvents[0];
              
              return (
                <Card key={ip} className="p-4 border-orange-200 dark:border-orange-900">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-orange-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4>Brute Force Attack Detected</h4>
                        <Badge variant="outline">Anomaly</Badge>
                      </div>
                      
                      <p className="text-sm mb-3">
                        Multiple failed login attempts ({count} attempts) detected from IP address {ip}. 
                        This pattern suggests a potential brute force attack.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">IP Address:</span>
                          <p className="font-mono text-sm">{ip}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attempts:</span>
                          <p className="font-medium text-orange-600">{count}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Targeted Users:</span>
                          <p>{new Set(relatedEvents.map(e => e.username)).size}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Attempt:</span>
                          <p>{latestEvent?.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Malware Alerts */}
      {malwareAlerts.length > 0 && (
        <div>
          <h2 className="mb-4">Malware Detections</h2>
          <div className="space-y-3">
            {malwareAlerts.slice(0, 10).map((event) => (
              <Card key={event.id} className="p-4 border-purple-200 dark:border-purple-900">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4>Malware Detection</h4>
                      <Badge 
                        variant={event.severity === 'high' ? 'destructive' : 'default'}
                        className="capitalize"
                      >
                        {event.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-3">{event.details}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">User:</span>
                        <p className="font-medium">{event.username}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">IP:</span>
                        <p className="font-mono text-sm">{event.ip}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p>{event.location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk Score:</span>
                        <p className="font-medium text-purple-600">{event.risk_score}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {totalActiveAlerts === 0 && (
        <Card className="p-12 text-center">
          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="mb-2 text-muted-foreground">No Active Alerts</h3>
          <p className="text-sm text-muted-foreground">
            All systems operating normally. Alerts will appear here when detected.
          </p>
        </Card>
      )}
    </div>
  );
}

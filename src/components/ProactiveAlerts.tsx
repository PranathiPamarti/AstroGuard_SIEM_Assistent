import { SecurityEvent } from '../utils/syntheticData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface ProactiveAlertsProps {
  events: SecurityEvent[];
}

export function ProactiveAlerts({ events }: ProactiveAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Get high-risk events and anomalies
  const highRiskEvents = events.filter(
    e => (e.severity === 'high' || e.risk_score >= 80) && !dismissedAlerts.has(e.id)
  ).slice(0, 5);

  // Detect anomalies (multiple failed logins from same IP)
  const ipCounts = events.reduce((acc, e) => {
    if (e.eventType === 'failed_login') {
      acc[e.ip] = (acc[e.ip] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const suspiciousIPs = Object.entries(ipCounts)
    .filter(([_, count]) => count >= 5)
    .map(([ip]) => ip);

  const dismissAlert = (eventId: string) => {
    setDismissedAlerts(prev => new Set([...prev, eventId]));
  };

  if (highRiskEvents.length === 0 && suspiciousIPs.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-600 animate-pulse" />
          <h3 className="text-orange-900 dark:text-orange-100">Proactive Alerts</h3>
          <Badge variant="destructive" className="ml-auto">
            {highRiskEvents.length + suspiciousIPs.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {/* High Risk Events */}
          {highRiskEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 bg-background rounded-lg border border-orange-200 dark:border-orange-800"
            >
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {event.eventType.replace('_', ' ').toUpperCase()}
                  </p>
                  <Badge variant="destructive" className="text-xs">
                    Risk: {event.risk_score}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {event.ip} • {event.username} • {event.timestamp.toLocaleTimeString()}
                </p>
                <p className="text-xs">{event.details}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => dismissAlert(event.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {/* Anomaly Alerts */}
          {suspiciousIPs.map((ip) => (
            <div
              key={ip}
              className="flex items-start gap-3 p-3 bg-background rounded-lg border border-orange-200 dark:border-orange-800"
            >
              <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">ANOMALY DETECTED</p>
                  <Badge variant="outline" className="text-xs">
                    Pattern
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Multiple failed login attempts from {ip}
                </p>
                <p className="text-xs">
                  {ipCounts[ip]} failed attempts detected - possible brute force attack
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

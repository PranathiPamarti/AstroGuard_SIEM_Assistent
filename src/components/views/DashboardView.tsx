import { useState } from 'react';
import { StatsDashboard } from '../StatsDashboard';
import { Card } from '../ui/card';
import { SecurityEvent } from '../../utils/syntheticData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../UserProfile';

interface DashboardViewProps {
  allEvents: SecurityEvent[];
  highRiskEvents: number;
  activeThreats: number;
  detectionRate: number;
  onFilterApply?: (filter: { severity?: string; eventType?: string }) => void;
}

const SEVERITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
};

export function DashboardView({ 
  allEvents, 
  highRiskEvents, 
  activeThreats, 
  detectionRate,
  onFilterApply
}: DashboardViewProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Proactive Alerts
  const proactiveAlerts = [
    {
      id: 'alert-1',
      title: '🚨 High-Risk Events Detected',
      description: `${highRiskEvents} high-severity events require immediate attention`,
      severity: 'high' as const,
      action: () => onFilterApply?.({ severity: 'high' })
    },
    {
      id: 'alert-2',
      title: '🌍 Foreign Access Attempts',
      description: `${allEvents.filter(e => !e.location.includes(', IN')).length} access attempts from outside India detected`,
      severity: 'medium' as const,
      action: () => onFilterApply?.({ severity: 'high' })
    },
    {
      id: 'alert-3',
      title: '🦠 Malware Detections',
      description: `${allEvents.filter(e => e.eventType === 'malware_detection').length} malware incidents identified`,
      severity: 'high' as const,
      action: () => onFilterApply?.({ eventType: 'malware_detection' })
    }
  ].filter(alert => !dismissedAlerts.includes(alert.id));

  // Prepare data for recent activity
  const recentEvents = allEvents.slice(0, 10);

  // Timeline data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const timelineData = last7Days.map(date => {
    const dayEvents = allEvents.filter(e => 
      e.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === date
    );
    return {
      date,
      total: dayEvents.length,
      high: dayEvents.filter(e => e.severity === 'high').length,
      medium: dayEvents.filter(e => e.severity === 'medium').length,
      low: dayEvents.filter(e => e.severity === 'low').length,
    };
  });

  // Event type distribution
  const eventTypeCounts = allEvents.reduce((acc, event) => {
    const type = event.eventType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventTypeData = Object.entries(eventTypeCounts).map(([name, count]) => ({
    name: name.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: count
  }));

  // Top risky users
  const userRiskScores = allEvents.reduce((acc, event) => {
    if (!acc[event.username]) {
      acc[event.username] = { total: 0, count: 0, events: 0 };
    }
    acc[event.username].total += event.risk_score;
    acc[event.username].count++;
    acc[event.username].events++;
    return acc;
  }, {} as Record<string, { total: number; count: number; events: number }>);

  const topRiskyUsers = Object.entries(userRiskScores)
    .map(([username, data]) => ({
      username,
      avgRisk: Math.round(data.total / data.count),
      events: data.events
    }))
    .sort((a, b) => b.avgRisk - a.avgRisk)
    .slice(0, 5);

  const handlePieClick = (data: any) => {
    // Extract event type from the clicked slice
    const eventType = data.name.toLowerCase().replace(/\s+/g, '_');
    onFilterApply?.({ eventType });
  };

  const handleBarClick = (data: any) => {
    // Filter by severity when bar is clicked
    if (data && data.activeLabel) {
      onFilterApply?.({ severity: 'high' }); // Example: always filter high
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title + User Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-6"
      >
        <div className="flex-1">
          <h1>Security Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of ISRO cybersecurity posture
          </p>
        </div>
        <div className="w-80">
          <UserProfile compact />
        </div>
      </motion.div>

      {/* Proactive Alerts */}
      <AnimatePresence>
        {proactiveAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {proactiveAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-4 border-2 ${
                  alert.severity === 'high' 
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/20' 
                    : 'border-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="mb-1">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={alert.action}
                        className="whitespace-nowrap"
                      >
                        Investigate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <StatsDashboard
        totalEvents={allEvents.length}
        highRiskEvents={highRiskEvents}
        activeThreats={activeThreats}
        detectionRate={detectionRate}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <Card className="p-6">
          <h3 className="mb-4">Security Events Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total Events" />
              <Line type="monotone" dataKey="high" stroke={SEVERITY_COLORS.high} name="High Severity" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Event Type Distribution - CLICKABLE */}
        <Card className="p-6 group hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3>Event Type Distribution</h3>
            <Badge variant="outline" className="text-xs">Click to filter</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {eventTypeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(${index * 360 / eventTypeData.length}, 70%, 50%)`}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Severity Breakdown */}
        <Card className="p-6">
          <h3 className="mb-4">Severity Breakdown Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
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
        </Card>

        {/* Top Risky Users */}
        <Card className="p-6">
          <h3 className="mb-4">Top Risky Users</h3>
          <div className="space-y-3">
            {topRiskyUsers.map((user, index) => (
              <div key={user.username} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.events} events</p>
                  </div>
                </div>
                <Badge 
                  variant={user.avgRisk >= 70 ? 'destructive' : user.avgRisk >= 40 ? 'default' : 'secondary'}
                >
                  Risk: {user.avgRisk}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="mb-4">Recent Security Events</h3>
        <div className="space-y-3">
          {recentEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                event.severity === 'high' ? 'bg-red-100 dark:bg-red-950' :
                event.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-950' :
                'bg-green-100 dark:bg-green-950'
              }`}>
                {event.severity === 'high' ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <Shield className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium capitalize">{event.eventType.replace('_', ' ')}</p>
                  <Badge variant={
                    event.severity === 'high' ? 'destructive' :
                    event.severity === 'medium' ? 'default' : 'secondary'
                  } className="capitalize">
                    {event.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.details}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>👤 {event.username}</span>
                  <span>🌐 {event.ip}</span>
                  <span>📍 {event.location}</span>
                  <span>🕒 {event.timestamp.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-sm font-medium ${
                  event.risk_score >= 70 ? 'text-destructive' :
                  event.risk_score >= 40 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  Risk: {event.risk_score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

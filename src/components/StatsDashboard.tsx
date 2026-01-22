import { Activity, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

interface StatsDashboardProps {
  totalEvents: number;
  highRiskEvents: number;
  activeThreats: number;
  detectionRate: number;
}

export function StatsDashboard({ 
  totalEvents, 
  highRiskEvents, 
  activeThreats, 
  detectionRate 
}: StatsDashboardProps) {
  const stats = [
    {
      label: 'Total Events',
      value: totalEvents.toLocaleString(),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'High Risk Events',
      value: highRiskEvents.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      trend: '-8%',
      trendUp: false
    },
    {
      label: 'Active Threats',
      value: activeThreats.toLocaleString(),
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      trend: '+5%',
      trendUp: true
    },
    {
      label: 'Detection Rate',
      value: `${detectionRate}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      trend: '+3%',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last 24h</span>
                </div>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

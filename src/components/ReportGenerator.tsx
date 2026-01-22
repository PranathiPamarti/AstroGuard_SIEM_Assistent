import { useState } from 'react';
import { SecurityEvent } from '../utils/syntheticData';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Download, BarChart3, Table, FileSpreadsheet } from 'lucide-react';
import { Badge } from './ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportGeneratorProps {
  events: SecurityEvent[];
}

type ReportType = 'executive' | 'detailed' | 'compliance' | 'threat';

const SEVERITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
};

export function ReportGenerator({ events }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('executive');
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const report = {
        type: reportType,
        generatedAt: new Date(),
        summary: generateSummary(),
        stats: calculateStats(),
        chartData: prepareChartData(),
        tableData: prepareTableData()
      };
      
      setGeneratedReport(report);
      setIsGenerating(false);
    }, 1000);
  };

  const generateSummary = (): string => {
    const total = events.length;
    const high = events.filter(e => e.severity === 'high').length;
    const missionCritical = events.filter(e => e.isMissionCritical).length;
    
    switch (reportType) {
      case 'executive':
        return `Executive Summary: Analyzed ${total} security events over the past 30 days. Detected ${high} high-severity incidents requiring immediate attention. ${missionCritical} mission-critical events identified affecting ISRO ground stations, telemetry systems, and satellite operations.`;
      case 'detailed':
        return `Detailed Analysis: Comprehensive examination of ${total} security events reveals ${high} high-severity threats, ${events.filter(e => e.severity === 'medium').length} medium-severity incidents, and ${events.filter(e => e.severity === 'low').length} low-severity events. Mission-critical infrastructure affected in ${missionCritical} cases.`;
      case 'compliance':
        return `Compliance Report: Security audit covering ${total} events for CERT-In compliance. All incidents logged with complete audit trail. ${high} high-priority incidents flagged for mandatory reporting. MITRE ATT&CK framework applied to ${events.filter(e => e.mitreAttack).length} events.`;
      case 'threat':
        return `Threat Intelligence Report: Active threat landscape analysis of ${total} security events. ${high} critical threats detected with ${events.filter(e => e.eventType === 'malware_detection').length} malware incidents and ${events.filter(e => !e.location.includes(', IN')).length} foreign access attempts identified.`;
      default:
        return '';
    }
  };

  const calculateStats = () => {
    return {
      total: events.length,
      high: events.filter(e => e.severity === 'high').length,
      medium: events.filter(e => e.severity === 'medium').length,
      low: events.filter(e => e.severity === 'low').length,
      missionCritical: events.filter(e => e.isMissionCritical).length,
      foreignAccess: events.filter(e => !e.location.includes(', IN')).length,
      malware: events.filter(e => e.eventType === 'malware_detection').length,
      avgRiskScore: Math.round(events.reduce((sum, e) => sum + e.risk_score, 0) / events.length)
    };
  };

  const prepareChartData = () => {
    // Event type distribution
    const eventTypeCounts = events.reduce((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventTypeData = Object.entries(eventTypeCounts).map(([name, count]) => ({
      name: name.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      count
    }));

    // Severity distribution
    const severityData = [
      { name: 'High', value: events.filter(e => e.severity === 'high').length, color: SEVERITY_COLORS.high },
      { name: 'Medium', value: events.filter(e => e.severity === 'medium').length, color: SEVERITY_COLORS.medium },
      { name: 'Low', value: events.filter(e => e.severity === 'low').length, color: SEVERITY_COLORS.low }
    ];

    // Timeline data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const timelineData = last7Days.map(date => {
      const dayEvents = events.filter(e => 
        e.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === date
      );
      return {
        date,
        total: dayEvents.length,
        high: dayEvents.filter(e => e.severity === 'high').length
      };
    });

    return { eventTypeData, severityData, timelineData };
  };

  const prepareTableData = () => {
    // Top 10 high-risk events
    return events
      .filter(e => e.severity === 'high')
      .slice(0, 10)
      .map(e => ({
        id: e.id,
        timestamp: e.timestamp.toLocaleString(),
        type: e.eventType.replace(/_/g, ' '),
        ip: e.ip,
        username: e.username,
        riskScore: e.risk_score,
        mitre: e.mitreAttack
      }));
  };

  const exportToPDF = () => {
    // Create HTML content for PDF-like export
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>ISRO SIEM Security Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #ff6b35; border-bottom: 3px solid #ff6b35; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #ff6b35; }
    .summary { background: #f5f5f5; padding: 20px; border-left: 4px solid #ff6b35; margin: 20px 0; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .stat-card { background: white; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
    .stat-value { font-size: 32px; font-weight: bold; color: #ff6b35; }
    .stat-label { color: #666; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #ff6b35; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f9f9f9; }
    .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .badge-high { background: #fee; color: #d00; }
    .badge-medium { background: #ffc; color: #860; }
    .badge-low { background: #efe; color: #060; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🛰️ ISRO Conversational SIEM</div>
    <h1>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Security Report</h1>
    <p>Generated: ${generatedReport?.generatedAt.toLocaleString()}</p>
    <p><strong>Classification: RESTRICTED</strong></p>
  </div>

  <div class="summary">
    <h2>📊 Executive Summary</h2>
    <p>${generatedReport?.summary}</p>
  </div>

  <h2>📈 Key Statistics</h2>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${generatedReport?.stats.total}</div>
      <div class="stat-label">Total Events</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${generatedReport?.stats.high}</div>
      <div class="stat-label">High Severity</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${generatedReport?.stats.missionCritical}</div>
      <div class="stat-label">Mission Critical</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${generatedReport?.stats.avgRiskScore}</div>
      <div class="stat-label">Avg Risk Score</div>
    </div>
  </div>

  <h2>🚨 Top High-Risk Events</h2>
  <table>
    <thead>
      <tr>
        <th>Event ID</th>
        <th>Timestamp</th>
        <th>Type</th>
        <th>IP Address</th>
        <th>Username</th>
        <th>Risk Score</th>
        <th>MITRE ATT&CK</th>
      </tr>
    </thead>
    <tbody>
      ${generatedReport?.tableData.map((row: any) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.timestamp}</td>
          <td>${row.type}</td>
          <td><code>${row.ip}</code></td>
          <td>${row.username}</td>
          <td><span class="badge badge-high">${row.riskScore}</span></td>
          <td>${row.mitre || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>📋 Recommendations</h2>
  <ul>
    <li>Immediate investigation required for ${generatedReport?.stats.high} high-severity incidents</li>
    <li>Review and strengthen access controls for ${generatedReport?.stats.missionCritical} mission-critical systems</li>
    <li>Implement geo-blocking for ${generatedReport?.stats.foreignAccess} unauthorized foreign access attempts</li>
    <li>Update malware signatures and conduct full system scan (${generatedReport?.stats.malware} detections)</li>
    <li>Conduct security awareness training for affected users</li>
  </ul>

  <div class="footer">
    <p>© 2025 ISRO Conversational SIEM • CERT-In Compliant • Smart India Hackathon 2025</p>
    <p><strong>CONFIDENTIAL - For Official Use Only</strong></p>
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ISRO-SIEM-${reportType}-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'Type', 'Severity', 'IP', 'Username', 'Risk Score', 'MITRE ATT&CK'];
    const rows = events.slice(0, 100).map(e => [
      e.id,
      e.timestamp.toISOString(),
      e.eventType,
      e.severity,
      e.ip,
      e.username,
      e.risk_score,
      e.mitreAttack || 'N/A'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ISRO-SIEM-data-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card className="p-6">
        <h3 className="mb-4">Generate Security Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-2 block">Report Type</label>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Executive Summary</SelectItem>
                <SelectItem value="detailed">Detailed Analysis</SelectItem>
                <SelectItem value="compliance">Compliance Report</SelectItem>
                <SelectItem value="threat">Threat Intelligence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              <FileText className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <>
          {/* Summary */}
          <Card className="p-6 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 border-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-2">
                  {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generated: {generatedReport.generatedAt.toLocaleString()}
                </p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                RESTRICTED
              </Badge>
            </div>
            <p className="leading-relaxed">{generatedReport.summary}</p>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Events</p>
              <p className="text-3xl font-semibold">{generatedReport.stats.total}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">High Severity</p>
              <p className="text-3xl font-semibold text-red-600">{generatedReport.stats.high}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Mission Critical</p>
              <p className="text-3xl font-semibold text-orange-600">{generatedReport.stats.missionCritical}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Avg Risk Score</p>
              <p className="text-3xl font-semibold">{generatedReport.stats.avgRiskScore}</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="mb-4">Event Timeline (Last 7 Days)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={generatedReport.chartData.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total" />
                  <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} name="High Severity" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h4 className="mb-4">Severity Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={generatedReport.chartData.severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {generatedReport.chartData.severityData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h4 className="mb-4">Event Type Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={generatedReport.chartData.eventTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff6b35" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Table */}
          <Card className="p-6">
            <h4 className="mb-4">Top High-Risk Events</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Event ID</th>
                    <th className="text-left p-3">Timestamp</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">IP</th>
                    <th className="text-left p-3">Username</th>
                    <th className="text-left p-3">Risk</th>
                    <th className="text-left p-3">MITRE ATT&CK</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedReport.tableData.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">{row.id}</td>
                      <td className="p-3 text-sm">{row.timestamp}</td>
                      <td className="p-3 text-sm capitalize">{row.type}</td>
                      <td className="p-3 font-mono text-sm">{row.ip}</td>
                      <td className="p-3 text-sm">{row.username}</td>
                      <td className="p-3">
                        <Badge variant="destructive">{row.riskScore}</Badge>
                      </td>
                      <td className="p-3 text-xs">{row.mitre || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Export Options */}
          <Card className="p-6">
            <h4 className="mb-4">Export Report</h4>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={exportToPDF} variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Export as HTML/PDF
              </Button>
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export Data (CSV)
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Reports include textual summaries, statistical tables, and graphical charts for comprehensive analysis.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}

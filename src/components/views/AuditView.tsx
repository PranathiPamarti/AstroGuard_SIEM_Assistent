import { AuditLogPanel } from '../AuditLogPanel';
import { QueryResult } from '../../utils/queryProcessor';
import { Card } from '../ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  query: string;
  result: QueryResult;
}

interface AuditViewProps {
  auditLogs: AuditLogEntry[];
}

export function AuditView({ auditLogs }: AuditViewProps) {
  const handleExportAuditLog = () => {
    const data = auditLogs.map(log => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      query: log.query,
      intent: log.result.intent.action,
      confidence: log.result.intent.confidence,
      dslQuery: log.result.dslQuery,
      kqlQuery: log.result.kqlQuery,
      resultsCount: log.result.events.length,
      summary: log.result.summary
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Audit Logs</h1>
          <p className="text-muted-foreground">
            Complete history of all queries and system actions
          </p>
        </div>
        {auditLogs.length > 0 && (
          <Button onClick={handleExportAuditLog} className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        )}
      </div>

      {/* Statistics */}
      {auditLogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Queries</p>
            <p className="text-3xl font-semibold mt-1">{auditLogs.length}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
            <p className="text-3xl font-semibold mt-1">
              {Math.round((auditLogs.reduce((sum, log) => sum + log.result.intent.confidence, 0) / auditLogs.length) * 100)}%
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Events Found</p>
            <p className="text-3xl font-semibold mt-1">
              {auditLogs.reduce((sum, log) => sum + log.result.events.length, 0).toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Latest Query</p>
            <p className="text-lg font-semibold mt-1">
              {auditLogs[0]?.timestamp.toLocaleTimeString() || 'N/A'}
            </p>
          </Card>
        </div>
      )}

      {/* Audit Log Panel */}
      <div>
        <AuditLogPanel logs={auditLogs} />
      </div>

      {auditLogs.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="mb-2 text-muted-foreground">No Audit Logs Yet</h3>
          <p className="text-sm text-muted-foreground">
            Query logs will appear here as you use the AI Assistant
          </p>
        </Card>
      )}
    </div>
  );
}

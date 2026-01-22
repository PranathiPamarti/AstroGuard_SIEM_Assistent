import { useState } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, FileText, Copy, Check } from 'lucide-react';
import { QueryResult } from '../utils/queryProcessor';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  query: string;
  result: QueryResult;
}

interface AuditLogPanelProps {
  logs: AuditLogEntry[];
}

export function AuditLogPanel({ logs }: AuditLogPanelProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleLog = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
  };

  const copyToClipboard = async (log: AuditLogEntry) => {
    const logData = {
      timestamp: log.timestamp.toISOString(),
      query: log.query,
      intent: log.result.intent,
      dslQuery: log.result.dslQuery,
      kqlQuery: log.result.kqlQuery,
      summary: log.result.summary,
      stats: log.result.stats,
      eventCount: log.result.events.length
    };
    
    await navigator.clipboard.writeText(JSON.stringify(logData, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (logs.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[200px]">
          <FileText className="h-12 w-12 mb-3 opacity-50" />
          <p>No audit logs yet</p>
          <p className="text-sm">Query logs will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {logs.map((log) => {
            const isExpanded = expandedLogs.has(log.id);
            
            return (
              <div key={log.id} className="border rounded-lg overflow-hidden">
                {/* Log Header */}
                <div 
                  className="flex items-center justify-between p-3 bg-muted hover:bg-muted/80 cursor-pointer"
                  onClick={() => toggleLog(log.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{log.query}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.timestamp.toLocaleString()} • {log.result.stats.total} events
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(log);
                      }}
                    >
                      {copiedId === log.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {/* Log Details */}
                {isExpanded && (
                  <div className="p-3 border-t space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Intent:</span>
                      <span className="ml-2 capitalize">{log.result.intent.action}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="ml-2">{Math.round(log.result.intent.confidence * 100)}%</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">DSL Query:</span>
                      <div className="mt-1 p-2 bg-background rounded font-mono text-xs overflow-x-auto">
                        {log.result.dslQuery}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">KQL Query:</span>
                      <div className="mt-1 p-2 bg-background rounded font-mono text-xs overflow-x-auto">
                        {log.result.kqlQuery}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Results:</span>
                      <div className="mt-1 p-2 bg-background rounded text-xs">
                        Total: {log.result.stats.total} | 
                        High: {log.result.stats.highSeverity} | 
                        Medium: {log.result.stats.mediumSeverity} | 
                        Low: {log.result.stats.lowSeverity}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Summary:</span>
                      <p className="mt-1 text-xs">{log.result.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}

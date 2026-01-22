import { QueryIntent } from '../utils/queryProcessor';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Target, Code, Zap } from 'lucide-react';
import { Progress } from './ui/progress';

interface XAIPanelProps {
  intent: QueryIntent;
  dslQuery: string;
  kqlQuery: string;
}

export function XAIPanel({ intent, dslQuery, kqlQuery }: XAIPanelProps) {
  const confidencePercentage = Math.round(intent.confidence * 100);
  
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3>Query Analysis (XAI)</h3>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span>Confidence Score</span>
            </div>
            <span className={`font-medium ${
              confidencePercentage >= 80 ? 'text-green-600' :
              confidencePercentage >= 60 ? 'text-yellow-600' :
              'text-orange-600'
            }`}>
              {confidencePercentage}%
            </span>
          </div>
          <Progress value={confidencePercentage} className="h-2" />
        </div>

        {/* Detected Intent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>Detected Intent</span>
          </div>
          <Badge variant="outline" className="capitalize">
            {intent.action}
          </Badge>
        </div>

        {/* Detected Entities */}
        <div className="space-y-3">
          <h4>Detected Entities</h4>
          
          <div className="space-y-3 text-sm">
            {intent.entities.eventType && (
              <div className="flex flex-wrap gap-2 items-start">
                <span className="text-muted-foreground min-w-[100px]">Event Type:</span>
                <div className="flex flex-wrap gap-1">
                  {intent.entities.eventType.map((type, idx) => (
                    <Badge key={idx} variant="secondary" className="capitalize">
                      {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {intent.entities.timeRange && (
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground min-w-[100px]">Time Range:</span>
                <Badge variant="secondary" className="capitalize">
                  {intent.entities.timeRange.replace('_', ' ')}
                </Badge>
              </div>
            )}

            {intent.entities.severity && (
              <div className="flex flex-wrap gap-2 items-start">
                <span className="text-muted-foreground min-w-[100px]">Severity:</span>
                <div className="flex flex-wrap gap-1">
                  {intent.entities.severity.map((sev, idx) => (
                    <Badge 
                      key={idx} 
                      variant={sev === 'high' ? 'destructive' : 'secondary'}
                      className="capitalize"
                    >
                      {sev}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {intent.entities.username && (
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground min-w-[100px]">Username:</span>
                <Badge variant="secondary">{intent.entities.username}</Badge>
              </div>
            )}

            {!intent.entities.eventType && 
             !intent.entities.timeRange && 
             !intent.entities.severity && 
             !intent.entities.username && (
              <p className="text-muted-foreground italic">No specific entities detected</p>
            )}
          </div>
        </div>

        {/* Query Translation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <h4>Query Translation</h4>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-sm text-muted-foreground">DSL Query:</label>
              <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm overflow-x-auto">
                {dslQuery}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">KQL Query:</label>
              <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm overflow-x-auto">
                {kqlQuery}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

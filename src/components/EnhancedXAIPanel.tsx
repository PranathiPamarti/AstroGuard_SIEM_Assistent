import { QueryIntent } from '../utils/queryProcessor';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Target, Code, Zap, TrendingUp, ArrowRight } from 'lucide-react';

interface EnhancedXAIPanelProps {
  intent: QueryIntent;
  dslQuery: string;
  kqlQuery: string;
  originalQuery: string;
}

export function EnhancedXAIPanel({ intent, dslQuery, kqlQuery, originalQuery }: EnhancedXAIPanelProps) {
  const confidencePercentage = Math.round(intent.confidence * 100);
  
  // Calculate gauge rotation (0-180 degrees for semicircle)
  const gaugeRotation = (confidencePercentage / 100) * 180 - 90;
  
  // Get confidence color
  const getConfidenceColor = () => {
    if (confidencePercentage >= 80) return 'text-green-600';
    if (confidencePercentage >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceBgColor = () => {
    if (confidencePercentage >= 80) return 'from-green-500 to-emerald-500';
    if (confidencePercentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  // Entity color coding
  const getEntityColor = (type: string) => {
    switch (type) {
      case 'eventType':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'timeRange':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'severity':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'username':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="leading-none mb-1">Query Analysis (XAI)</h3>
          <p className="text-xs text-muted-foreground">Explainable AI Breakdown</p>
        </div>
      </div>

      {/* Confidence Gauge */}
      <Card className="p-6 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-950/20 border-2">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-yellow-600" />
          <h4>Confidence Score</h4>
        </div>
        
        <div className="relative flex flex-col items-center">
          {/* Semicircle Gauge */}
          <div className="relative w-40 h-20 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Background arc */}
              <div className="absolute w-36 h-36 rounded-full border-8 border-gray-200 dark:border-gray-700" 
                   style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }} />
              
              {/* Colored arc */}
              <div 
                className={`absolute w-36 h-36 rounded-full border-8 bg-gradient-to-r ${getConfidenceBgColor()} border-transparent`}
                style={{ 
                  clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
                  opacity: 0.3
                }} 
              />
              
              {/* Needle */}
              <div 
                className="absolute w-0.5 h-16 bg-gradient-to-b from-gray-800 dark:from-white to-transparent origin-bottom transition-transform duration-1000 ease-out"
                style={{ 
                  transform: `rotate(${gaugeRotation}deg)`,
                  bottom: '50%',
                  left: 'calc(50% - 1px)'
                }}
              />
              
              {/* Center dot */}
              <div className="absolute w-3 h-3 rounded-full bg-gray-800 dark:bg-white" style={{ bottom: 'calc(50% - 6px)', left: 'calc(50% - 6px)' }} />
            </div>
          </div>
          
          {/* Percentage Display */}
          <div className="mt-2 text-center">
            <p className={`text-4xl font-semibold ${getConfidenceColor()}`}>
              {confidencePercentage}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {confidencePercentage >= 80 ? 'High Confidence' : 
               confidencePercentage >= 60 ? 'Medium Confidence' : 'Low Confidence'}
            </p>
          </div>
        </div>
      </Card>

      {/* Before/After Preview */}
      <Card className="p-4 space-y-3">
        <h4 className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          Query Transformation
        </h4>
        
        <div className="space-y-2">
          {/* User Query */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">User Asked:</span>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm italic">"{originalQuery}"</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Interpreted Intent */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs text-muted-foreground">AI Interpreted:</span>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm capitalize">
                <strong>Action:</strong> {intent.action}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(intent.entities).map(([key, value]) => {
                  if (!value) return null;
                  const displayValue = Array.isArray(value) ? value.join(', ') : value;
                  return (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {displayValue}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detected Intent */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-orange-600" />
          <h4>Detected Intent</h4>
        </div>
        <Badge variant="outline" className="capitalize bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-300">
          {intent.action}
        </Badge>
      </Card>

      {/* Detected Entities - Color Coded */}
      <Card className="p-4">
        <h4 className="mb-3">Detected Entities</h4>
        
        <div className="space-y-3 text-sm">
          {intent.entities.eventType && (
            <div className="flex flex-wrap gap-2 items-start">
              <span className="text-muted-foreground min-w-[80px] text-xs uppercase font-medium">Event Type:</span>
              <div className="flex flex-wrap gap-1">
                {intent.entities.eventType.map((type, idx) => (
                  <Badge key={idx} variant="outline" className={`capitalize ${getEntityColor('eventType')}`}>
                    🎯 {type.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {intent.entities.timeRange && (
            <div className="flex gap-2 items-center">
              <span className="text-muted-foreground min-w-[80px] text-xs uppercase font-medium">Time Range:</span>
              <Badge variant="outline" className={`capitalize ${getEntityColor('timeRange')}`}>
                🕒 {intent.entities.timeRange.replace('_', ' ')}
              </Badge>
            </div>
          )}

          {intent.entities.severity && (
            <div className="flex flex-wrap gap-2 items-start">
              <span className="text-muted-foreground min-w-[80px] text-xs uppercase font-medium">Severity:</span>
              <div className="flex flex-wrap gap-1">
                {intent.entities.severity.map((sev, idx) => (
                  <Badge key={idx} variant="outline" className={`capitalize ${getEntityColor('severity')}`}>
                    ⚠️ {sev}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {intent.entities.username && (
            <div className="flex gap-2 items-center">
              <span className="text-muted-foreground min-w-[80px] text-xs uppercase font-medium">Username:</span>
              <Badge variant="outline" className={getEntityColor('username')}>
                👤 {intent.entities.username}
              </Badge>
            </div>
          )}

          {!intent.entities.eventType && 
           !intent.entities.timeRange && 
           !intent.entities.severity && 
           !intent.entities.username && (
            <p className="text-muted-foreground italic text-xs">No specific entities detected</p>
          )}
        </div>
      </Card>

      {/* Query Translation */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Code className="h-4 w-4 text-green-600" />
          <h4>Query Translation</h4>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground uppercase font-medium">DSL Query:</label>
            <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-900 rounded-md font-mono text-xs overflow-x-auto border">
              {dslQuery}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase font-medium">KQL Query:</label>
            <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-900 rounded-md font-mono text-xs overflow-x-auto border">
              {kqlQuery}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

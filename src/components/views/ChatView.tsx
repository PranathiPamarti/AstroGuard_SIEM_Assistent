import { useState } from 'react';
import { QueryInput } from '../QueryInput';
import { ConversationHistory, ConversationMessage } from '../ConversationHistory';
import { EnhancedResultsPanel } from '../EnhancedResultsPanel';
import { EnhancedXAIPanel } from '../EnhancedXAIPanel';
import { QueryResult } from '../../utils/queryProcessor';
import { Card } from '../ui/card';
import { Brain, Sparkles, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ChatViewProps {
  messages: ConversationMessage[];
  currentResult: QueryResult | null;
  isProcessing: boolean;
  onQuery: (query: string) => void;
}

export function ChatView({ messages, currentResult, isProcessing, onQuery }: ChatViewProps) {
  const [lastQuery, setLastQuery] = useState('');

  const handleQuery = (query: string) => {
    setLastQuery(query);
    onQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1>AI Security Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions in natural language and get instant security insights
        </p>
      </div>

      {/* Info Banner */}
      <Alert className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 border-orange-200 dark:border-orange-800">
        <Sparkles className="h-4 w-4 text-orange-600" />
        <AlertDescription>
          <strong>ISRO AI Copilot:</strong> Query mission-critical security events using voice or text. 
          Try: "Show ground station access attempts" or "Display telemetry data access with high risk"
        </AlertDescription>
      </Alert>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Conversation & Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversation History */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3>Conversation</h3>
            </div>
            <ConversationHistory messages={messages} />
          </Card>

          {/* Query Input */}
          <Card className="p-6">
            <h3 className="mb-4">Ask a Question</h3>
            <QueryInput onSubmit={handleQuery} isProcessing={isProcessing} />
          </Card>
        </div>

        {/* Right: XAI Panel */}
        <div>
          {currentResult ? (
            <EnhancedXAIPanel
              intent={currentResult.intent}
              dslQuery={currentResult.dslQuery}
              kqlQuery={currentResult.kqlQuery}
              originalQuery={lastQuery}
            />
          ) : (
            <Card className="p-12 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="mb-2 text-muted-foreground">No Analysis Yet</h3>
              <p className="text-sm text-muted-foreground">
                Ask a question to see how the AI interprets your query with explainable AI
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Results Section */}
      {currentResult && (
        <div>
          <h2 className="mb-4">Query Results</h2>
          <EnhancedResultsPanel
            summary={currentResult.summary}
            events={currentResult.events}
            stats={currentResult.stats}
          />
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { VoiceInput } from './VoiceInput';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isProcessing?: boolean;
}

const exampleQueries = [
  "Show ground station access attempts",
  "Display telemetry data access last 7 days",
  "Show mission-critical events with high risk"
];

export function QueryInput({ onSubmit, isProcessing }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setQuery(transcript);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about security events... Try 'Show ground station access attempts' or use voice input"
            className="min-h-[80px] pr-24 resize-none"
            disabled={isProcessing}
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <VoiceInput onTranscript={handleVoiceTranscript} disabled={isProcessing} />
            <Button
              onClick={handleSubmit}
              disabled={!query.trim() || isProcessing}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-sm">Try:</span>
        </div>
        {exampleQueries.map((example, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => setQuery(example)}
            disabled={isProcessing}
            className="h-7"
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  );
}

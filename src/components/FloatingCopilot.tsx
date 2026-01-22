import { useState } from 'react';
import { MessageSquare, X, Sparkles, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { VoiceInput } from './VoiceInput';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingCopilotProps {
  onQuery: (query: string) => void;
  isProcessing: boolean;
}

export function FloatingCopilot({ onQuery, isProcessing }: FloatingCopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onQuery(input.trim());
      setInput('');
    }
  };

  const handleVoiceInput = (transcript: string) => {
    onQuery(transcript);
  };

  const quickActions = [
    'Show high risk events',
    'Mission-critical alerts',
    'Foreign access attempts',
    'Recent malware detections'
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 group relative overflow-hidden"
            >
              <Sparkles className="h-6 w-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-96"
          >
            <Card className="shadow-2xl border-2 border-orange-200 dark:border-orange-800 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <div>
                    <h4 className="text-white">AstroGuard Copilot</h4>
                    <p className="text-xs text-white/80">AI Assistant • Always Available</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-muted/30 border-b">
                <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950 transition-colors"
                      onClick={() => onQuery(action)}
                    >
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border-b flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-blue-600">AstroGuard is thinking...</span>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about security events..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-background text-sm"
                    disabled={isProcessing}
                  />
                  <VoiceInput onTranscript={handleVoiceInput} disabled={isProcessing} />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isProcessing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Footer */}
              <div className="px-4 py-2 bg-muted/30 text-xs text-center text-muted-foreground border-t">
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded border">Ctrl+K</kbd> to toggle
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

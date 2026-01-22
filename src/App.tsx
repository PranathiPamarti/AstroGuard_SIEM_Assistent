import { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { Sidebar } from './components/Sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { FloatingCopilot } from './components/FloatingCopilot';
import { DashboardView } from './components/views/DashboardView';
import { ChatView } from './components/views/ChatView';
import { ThreatMapView } from './components/ThreatMapView';
import { EventExplorerView } from './components/views/EventExplorerView';
import { ReportsView } from './components/views/ReportsView';
import { MissionModeView } from './components/views/MissionModeView';
import { ConversationMessage } from './components/ConversationHistory';
import { getSecurityEvents } from './utils/syntheticData';
import { processQuery, QueryResult } from './utils/queryProcessor';
import { Toaster } from './components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  query: string;
  result: QueryResult;
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allEvents] = useState(() => getSecurityEvents());

  // Keyboard shortcut for copilot (Ctrl+K)
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle copilot - this will be handled by FloatingCopilot component
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  // Show welcome message on mount
  useEffect(() => {
    const welcomeMessage: ConversationMessage = {
      id: 'welcome',
      type: 'assistant',
      content: 'Welcome to AstroGuard! I\'m your AI copilot for ISRO cybersecurity. Ask me about failed logins, mission-critical events, telemetry access, or any security concerns.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleQuery = (query: string) => {
    setIsProcessing(true);
    
    // Show toast notification
    toast.info('Processing your query...', {
      duration: 1000
    });

    // Add user message
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: query,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate processing delay for realism
    setTimeout(() => {
      // Process query with context from previous query if available
      const previousContext = currentResult?.intent;
      const result = processQuery(query, allEvents, previousContext);
      
      // Create audit log entry
      const auditEntry: AuditLogEntry = {
        id: `audit-${Date.now()}`,
        timestamp: new Date(),
        query,
        result
      };
      setAuditLogs(prev => [auditEntry, ...prev]);

      // Add assistant response
      const assistantMessage: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: result.summary,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update current result
      setCurrentResult(result);
      setIsProcessing(false);
      
      // Success toast
      toast.success(`Found ${result.events.length} events`, {
        description: `Confidence: ${result.confidence}%`
      });
    }, 800);
  };

  // Calculate dashboard statistics
  const highRiskEvents = allEvents.filter(e => e.severity === 'high').length;
  const activeThreats = allEvents.filter(e => 
    e.eventType === 'malware_detection' || 
    (e.eventType === 'failed_login' && e.severity === 'high')
  ).length;
  const detectionRate = 97.5; // Mock detection rate for demo

  // Render current view with animations
  const renderView = () => {
    const viewKey = currentView;
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {(() => {
            switch (currentView) {
              case 'dashboard':
                return (
                  <DashboardView
                    allEvents={allEvents}
                    highRiskEvents={highRiskEvents}
                    activeThreats={activeThreats}
                    detectionRate={detectionRate}
                    onFilterApply={(filter) => {
                      // Navigate to event explorer with filter applied
                      setCurrentView('explorer');
                      toast.info(`Filtering by ${filter.severity || filter.eventType}`);
                    }}
                  />
                );
              case 'chat':
                return (
                  <ChatView
                    messages={messages}
                    currentResult={currentResult}
                    isProcessing={isProcessing}
                    onQuery={handleQuery}
                  />
                );
              case 'threatmap':
                return <ThreatMapView events={allEvents} />;
              case 'explorer':
                return <EventExplorerView allEvents={allEvents} auditLogs={auditLogs} />;
              case 'reports':
                return <ReportsView allEvents={allEvents} />;
              case 'mission':
                return (
                  <MissionModeView
                    allEvents={allEvents}
                    onNavigate={setCurrentView}
                    onQuery={handleQuery}
                  />
                );
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Show welcome screen first
  if (showWelcome) {
    return (
      <>
        <WelcomePage onGetStarted={() => setShowWelcome(false)} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar Navigation */}
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="capitalize">{currentView.replace('_', ' ')}</h2>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {renderView()}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t py-4 bg-card">
            <div className="px-6 text-center text-sm text-muted-foreground">
              <p>© 2025 AstroGuard • ISRO Cybersecurity Platform • Smart India Hackathon 2025</p>
              <p className="text-xs mt-1">AI Copilot for Space Security • CERT-In Compliant</p>
            </div>
          </footer>
        </div>

        {/* Floating Copilot - Available Everywhere */}
        {currentView !== 'chat' && (
          <FloatingCopilot onQuery={handleQuery} isProcessing={isProcessing} />
        )}
      </div>
      <Toaster />
    </>
  );
}

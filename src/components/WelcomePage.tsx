import { Shield, Satellite, Brain, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* ISRO Inspired Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl mb-6 relative">
            <Satellite className="h-12 w-12 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-ping" />
          </div>
          
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-orange-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AstroGuard
          </h1>
          
          <p className="text-2xl text-muted-foreground mb-2">
            AI Copilot for ISRO Cybersecurity
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Next-generation Security Information & Event Management powered by Explainable AI.
            Protect mission-critical satellite operations with natural language security analytics.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              onClick={() => window.open('https://www.isro.gov.in', '_blank')}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              About ISRO
            </Button>
          </div>

          {/* Smart India Hackathon Badge */}
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 border border-green-300 dark:border-green-800 rounded-full">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              🏆 Smart India Hackathon 2025 • ISRO Problem Statement
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2">Natural Language AI</h3>
            <p className="text-sm text-muted-foreground">
              Query security events in plain English. No complex syntax required.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2">Mission-Critical Protection</h3>
            <p className="text-sm text-muted-foreground">
              Specialized monitoring for ground stations, telemetry, and satellite control.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2">Explainable AI</h3>
            <p className="text-sm text-muted-foreground">
              Complete transparency with confidence scores and query interpretation.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2">Proactive Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Automatic anomaly detection with MITRE ATT&CK framework integration.
            </p>
          </Card>
        </div>

        {/* Key Features Section */}
        <Card className="p-8 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-950 border-2">
          <h2 className="mb-6 text-center">Why Choose Our SIEM Solution?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Multi-Turn Conversational AI</h4>
                  <p className="text-sm text-muted-foreground">Context-aware follow-up queries for progressive refinement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Geo-Visualization</h4>
                  <p className="text-sm text-muted-foreground">World map view of suspicious login attempts and threats</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Real-Time Analytics</h4>
                  <p className="text-sm text-muted-foreground">Dynamic charts, tables, and severity-coded visualizations</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Compliance Ready</h4>
                  <p className="text-sm text-muted-foreground">CERT-In aligned with comprehensive audit logs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">MITRE ATT&CK Integration</h4>
                  <p className="text-sm text-muted-foreground">Industry-standard threat classification and tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Voice-Enabled Queries</h4>
                  <p className="text-sm text-muted-foreground">Hands-free security operations with voice commands</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Built for ISRO's Space Security Operations • Powered by AI & Machine Learning</p>
        </div>
      </div>
    </div>
  );
}

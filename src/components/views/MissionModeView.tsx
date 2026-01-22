import { useState } from 'react';
import { SecurityEvent } from '../../utils/syntheticData';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, AlertTriangle, Search, Map, FileText, CheckCircle2, 
  ArrowRight, Sparkles, Shield, TrendingUp 
} from 'lucide-react';

interface MissionModeViewProps {
  allEvents: SecurityEvent[];
  onNavigate: (view: string) => void;
  onQuery: (query: string) => void;
}

const missions = [
  {
    id: 'breach-investigation',
    title: '🚨 Investigate Security Breach',
    difficulty: 'Critical',
    description: 'Multiple high-severity events detected from foreign IP addresses accessing mission-critical systems.',
    steps: [
      {
        id: 1,
        title: 'Identify the Threat',
        description: 'Review high-risk events from the past 24 hours',
        action: 'dashboard',
        query: 'Show high risk events in last 24 hours',
        completed: false
      },
      {
        id: 2,
        title: 'Geolocate Attack Sources',
        description: 'Check the threat map for foreign access patterns',
        action: 'threatmap',
        query: null,
        completed: false
      },
      {
        id: 3,
        title: 'Analyze with AI',
        description: 'Use AI assistant to filter mission-critical events',
        action: 'chat',
        query: 'Show mission-critical events with foreign IP addresses',
        completed: false
      },
      {
        id: 4,
        title: 'Generate Compliance Report',
        description: 'Create detailed incident report for CERT-In',
        action: 'reports',
        query: null,
        completed: false
      }
    ]
  },
  {
    id: 'malware-response',
    title: '🦠 Malware Outbreak Response',
    difficulty: 'High',
    description: 'Multiple malware detections across ISRO ground stations. Contain and document the incident.',
    steps: [
      {
        id: 1,
        title: 'Check Active Alerts',
        description: 'Review all malware detection alerts',
        action: 'dashboard',
        query: 'Show all malware detections',
        completed: false
      },
      {
        id: 2,
        title: 'Identify Affected Systems',
        description: 'Map infected locations and systems',
        action: 'threatmap',
        query: null,
        completed: false
      },
      {
        id: 3,
        title: 'Analyze Attack Pattern',
        description: 'Use AI to find common indicators',
        action: 'chat',
        query: 'Analyze malware detection patterns',
        completed: false
      },
      {
        id: 4,
        title: 'Document Findings',
        description: 'Generate threat intelligence report',
        action: 'reports',
        query: null,
        completed: false
      }
    ]
  },
  {
    id: 'insider-threat',
    title: '👤 Insider Threat Detection',
    difficulty: 'Medium',
    description: 'Unusual access patterns detected from internal users to telemetry systems.',
    steps: [
      {
        id: 1,
        title: 'Review User Activity',
        description: 'Check recent telemetry access attempts',
        action: 'dashboard',
        query: 'Show telemetry data access events',
        completed: false
      },
      {
        id: 2,
        title: 'Examine Access Locations',
        description: 'Verify geographic patterns are normal',
        action: 'threatmap',
        query: null,
        completed: false
      },
      {
        id: 3,
        title: 'Query Specific Users',
        description: 'Investigate suspicious user accounts',
        action: 'chat',
        query: 'Show events for user satellite.ops',
        completed: false
      },
      {
        id: 4,
        title: 'Create Audit Trail',
        description: 'Generate detailed analysis report',
        action: 'reports',
        query: null,
        completed: false
      }
    ]
  }
];

export function MissionModeView({ allEvents, onNavigate, onQuery }: MissionModeViewProps) {
  const [selectedMission, setSelectedMission] = useState<typeof missions[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleStartMission = (mission: typeof missions[0]) => {
    setSelectedMission(mission);
    setCurrentStep(0);
  };

  const handleStepAction = (step: typeof missions[0]['steps'][0]) => {
    if (step.query) {
      onQuery(step.query);
    }
    if (step.action) {
      onNavigate(step.action);
    }
  };

  const handleNextStep = () => {
    if (selectedMission && currentStep < selectedMission.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeMission = () => {
    setSelectedMission(null);
    setCurrentStep(0);
  };

  if (selectedMission) {
    const step = selectedMission.steps[currentStep];
    const progress = ((currentStep + 1) / selectedMission.steps.length) * 100;

    return (
      <div className="space-y-6">
        {/* Mission Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={completeMission}
            className="mb-4"
          >
            ← Back to Missions
          </Button>

          <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="mb-2">{selectedMission.title}</h1>
                <p className="text-muted-foreground">{selectedMission.description}</p>
              </div>
              <Badge variant="destructive" className="text-lg px-4 py-1">
                {selectedMission.difficulty}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Mission Progress</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Step Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {selectedMission.steps.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`p-4 ${
                idx === currentStep 
                  ? 'border-2 border-orange-600 shadow-lg' 
                  : idx < currentStep 
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-600' 
                    : 'opacity-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    idx < currentStep 
                      ? 'bg-green-600 text-white' 
                      : idx === currentStep 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {idx < currentStep ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {s.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Current Step Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-8 border-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl">{step.id}</span>
                </div>
                <div className="flex-1">
                  <h2 className="mb-2">{step.title}</h2>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {step.query && (
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Suggested Query</p>
                        <p className="text-sm text-muted-foreground">{step.query}</p>
                      </div>
                    </div>
                  </Card>
                )}
                
                {step.action && (
                  <Card className="p-4 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Navigate To</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {step.action.replace('_', ' ')} View
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  Previous Step
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleStepAction(step)}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 gap-2"
                  >
                    Execute Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {currentStep === selectedMission.steps.length - 1 ? (
                    <Button
                      onClick={completeMission}
                      className="bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Complete Mission
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleNextStep}
                    >
                      Next Step
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Real-time Stats */}
        <Card className="p-6">
          <h3 className="mb-4">📊 Real-Time Intelligence</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded">
              <p className="text-sm text-red-600">High Risk Events</p>
              <p className="text-2xl font-semibold">{allEvents.filter(e => e.severity === 'high').length}</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded">
              <p className="text-sm text-orange-600">Mission Critical</p>
              <p className="text-2xl font-semibold">{allEvents.filter(e => e.isMissionCritical).length}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
              <p className="text-sm text-purple-600">Malware Detected</p>
              <p className="text-2xl font-semibold">{allEvents.filter(e => e.eventType === 'malware_detection').length}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
              <p className="text-sm text-blue-600">Foreign Access</p>
              <p className="text-2xl font-semibold">{allEvents.filter(e => !e.location.includes(', IN')).length}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Mission Selection Screen
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-orange-600" />
          <h1>Mission Mode</h1>
        </div>
        <p className="text-muted-foreground">
          Guided security investigation workflows for common ISRO threat scenarios
        </p>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-8 bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 dark:from-orange-950/20 dark:via-blue-950/20 dark:to-purple-950/20 border-2">
          <div className="text-center max-w-2xl mx-auto">
            <Target className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h2 className="mb-3">AstroGuard Mission Control</h2>
            <p className="text-muted-foreground text-lg">
              Follow step-by-step guided workflows to investigate security incidents,
              analyze threats, and generate compliance reports for ISRO operations.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {missions.map((mission, idx) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col"
              onClick={() => handleStartMission(mission)}
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3>{mission.title}</h3>
                  <Badge variant={
                    mission.difficulty === 'Critical' ? 'destructive' :
                    mission.difficulty === 'High' ? 'default' : 'secondary'
                  }>
                    {mission.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{mission.description}</p>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{mission.steps.length} Steps</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Recommended
                  </span>
                </div>

                <Button className="w-full group-hover:bg-orange-600 group-hover:text-white transition-colors gap-2">
                  Start Mission
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Why Mission Mode */}
      <Card className="p-6">
        <h3 className="mb-4">Why Use Mission Mode?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
              <Search className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium mb-1">Structured Investigation</p>
              <p className="text-sm text-muted-foreground">
                Follow proven workflows for common security scenarios
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium mb-1">AI-Powered Guidance</p>
              <p className="text-sm text-muted-foreground">
                Get suggested queries and next steps powered by AI
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium mb-1">Compliance Ready</p>
              <p className="text-sm text-muted-foreground">
                Generate reports that meet CERT-In requirements
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

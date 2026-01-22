# 🛰️ AstroGuard - AI Copilot for ISRO Cybersecurity

<div align="center">

![AstroGuard Banner](https://img.shields.io/badge/🛰️_AstroGuard-AI_Powered_SIEM-ff6b35?style=for-the-badge)

[![Built for SIH 2025](https://img.shields.io/badge/Smart_India_Hackathon-2025-blue?style=flat-square)](https://www.sih.gov.in/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007acc?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**An enterprise-grade Conversational SIEM Assistant with AI-powered natural language querying, specifically designed for ISRO's cybersecurity operations.**

[Features](#-key-features) • [Demo](#-live-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Data Model](#-data-model)
- [Demo Flow](#-demo-flow)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Overview

**AstroGuard** is a next-generation **Conversational SIEM (Security Information and Event Management) Assistant** built specifically for **ISRO (Indian Space Research Organisation)** cybersecurity operations. Unlike traditional SIEM systems that require complex query languages like KQL or SQL, AstroGuard enables security analysts to investigate threats using **natural language**, guided workflows, and **AI-powered intelligence**.

### Why AstroGuard?

In critical infrastructure like space operations, security analysts need to:
- ✅ **Investigate threats quickly** without learning complex query languages
- ✅ **Monitor satellite missions** and ground station security in real-time
- ✅ **Detect foreign access attempts** to critical ISRO systems
- ✅ **Generate compliance reports** for CERT-In and government audits
- ✅ **Follow guided workflows** for consistent incident response

AstroGuard solves these challenges with an **AI copilot** that's always available, understands context, and guides analysts through complex security investigations.

---

## 🔍 Problem Statement

**Smart India Hackathon 2025 - ISRO Cybersecurity Challenge**

Traditional SIEM systems face critical usability challenges:

1. **Steep Learning Curve**: Analysts must master KQL, SQL, or vendor-specific query languages
2. **Context Loss**: Each query is isolated; analysts lose investigation context
3. **No Guidance**: Junior analysts struggle without step-by-step workflows
4. **Static Dashboards**: Limited interactivity and drill-down capabilities
5. **Delayed Response**: Critical alerts get lost in separate views
6. **Poor Auditability**: Difficult to trace investigation history

For ISRO, these challenges are magnified by:
- **Space-specific threats**: Satellite telemetry manipulation, ground station intrusions
- **High-stakes operations**: Mission-critical systems require zero downtime
- **Regulatory compliance**: CERT-In mandates comprehensive audit trails
- **Foreign adversaries**: Nation-state actors targeting space infrastructure

---

## 💡 Solution

AstroGuard revolutionizes SIEM operations with:

### 🤖 **AI-Powered Natural Language Querying**
Ask questions in plain English:
- *"Show failed login attempts from foreign IPs in last 24 hours"*
- *"Detect malware on ground station terminals this week"*
- *"Analyze unauthorized satellite telemetry access"*

### 🧭 **Mission Mode - Guided Workflows**
Pre-built investigation workflows for:
- 🚨 Security Breach Response
- 🦠 Malware Outbreak Analysis
- 👤 Insider Threat Detection

### ✨ **Floating AI Copilot**
AI assistant accessible from **every page** - no tab switching required

### 🔬 **Explainable AI (XAI)**
Full transparency with:
- Detected intent & entities
- Confidence scores (0-100%)
- Query translation (Natural Language → DSL → KQL)

### 🌍 **Interactive Threat Map**
Geo-locate attacks globally with filtering by severity and event type

### 📊 **Intelligent Dashboard**
Real-time metrics, proactive alerts, and **clickable charts** with drill-down

---

## ✨ Key Features

### 🎯 **Core Capabilities**

| Feature | Description | Status |
|---------|-------------|--------|
| **Natural Language Queries** | Ask questions in plain English, no query language needed | ✅ Production |
| **Multi-Turn Conversations** | Context-aware follow-ups preserve investigation flow | ✅ Production |
| **Explainable AI (XAI)** | Confidence scores, intent detection, query translation | ✅ Production |
| **Voice Input** | Hands-free querying using Web Speech API | ✅ Production |
| **Mission Mode** | 3 pre-built guided security investigation workflows | ✅ Production |
| **Floating AI Copilot** | Context-aware assistant accessible on all pages | ✅ Production |
| **Interactive Threat Map** | Geo-location visualization with zoom & filters | ✅ Production |
| **Proactive Alerts** | Auto-detection of high-risk events & anomalies | ✅ Production |
| **Clickable Charts** | Drill-down from pie/bar charts to filtered events | ✅ Production |
| **Comprehensive Audit Logs** | Complete query history with compliance trail | ✅ Production |
| **Report Generation** | Textual, tabular, and graphical reports (HTML/CSV) | ✅ Production |
| **MITRE ATT&CK Mapping** | Security events mapped to attack framework | ✅ Production |
| **Dark Mode** | Professional UI with theme toggle | ✅ Production |

### 🛰️ **ISRO-Specific Features**

- **Satellite Mission Security**: Monitor Chandrayaan, Mangalyaan, GSAT operations
- **Ground Station Monitoring**: Track access to Thiruvananthapuram, Bangalore, Ahmedabad stations
- **Telemetry Protection**: Detect unauthorized satellite data access
- **Foreign Access Detection**: Flag login attempts from suspicious geolocations
- **Space-Specific Threats**: Malware targeting PSLV/GSLV systems, RF jamming attempts

### 🎨 **User Experience**

- **Unified Navigation**: 6 clear views (Dashboard, Mission Mode, AI Assistant, Threat Map, Event Explorer, Reports)
- **User Personalization**: Profile with clearance level, role, recent queries
- **Smooth Animations**: Motion/React for polished transitions
- **Toast Notifications**: Real-time feedback on query processing
- **Keyboard Shortcuts**: `Ctrl+K` to toggle AI copilot
- **Responsive Design**: Desktop, tablet, and mobile optimized

---

## 🔧 Tech Stack

### **Frontend Framework**
```typescript
React 18              // UI library with hooks & concurrent features
TypeScript 5.0        // Type-safe development
Tailwind CSS v4       // Utility-first styling with design tokens
shadcn/ui             // 80+ pre-built accessible components
```

### **Data Visualization**
```typescript
Recharts              // Responsive charts (pie, bar, line, area)
Leaflet (planned)     // Interactive world map for threat visualization
```

### **Animation & UX**
```typescript
Motion/React          // Smooth page transitions & micro-interactions
Sonner                // Toast notifications
Lucide React          // 1000+ clean SVG icons
```

### **AI & NLP**
```typescript
Custom Query Parser   // Intent detection & entity extraction
Context Manager       // Multi-turn conversation state
Confidence Scoring    // Query interpretation reliability (0-100%)
```

### **Data & State Management**
```typescript
React Hooks           // useState, useEffect, useCallback
Local Storage         // Theme & user preferences
Synthetic Data Gen    // 250+ ISRO-specific security events
```

---

## 🏗️ Architecture

### **System Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Dashboard   │  │ Threat Map   │  │  Event Explorer    │   │
│  │  + Alerts    │  │ (Geo-locate) │  │  (Events + Audit)  │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Mission Mode │  │ AI Assistant │  │  Reports View      │   │
│  │  (Workflows) │  │   (Chat)     │  │  (Generate)        │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                 │
│              ┌──────────────────────────────┐                  │
│              │  Floating AI Copilot (⭐)    │                  │
│              │  Always Available (Ctrl+K)   │                  │
│              └──────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                       │
│  ┌──────────────────┐  ┌─────────────────┐  ┌──────────────┐  │
│  │  Query Processor │→ │ Context Manager │→ │  XAI Engine  │  │
│  │  (NLP Parser)    │  │ (Multi-turn)    │  │  (Explain)   │  │
│  └──────────────────┘  └─────────────────┘  └──────────────┘  │
│                                                                 │
│  ┌──────────────────┐  ┌─────────────────┐  ┌──────────────┐  │
│  │  Alert Engine    │  │ Report Builder  │  │ Filter/Sort  │  │
│  │  (Proactive)     │  │ (HTML/CSV)      │  │ (Client)     │  │
│  └──────────────────┘  └─────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Synthetic Data Generator (250+ ISRO Security Events)   │   │
│  │  - Satellite access logs      - Ground station events   │   │
│  │  - Malware detections         - Failed logins           │   │
│  │  - Telemetry tampering        - Foreign IP attempts     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Future: PostgreSQL + FastAPI + Elasticsearch                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Component Architecture**

```
src/
├── App.tsx                          # Main app with routing & state
├── components/
│   ├── views/                       # 6 Main Views
│   │   ├── DashboardView.tsx        # KPIs + Alerts + Charts
│   │   ├── MissionModeView.tsx      # Guided workflows (⭐ NEW)
│   │   ├── ChatView.tsx             # AI Assistant
│   │   ├── ThreatMapView.tsx        # Geo-location
│   │   ├── EventExplorerView.tsx    # Events + Audit (⭐ UNIFIED)
│   │   └── ReportsView.tsx          # Report generation
│   │
│   ├── FloatingCopilot.tsx          # Always-on AI assistant (⭐)
│   ├── QueryInput.tsx               # NL + Voice input
│   ├── ConversationHistory.tsx      # Chat messages
│   ├── EnhancedResultsPanel.tsx     # Tables + Charts
│   ├── EnhancedXAIPanel.tsx         # Explainability
│   ├── ProactiveAlerts.tsx          # Auto-detection
│   ├── AuditLogPanel.tsx            # Compliance logs
│   ├── StatsDashboard.tsx           # KPI metrics
│   ├── ReportGenerator.tsx          # Export HTML/CSV
│   ├── UserProfile.tsx              # Analyst info
│   ├── Sidebar.tsx                  # Navigation
│   └── ThemeToggle.tsx              # Dark mode
│
├── utils/
│   ├── syntheticData.ts             # 250+ events generator
│   └── queryProcessor.ts            # NLP engine
│
└── styles/
    └── globals.css                  # Tailwind tokens
```

---

## 🚀 Installation

### **Prerequisites**
```bash
Node.js >= 18.0.0
npm >= 9.0.0 or yarn >= 1.22.0
Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
```

### **Quick Start**

1. **Clone the repository**
```bash
git clone https://github.com/your-org/astroguard.git
cd astroguard
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:5173
```

### **Build for Production**
```bash
npm run build
npm run preview   # Test production build locally
```

### **Deploy**
```bash
# Vercel (recommended)
vercel --prod

# Netlify
netlify deploy --prod

# Static hosting
npm run build && cp -r dist/* /var/www/html/
```

---

## 📖 Usage Guide

### **1️⃣ Getting Started**

#### Welcome Screen
- Click **"Get Started"** to enter the dashboard
- Skip intro by clicking anywhere on screen

#### Dashboard Overview
- **User Profile**: See your analyst role & clearance level
- **KPI Cards**: Total events, high-risk alerts, active threats
- **Proactive Alerts**: 3 real-time alert cards
- **Charts**: 4 interactive visualizations (click slices to filter!)

### **2️⃣ Natural Language Queries**

#### Using the AI Assistant
```
Navigate to: AI Assistant tab
```

**Example Queries:**
- *"Show failed login attempts yesterday"*
- *"Filter only VPN-related attempts"*
- *"Display malware alerts in last 7 days"*
- *"Show high-risk events from foreign IPs"*

#### Multi-Turn Conversations
```
Query 1: "Show failed login attempts"
Query 2: "Filter only yesterday"           ← Remembers context!
Query 3: "Show only high risk"             ← Progressive refinement
```

#### Voice Input
- Click **microphone icon** 🎤
- Speak your query clearly
- Voice-to-text conversion automatic

### **3️⃣ Mission Mode (⭐ Flagship Feature)**

```
Navigate to: Mission Mode tab
```

**Available Missions:**

#### 🚨 Mission 1: Investigate Security Breach
```
Step 1: Identify the Threat      → Dashboard
Step 2: Geolocate Attack Sources → Threat Map
Step 3: Analyze with AI          → AI Assistant
Step 4: Generate Report          → Reports
```

#### 🦠 Mission 2: Malware Outbreak Response
```
Step 1: Check Active Alerts
Step 2: Identify Affected Systems
Step 3: Analyze Attack Pattern
Step 4: Document Findings
```

#### 👤 Mission 3: Insider Threat Detection
```
Step 1: Review User Activity
Step 2: Examine Access Locations
Step 3: Query Specific Users
Step 4: Create Audit Trail
```

**How to Use:**
1. Click **"Start Mission"** on any mission card
2. Read the mission briefing
3. Click **"Execute Step 1"** → Auto-navigates to relevant view
4. Complete suggested action
5. Return to Mission Mode → Click **"Mark as Complete"**
6. Progress bar updates automatically
7. Complete all 4 steps → Success celebration! 🎉

### **4️⃣ Floating AI Copilot (⭐ Innovation)**

**Always Available:** Works on all pages except AI Assistant

**How to Use:**
1. Click **sparkles button** ✨ (bottom-right corner)
2. Panel slides up with quick actions
3. Choose:
   - *"What are mission-critical alerts?"*
   - *"Show satellite security events"*
   - *"Detect foreign access attempts"*
   - *"Summarize today's threats"*
4. Or type/speak your own query
5. AI processes with typing indicator
6. Results shown in panel
7. Close with **X** or click outside

**Keyboard Shortcut:**
```
Ctrl+K (Windows/Linux)
Cmd+K (Mac)
```

### **5️⃣ Interactive Threat Map**

```
Navigate to: Threat Map tab
```

**Features:**
- **World Map**: See attack sources globally
- **Filters**:
  - Severity: All / High / Medium / Low
  - Event Type: All / Failed Login / Malware / Unauthorized Access
- **Zoom Controls**: + / - buttons
- **Click Markers**: See event details
- **Foreign Access Alerts**: Top 10 suspicious locations
- **Statistics**: Total events by region

### **6️⃣ Event Explorer (⭐ Unified View)**

```
Navigate to: Event Explorer tab
```

**Tab 1: Security Events**
- **250+ events** with full details
- **Search**: Filter by any field
- **Severity Filter**: High / Medium / Low
- **Event Type Filter**: Dropdown
- **Sortable Columns**: Click headers
- **Pagination**: 25 events per page
- **Export**: Download as CSV

**Tab 2: Query Logs (Audit)**
- **4 Statistics Cards**:
  - Total Queries
  - Avg Confidence Score
  - Avg Results per Query
  - Queries Today
- **Complete History**: All queries with timestamps
- **Expandable Details**: Intent, entities, DSL, KQL
- **Copy to Clipboard**: Share queries

### **7️⃣ Report Generation**

```
Navigate to: Reports tab
```

**Report Types:**

1. **Executive Summary** (Textual)
   - Overview of security posture
   - Key findings & recommendations
   - Export as HTML

2. **Security Events Table** (Tabular)
   - Detailed event listing
   - Export as CSV for Excel

3. **Threat Distribution** (Charts)
   - Pie charts: Event types, severity
   - Bar charts: Locations, risk scores
   - Export as HTML

4. **Compliance Audit** (Regulatory)
   - CERT-In format
   - MITRE ATT&CK mapping
   - Complete audit trail
   - Export as HTML

**How to Generate:**
1. Select report type
2. Click **"Generate Report"**
3. Preview in modal
4. Click **"Export as [HTML/CSV]"**
5. File downloads automatically

### **8️⃣ Explainable AI (XAI)**

**Where to Find:**
- AI Assistant tab → Right sidebar
- Floating Copilot → Inline with results

**What You See:**
```yaml
Detected Intent: show
Confidence: 85%

Entities Extracted:
  - Event Type: failed_login (95% confidence)
  - Time Range: yesterday (90% confidence)
  - Severity: high (80% confidence)

Query Translation:
  DSL: type:failed_login AND time:yesterday AND severity:high
  KQL: EventType == "failed_login" | where Timestamp >= ago(1d)
```

**Why It Matters:**
- ✅ Understand how AI interpreted your query
- ✅ Verify accuracy before taking action
- ✅ Learn query patterns for future use
- ✅ Compliance & audit trail

---

## 📂 Project Structure

```
astroguard/
│
├── public/                          # Static assets
│   └── (images, icons)
│
├── src/
│   ├── App.tsx                      # Main application entry
│   │
│   ├── components/
│   │   │
│   │   ├── views/                   # 6 Main Views
│   │   │   ├── DashboardView.tsx
│   │   │   ├── MissionModeView.tsx  # ⭐ Guided workflows
│   │   │   ├── ChatView.tsx
│   │   │   ├── ThreatMapView.tsx
│   │   │   ├── EventExplorerView.tsx
│   │   │   └── ReportsView.tsx
│   │   │
│   │   ├── FloatingCopilot.tsx      # ⭐ Always-on AI
│   │   ├── QueryInput.tsx           # NL + Voice input
│   │   ├── VoiceInput.tsx           # Speech-to-text
│   │   ├── ConversationHistory.tsx  # Chat messages
│   │   ├── EnhancedResultsPanel.tsx # Tables + Charts
│   │   ├── EnhancedXAIPanel.tsx     # Explainability
│   │   ├── ProactiveAlerts.tsx      # Auto-detection
│   │   ├── AuditLogPanel.tsx        # Audit logs
│   │   ├── StatsDashboard.tsx       # KPI cards
│   │   ├── ReportGenerator.tsx      # Export reports
│   │   ├── UserProfile.tsx          # Analyst info
│   │   ├── Sidebar.tsx              # Navigation
│   │   ├── ThemeToggle.tsx          # Dark mode
│   │   │
│   │   └── ui/                      # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── dialog.tsx
│   │       └── ... (80+ components)
│   │
│   ├── utils/
│   │   ├── syntheticData.ts         # 250+ event generator
│   │   └── queryProcessor.ts        # NLP engine
│   │
│   ├── styles/
│   │   └── globals.css              # Tailwind v4 tokens
│   │
│   └── types/
│       └── index.ts                 # TypeScript interfaces
│
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts              # Tailwind settings
├── vite.config.ts                  # Vite bundler
├── README.md                        # This file
└── LICENSE                          # MIT License
```

---

## 📊 Data Model

### **SecurityEvent Interface**
```typescript
interface SecurityEvent {
  id: string;                        // Unique event ID
  timestamp: Date;                   // Event occurrence time
  eventType: EventType;              // Categorization
  severity: 'High' | 'Medium' | 'Low';
  riskScore: number;                 // 0-100
  sourceIP: string;                  // Attacker IP
  destinationIP?: string;            // Target IP
  username?: string;                 // Affected user
  location: string;                  // Geographic location
  description: string;               // Human-readable summary
  mitreAttack?: string;              // MITRE ATT&CK technique
  satelliteMission?: string;         // ISRO mission affected
  groundStation?: string;            // ISRO facility
  telemetryAccess?: boolean;         // Satellite data involved
  foreignAccess?: boolean;           // Non-Indian IP
}
```

### **Event Types**
```typescript
type EventType =
  | 'Failed Login'
  | 'Successful Login'
  | 'VPN Connection'
  | 'Malware Detection'
  | 'Firewall Block'
  | 'Unauthorized Access'
  | 'Data Exfiltration'
  | 'Brute Force Attack'
  | 'Privilege Escalation'
  | 'Telemetry Tampering';
```

### **Query Result**
```typescript
interface QueryResult {
  events: SecurityEvent[];           // Filtered events
  intent: string;                    // Detected intent
  entities: {
    eventType?: string;
    timeRange?: string;
    severity?: string;
    username?: string;
    ipAddress?: string;
  };
  confidence: number;                // 0-100%
  dslQuery: string;                  // Domain-specific language
  kqlQuery: string;                  // Kusto Query Language
  summary: string;                   // Natural language summary
}
```

### **Sample Events**

```typescript
// High-Risk: Foreign malware on ground station
{
  id: "EVT-047",
  timestamp: new Date('2025-01-22T14:35:00'),
  eventType: "Malware Detection",
  severity: "High",
  riskScore: 92,
  sourceIP: "203.45.123.89",
  username: "station.admin",
  location: "Beijing, China",
  description: "Malware detected: Trojan.ISRO.Telemetry on ground station terminal",
  mitreAttack: "T1203 - Exploitation for Client Execution",
  groundStation: "Thiruvananthapuram Tracking Station",
  foreignAccess: true
}

// Medium-Risk: Failed VPN from suspicious location
{
  id: "EVT-128",
  timestamp: new Date('2025-01-22T09:12:00'),
  eventType: "Failed Login",
  severity: "Medium",
  riskScore: 68,
  sourceIP: "185.220.101.45",
  username: "mission.control",
  location: "Moscow, Russia",
  description: "Multiple failed VPN authentication attempts",
  mitreAttack: "T1110 - Brute Force",
  foreignAccess: true
}

// Low-Risk: Successful internal login
{
  id: "EVT-201",
  timestamp: new Date('2025-01-22T08:00:00'),
  eventType: "Successful Login",
  severity: "Low",
  riskScore: 15,
  sourceIP: "10.0.45.12",
  username: "analyst.sharma",
  location: "Bangalore, India",
  description: "Successful login to SIEM dashboard",
  groundStation: "ISRO Headquarters"
}
```

---

## 🤝 Contributing

We welcome contributions from the cybersecurity and developer community!

### **How to Contribute**

1. **Fork the repository**
```bash
git clone https://github.com/your-username/astroguard.git
cd astroguard
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Add unit tests where applicable
- Update documentation

3. **Test your changes**
```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # Code linting
npm run test      # Run tests
```

4. **Commit with meaningful messages**
```bash
git commit -m "feat: Add real-time alert notifications"
git commit -m "fix: Correct XAI confidence calculation"
git commit -m "docs: Update installation guide"
```

5. **Push and create Pull Request**
```bash
git push origin feature/your-feature-name
# Open PR on GitHub with description
```

### **Contribution Guidelines**

- **Code Style**: Follow existing patterns, use ESLint/Prettier
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)
- **Testing**: Add tests for new features
- **Documentation**: Update README and inline comments
- **Issues**: Open issues for bugs/features before large PRs

### **Areas for Contribution**

- 🐛 **Bug Fixes**: Fix reported issues
- ✨ **New Features**: Add SIEM integrations, AI models
- 📝 **Documentation**: Improve guides, add tutorials
- 🎨 **UI/UX**: Enhance design, accessibility
- 🧪 **Testing**: Add unit/integration tests
- 🌐 **Localization**: Translate to regional languages

---

## 🙏 Acknowledgments

### Open Source Libraries
- **[React](https://reactjs.org/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Motion](https://motion.dev/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon set

### Inspiration & Research
- **MITRE ATT&CK Framework** - Threat categorization
- **CERT-In Guidelines** - Indian cybersecurity compliance
- **ISRO Security Standards** - Space infrastructure protection
- **NIST Cybersecurity Framework** - Best practices

### Special Thanks
- **Smart India Hackathon 2025** organizers
- **ISRO** for the problem statement
- **Open source community** for amazing tools
- **Mentors & advisors** for guidance

---

### FAQ

**Q: Can AstroGuard integrate with existing SIEM tools?**
A: Yes! Phase 4 roadmap includes Splunk, ELK, QRadar, and Azure Sentinel connectors.

**Q: Does it support real-time log ingestion?**
A: Currently uses synthetic data for demo. Phase 2 adds WebSocket streaming and Elasticsearch integration.

**Q: Is voice input accurate?**
A: Voice input uses browser Web Speech API. Accuracy depends on browser support and microphone quality.

**Q: Can I deploy this in production?**
A: Current version is a hackathon MVP. For production, implement Phase 2 backend with authentication, rate limiting, and database integration.

**Q: How does XAI confidence scoring work?**
A: Query processor calculates confidence based on entity match certainty, intent clarity, and context relevance.

**Q: Is this CERT-In compliant?**
A: Reports include CERT-In format. Full compliance requires backend audit logging and encryption (Phase 2).

---

<div align="center">
</div>
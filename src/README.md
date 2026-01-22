# Conversational SIEM Assistant MVP

A fully functional, AI-powered Security Information and Event Management (SIEM) assistant with natural language query processing, explainable AI, and comprehensive security analytics.

![Demo Status](https://img.shields.io/badge/status-demo-blue)
![Built with React](https://img.shields.io/badge/built%20with-React-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-007acc)

## 🎯 Overview

This application demonstrates a next-generation SIEM interface where security analysts can query security events using natural language instead of complex query languages. Built for the Smart India Hackathon 2025, this MVP showcases advanced features including multi-turn conversations, explainable AI, proactive alerts, and comprehensive audit logging.

## ✨ Key Features

### 1. **Natural Language Query Processing**
- Query security events using plain English
- Supports complex filters and time ranges
- Examples:
  - "Show failed login attempts yesterday"
  - "Filter only VPN-related attempts"
  - "Show malware alerts in last 7 days"

### 2. **Multi-Turn Conversational AI**
- Context-aware follow-up queries
- Remembers previous query parameters
- Enables progressive refinement of results
- Example flow:
  1. "Show failed login attempts" → Shows all failed logins
  2. "Filter only yesterday" → Filters previous results to yesterday

### 3. **Explainable AI (XAI) Panel**
- Shows detected intent and entities
- Displays confidence scores
- Translates natural language to DSL and KQL queries
- Helps users understand how queries are interpreted

### 4. **Interactive Data Visualization**
- **Sortable Tables**: Click column headers to sort
- **Pagination**: Navigate through large datasets
- **Search & Filter**: Real-time search across all fields
- **Dynamic Charts**:
  - Timeline charts showing events over time
  - Pie charts for distribution analysis
  - Bar charts for categorical breakdowns
  - Risk score distribution

### 5. **Proactive Security Alerts**
- Automatic detection of high-risk events
- Anomaly detection (e.g., multiple failed logins from same IP)
- Real-time alerting with dismissible notifications
- Color-coded by severity (High: Red, Medium: Yellow, Low: Green)

### 6. **Statistics Dashboard**
- Real-time metrics overview
- Total events count
- High-risk events tracking
- Active threats monitoring
- Detection rate percentage

### 7. **Comprehensive Audit Logging**
- Complete query history
- Request-response tracking
- Query translation logs
- Exportable audit trails
- Copy-to-clipboard functionality

### 8. **Professional UI/UX**
- Modern, clean dashboard design
- Dark mode support with theme toggle
- Responsive layout (desktop/tablet/mobile)
- Smooth animations and transitions
- Professional color scheme

### 9. **Data Export**
- Export filtered results to CSV
- Includes all event details
- Ready for further analysis or reporting

## 🏗️ Architecture

### Frontend Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Data Processing
- **Synthetic Data Generator** - Creates realistic security events (250+ entries)
- **Query Processor** - NLP-like parsing and intent detection
- **Multi-turn Context Manager** - Maintains conversation state

### Components Architecture
```
/components
  ├── QueryInput.tsx              # Natural language input
  ├── ConversationHistory.tsx     # Chat-style history
  ├── EnhancedResultsPanel.tsx    # Results with tables/charts
  ├── XAIPanel.tsx                # Explainable AI display
  ├── AuditLogPanel.tsx           # Query audit logs
  ├── StatsDashboard.tsx          # Metrics overview
  ├── ProactiveAlerts.tsx         # Security alerts
  └── ThemeToggle.tsx             # Dark/light mode

/utils
  ├── syntheticData.ts            # Generates demo security events
  └── queryProcessor.ts           # NLP parsing and filtering
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Running

1. **The application is already set up and ready to run in Figma Make**

2. **Start interacting immediately:**
   - The app will load with synthetic security data
   - Try example queries from the suggestion buttons
   - Explore the different tabs (History, XAI, Audit)

3. **Example Demo Flow:**
   ```
   Query 1: "Show failed login attempts yesterday"
   → See filtered results with tables and charts
   → Check XAI panel to see how query was interpreted
   
   Query 2: "Filter only high risk"
   → Results update based on previous context
   → Notice the multi-turn context in action
   
   Query 3: "Show malware alerts in last 7 days"
   → New query, new results
   → View proactive alerts for high-risk events
   ```

## 📊 Synthetic Data

The application generates 250 synthetic security events including:

- **Event Types:**
  - Failed login attempts
  - VPN connections
  - Malware detections
  - Successful logins
  - Firewall blocks

- **Attributes:**
  - Unique event IDs
  - Timestamps (last 30 days)
  - IP addresses
  - Usernames
  - Locations
  - Severity levels (High, Medium, Low)
  - Risk scores (0-100)
  - Detailed descriptions

## 🎨 UI Features

### Dashboard Layout
1. **Header**: Branding, status indicator, theme toggle
2. **Alert Banner**: Demo mode notification
3. **Statistics Dashboard**: Key metrics at a glance
4. **Proactive Alerts**: High-risk events and anomalies
5. **Query Input**: Natural language text area
6. **Results Panel**: Tables, charts, and visualizations
7. **Sidebar Tabs**: History, XAI, and Audit logs
8. **Footer**: Technology stack and demo information

### Color Coding
- 🔴 **High Severity/Risk**: Red (#ef4444)
- 🟡 **Medium Severity/Risk**: Yellow (#f59e0b)
- 🟢 **Low Severity/Risk**: Green (#22c55e)

### Responsive Design
- Desktop: Full 3-column layout
- Tablet: 2-column adaptive layout
- Mobile: Single-column stacked layout

## 🧪 Demo Scenarios

### Scenario 1: Failed Login Investigation
```
1. Query: "Show failed login attempts yesterday"
2. Review: Check the table for suspicious IPs
3. Filter: Look for high-risk events
4. Alert: See proactive alerts for repeated attempts
5. Export: Download CSV for further analysis
```

### Scenario 2: Malware Detection Analysis
```
1. Query: "Show malware alerts in last 7 days"
2. Visualize: View timeline chart
3. Analyze: Check distribution by severity
4. Context: Ask follow-up "Filter only high risk"
5. XAI: Review how query was interpreted
```

### Scenario 3: VPN Security Audit
```
1. Query: "Show VPN-related attempts"
2. Review: Analyze connection patterns
3. Refine: "Show only last 24 hours"
4. Audit: Check audit log for query history
5. Export: Save results for compliance
```

## 🔍 Query Examples

### Time-based Queries
- "Show events yesterday"
- "Display alerts in last 7 days"
- "Show security events today"
- "List events from last 24 hours"

### Event Type Queries
- "Show failed login attempts"
- "Display VPN connections"
- "Show malware detections"
- "List firewall blocks"

### Severity Queries
- "Show high risk events"
- "Display critical alerts"
- "Show medium severity events"

### Combined Queries
- "Show failed logins yesterday with high risk"
- "Display VPN events from last week"
- "Show malware alerts for user admin"

## 🎯 Smart India Hackathon Demo Tips

### For Judges
1. **Start with the Statistics Dashboard** - Show real-time metrics
2. **Demonstrate Natural Language Queries** - Use example queries
3. **Highlight Multi-Turn Context** - Show progressive refinement
4. **Explain XAI Features** - Open XAI panel to show query interpretation
5. **Show Proactive Alerts** - Highlight automatic anomaly detection
6. **Display Audit Logs** - Demonstrate compliance and traceability
7. **Toggle Dark Mode** - Show professional UI polish
8. **Export Data** - Demonstrate CSV export functionality

### Key Differentiators
- ✅ **Natural Language Processing** - No query language needed
- ✅ **Explainable AI** - Complete transparency
- ✅ **Multi-Turn Context** - Smart conversation flow
- ✅ **Proactive Alerts** - Automatic threat detection
- ✅ **Comprehensive Audit** - Full traceability
- ✅ **Professional UI** - Enterprise-ready design

## 🛠️ Technical Highlights

### Query Processing Engine
The application uses a sophisticated query processor that:
- Extracts entities (event types, time ranges, severity)
- Determines intent (show, filter, count, analyze)
- Calculates confidence scores
- Translates to DSL and KQL formats
- Maintains multi-turn context

### Performance Features
- Efficient client-side filtering
- Pagination for large datasets
- Lazy loading of charts
- Optimized re-renders
- Smooth animations

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- High contrast mode support
- Responsive touch targets

## 📝 Future Enhancements (Post-MVP)

- Real backend integration with FastAPI/Flask
- Actual NLP model integration (BERT, spaCy)
- User authentication and authorization
- Real-time event streaming
- Custom dashboard creation
- Advanced analytics and ML models
- Integration with real SIEM tools (Splunk, ELK)
- Multi-language support
- Advanced visualization options
- Scheduled reports
- Alert notifications (email, Slack)

## 🤝 Contributing

This is a demo project for Smart India Hackathon 2025. For production use:
1. Replace synthetic data with real SIEM integration
2. Implement proper authentication
3. Add backend API with FastAPI/Flask
4. Integrate real NLP models
5. Add comprehensive testing
6. Implement rate limiting and security measures

## 📄 License

This project is a demonstration for educational purposes.

## 👥 Team

Built for Smart India Hackathon 2025

## 🙏 Acknowledgments

- React and TypeScript communities
- shadcn/ui for component library
- Recharts for visualization
- Tailwind CSS for styling

---

**Ready to revolutionize SIEM with conversational AI! 🚀**

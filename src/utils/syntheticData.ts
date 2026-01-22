// Synthetic Security Event Data Generator for SIEM Demo

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  eventType: 'failed_login' | 'vpn_connection' | 'malware_detection' | 'successful_login' | 'firewall_block' | 
             'ground_station_access' | 'telemetry_data_access' | 'command_control_access' | 'satellite_comm_anomaly';
  severity: 'high' | 'medium' | 'low';
  ip: string;
  username: string;
  location: string;
  details: string;
  risk_score: number;
  latitude?: number;
  longitude?: number;
  mitreAttack?: string;
  isMissionCritical?: boolean;
}

const eventTypes: SecurityEvent['eventType'][] = [
  'failed_login',
  'vpn_connection',
  'malware_detection',
  'successful_login',
  'firewall_block',
  'ground_station_access',
  'telemetry_data_access',
  'command_control_access',
  'satellite_comm_anomaly'
];

const usernames = [
  'admin', 'john.doe', 'jane.smith', 'bob.wilson', 'alice.jones',
  'charlie.brown', 'david.lee', 'emma.davis', 'frank.miller', 'grace.taylor',
  'mission.control', 'satellite.ops', 'ground.station', 'isro.admin', 'telemetry.eng'
];

const locations = [
  'Bangalore, IN', 'Thiruvananthapuram, IN', 'Sriharikota, IN', 'Ahmedabad, IN', 'Mumbai, IN',
  'New York, US', 'London, UK', 'Beijing, CN', 'Moscow, RU', 'Sydney, AU',
  'Berlin, DE', 'Paris, FR', 'Toronto, CA', 'Singapore, SG', 'Dubai, AE'
];

// Coordinates for locations (for map visualization)
const locationCoords: Record<string, { lat: number; lon: number }> = {
  'Bangalore, IN': { lat: 12.9716, lon: 77.5946 },
  'Thiruvananthapuram, IN': { lat: 8.5241, lon: 76.9366 },
  'Sriharikota, IN': { lat: 13.7199, lon: 80.2304 },
  'Ahmedabad, IN': { lat: 23.0225, lon: 72.5714 },
  'Mumbai, IN': { lat: 19.0760, lon: 72.8777 },
  'New York, US': { lat: 40.7128, lon: -74.0060 },
  'London, UK': { lat: 51.5074, lon: -0.1278 },
  'Beijing, CN': { lat: 39.9042, lon: 116.4074 },
  'Moscow, RU': { lat: 55.7558, lon: 37.6173 },
  'Sydney, AU': { lat: -33.8688, lon: 151.2093 },
  'Berlin, DE': { lat: 52.5200, lon: 13.4050 },
  'Paris, FR': { lat: 48.8566, lon: 2.3522 },
  'Toronto, CA': { lat: 43.6532, lon: -79.3832 },
  'Singapore, SG': { lat: 1.3521, lon: 103.8198 },
  'Dubai, AE': { lat: 25.2048, lon: 55.2708 }
};

const malwareTypes = [
  'Trojan.GenericKD', 'Ransomware.WannaCry', 'Spyware.Agent', 
  'Adware.BrowseFox', 'Rootkit.Hidden', 'Worm.Conficker'
];

// Generate random IP address
function generateIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Generate random date within last N days
function randomDate(daysAgo: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime);
}

// MITRE ATT&CK techniques
const mitreAttacks: Record<string, string[]> = {
  'failed_login': ['T1110 - Brute Force', 'T1078 - Valid Accounts'],
  'malware_detection': ['T1486 - Data Encrypted for Impact', 'T1204 - User Execution'],
  'ground_station_access': ['T1078.004 - Cloud Accounts', 'T1552 - Unsecured Credentials'],
  'telemetry_data_access': ['T1530 - Data from Cloud Storage', 'T1213 - Data from Information Repositories'],
  'command_control_access': ['T1071 - Application Layer Protocol', 'T1090 - Proxy'],
  'satellite_comm_anomaly': ['T1499 - Endpoint Denial of Service', 'T1565 - Data Manipulation'],
  'vpn_connection': ['T1133 - External Remote Services'],
  'firewall_block': ['T1595 - Active Scanning']
};

// Generate event details based on type
function generateDetails(eventType: SecurityEvent['eventType']): string {
  switch (eventType) {
    case 'failed_login':
      return 'Invalid password attempt';
    case 'vpn_connection':
      return Math.random() > 0.3 ? 'VPN connection established' : 'VPN connection failed';
    case 'malware_detection':
      return `Malware detected: ${malwareTypes[Math.floor(Math.random() * malwareTypes.length)]}`;
    case 'successful_login':
      return 'User authenticated successfully';
    case 'firewall_block':
      return 'Suspicious traffic blocked by firewall';
    case 'ground_station_access':
      return 'Unauthorized access attempt to ground station controls';
    case 'telemetry_data_access':
      return 'Suspicious telemetry data query detected';
    case 'command_control_access':
      return 'Unauthorized command & control system access';
    case 'satellite_comm_anomaly':
      return 'Anomalous satellite communication pattern detected';
    default:
      return 'Security event logged';
  }
}

// Determine severity based on event type
function determineSeverity(eventType: SecurityEvent['eventType']): SecurityEvent['severity'] {
  switch (eventType) {
    case 'malware_detection':
    case 'command_control_access':
    case 'satellite_comm_anomaly':
      return 'high';
    case 'failed_login':
    case 'ground_station_access':
    case 'telemetry_data_access':
      return Math.random() > 0.6 ? 'high' : 'medium';
    case 'firewall_block':
      return 'medium';
    case 'vpn_connection':
    case 'successful_login':
      return 'low';
    default:
      return 'low';
  }
}

// Calculate risk score based on severity
function calculateRiskScore(severity: SecurityEvent['severity']): number {
  switch (severity) {
    case 'high':
      return 70 + Math.floor(Math.random() * 30);
    case 'medium':
      return 40 + Math.floor(Math.random() * 30);
    case 'low':
      return 10 + Math.floor(Math.random() * 30);
    default:
      return 20;
  }
}

// Generate synthetic security events with realistic distribution
export function generateSecurityEvents(count: number = 200): SecurityEvent[] {
  const events: SecurityEvent[] = [];
  
  // Weighted distribution (not symmetric)
  // 40% failed logins, 25% ISRO mission-critical, 15% malware, 10% VPN, 7% firewall, 3% successful
  const weightedEventTypes = [
    ...Array(40).fill('failed_login'),
    ...Array(12).fill('ground_station_access'),
    ...Array(8).fill('telemetry_data_access'),
    ...Array(5).fill('command_control_access'),
    ...Array(15).fill('malware_detection'),
    ...Array(10).fill('vpn_connection'),
    ...Array(7).fill('firewall_block'),
    ...Array(3).fill('successful_login'),
    ...Array(2).fill('satellite_comm_anomaly')
  ] as SecurityEvent['eventType'][];
  
  for (let i = 0; i < count; i++) {
    const eventType = weightedEventTypes[Math.floor(Math.random() * weightedEventTypes.length)];
    const severity = determineSeverity(eventType);
    
    // 70% events from India, 30% international
    const isIndia = Math.random() < 0.7;
    const indianLocations = locations.filter(l => l.includes(', IN'));
    const foreignLocations = locations.filter(l => !l.includes(', IN'));
    const location = isIndia 
      ? indianLocations[Math.floor(Math.random() * indianLocations.length)]
      : foreignLocations[Math.floor(Math.random() * foreignLocations.length)];
    
    const coords = locationCoords[location];
    
    // Determine if mission critical
    const isMissionCritical = [
      'ground_station_access',
      'telemetry_data_access',
      'command_control_access',
      'satellite_comm_anomaly'
    ].includes(eventType);
    
    // Get MITRE ATT&CK technique
    const mitreOptions = mitreAttacks[eventType];
    const mitreAttack = mitreOptions ? mitreOptions[Math.floor(Math.random() * mitreOptions.length)] : undefined;
    
    // For ISRO events, prefer ISRO usernames
    let username: string;
    if (isMissionCritical && Math.random() < 0.6) {
      const isroUsers = usernames.filter(u => u.includes('.'));
      username = isroUsers[Math.floor(Math.random() * isroUsers.length)];
    } else {
      username = usernames[Math.floor(Math.random() * usernames.length)];
    }
    
    events.push({
      id: `EVT-${String(i + 1).padStart(6, '0')}`,
      timestamp: randomDate(30), // Last 30 days
      eventType,
      severity,
      ip: generateIP(),
      username,
      location,
      details: generateDetails(eventType),
      risk_score: calculateRiskScore(severity),
      latitude: coords.lat,
      longitude: coords.lon,
      mitreAttack,
      isMissionCritical
    });
  }
  
  // Sort by timestamp (most recent first)
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Get all events (singleton pattern for demo)
let cachedEvents: SecurityEvent[] | null = null;

export function getSecurityEvents(): SecurityEvent[] {
  if (!cachedEvents) {
    cachedEvents = generateSecurityEvents(250);
  }
  return cachedEvents;
}

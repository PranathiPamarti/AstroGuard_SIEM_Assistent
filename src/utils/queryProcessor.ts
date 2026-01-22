// Natural Language Query Processor for SIEM Assistant
// Simulates NLP parsing, intent detection, and query translation

import { SecurityEvent } from './syntheticData';

export interface QueryIntent {
  action: 'filter' | 'show' | 'count' | 'analyze';
  entities: {
    eventType?: string[];
    timeRange?: string;
    severity?: string[];
    username?: string;
    ip?: string;
  };
  confidence: number;
}

export interface QueryResult {
  intent: QueryIntent;
  dslQuery: string;
  kqlQuery: string;
  summary: string;
  events: SecurityEvent[];
  stats: {
    total: number;
    highSeverity: number;
    mediumSeverity: number;
    lowSeverity: number;
  };
}

// Extract time range from query
function extractTimeRange(query: string): string | undefined {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('yesterday')) return 'yesterday';
  if (lowerQuery.includes('today')) return 'today';
  if (lowerQuery.includes('last 7 days') || lowerQuery.includes('past week')) return 'last_7_days';
  if (lowerQuery.includes('last 24 hours')) return 'last_24_hours';
  if (lowerQuery.includes('last 30 days') || lowerQuery.includes('past month')) return 'last_30_days';
  if (lowerQuery.includes('last hour')) return 'last_hour';
  
  return undefined;
}

// Extract event types from query
function extractEventTypes(query: string): string[] | undefined {
  const lowerQuery = query.toLowerCase();
  const types: string[] = [];
  
  if (lowerQuery.includes('failed login') || lowerQuery.includes('login fail')) {
    types.push('failed_login');
  }
  if (lowerQuery.includes('vpn')) {
    types.push('vpn_connection');
  }
  if (lowerQuery.includes('malware')) {
    types.push('malware_detection');
  }
  if (lowerQuery.includes('successful login') || lowerQuery.includes('login success')) {
    types.push('successful_login');
  }
  if (lowerQuery.includes('firewall')) {
    types.push('firewall_block');
  }
  // ISRO-specific event types
  if (lowerQuery.includes('ground station') || lowerQuery.includes('ground-station')) {
    types.push('ground_station_access');
  }
  if (lowerQuery.includes('telemetry')) {
    types.push('telemetry_data_access');
  }
  if (lowerQuery.includes('command') || lowerQuery.includes('control') || lowerQuery.includes('c&c')) {
    types.push('command_control_access');
  }
  if (lowerQuery.includes('satellite') || lowerQuery.includes('comm anomaly')) {
    types.push('satellite_comm_anomaly');
  }
  if (lowerQuery.includes('mission critical') || lowerQuery.includes('mission-critical')) {
    // Return all mission-critical event types
    types.push('ground_station_access', 'telemetry_data_access', 'command_control_access', 'satellite_comm_anomaly');
  }
  
  return types.length > 0 ? types : undefined;
}

// Extract severity from query
function extractSeverity(query: string): string[] | undefined {
  const lowerQuery = query.toLowerCase();
  const severities: string[] = [];
  
  if (lowerQuery.includes('high risk') || lowerQuery.includes('critical')) {
    severities.push('high');
  }
  if (lowerQuery.includes('medium')) {
    severities.push('medium');
  }
  if (lowerQuery.includes('low')) {
    severities.push('low');
  }
  
  return severities.length > 0 ? severities : undefined;
}

// Extract username from query
function extractUsername(query: string): string | undefined {
  const userMatch = query.match(/user(?:name)?\s+["\']?(\w+\.?\w*)["\']?/i);
  if (userMatch) return userMatch[1];
  
  // Check for common usernames
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('admin')) return 'admin';
  
  return undefined;
}

// Determine query action
function determineAction(query: string): QueryIntent['action'] {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('show') || lowerQuery.includes('display') || lowerQuery.includes('list')) {
    return 'show';
  }
  if (lowerQuery.includes('filter') || lowerQuery.includes('only')) {
    return 'filter';
  }
  if (lowerQuery.includes('count') || lowerQuery.includes('how many')) {
    return 'count';
  }
  if (lowerQuery.includes('analyze') || lowerQuery.includes('summary')) {
    return 'analyze';
  }
  
  return 'show';
}

// Calculate confidence score
function calculateConfidence(entities: QueryIntent['entities']): number {
  let confidence = 0.5; // Base confidence
  
  if (entities.eventType) confidence += 0.2;
  if (entities.timeRange) confidence += 0.2;
  if (entities.severity) confidence += 0.1;
  if (entities.username) confidence += 0.1;
  if (entities.ip) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
}

// Generate DSL query (Domain Specific Language)
function generateDSL(intent: QueryIntent): string {
  const parts: string[] = ['SEARCH'];
  
  if (intent.entities.eventType) {
    parts.push(`event_type IN [${intent.entities.eventType.map(t => `"${t}"`).join(', ')}]`);
  }
  if (intent.entities.timeRange) {
    parts.push(`time_range="${intent.entities.timeRange}"`);
  }
  if (intent.entities.severity) {
    parts.push(`severity IN [${intent.entities.severity.map(s => `"${s}"`).join(', ')}]`);
  }
  if (intent.entities.username) {
    parts.push(`username="${intent.entities.username}"`);
  }
  
  return parts.join(' AND ');
}

// Generate KQL query (Kibana Query Language)
function generateKQL(intent: QueryIntent): string {
  const parts: string[] = [];
  
  if (intent.entities.eventType) {
    parts.push(`eventType:(${intent.entities.eventType.join(' OR ')})`);
  }
  if (intent.entities.timeRange) {
    parts.push(`@timestamp:${intent.entities.timeRange}`);
  }
  if (intent.entities.severity) {
    parts.push(`severity:(${intent.entities.severity.join(' OR ')})`);
  }
  if (intent.entities.username) {
    parts.push(`username:"${intent.entities.username}"`);
  }
  
  return parts.join(' AND ') || '*';
}

// Filter events based on time range
function filterByTimeRange(events: SecurityEvent[], timeRange: string): SecurityEvent[] {
  const now = new Date();
  
  switch (timeRange) {
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      return events.filter(e => e.timestamp >= yesterday && e.timestamp <= endOfYesterday);
    }
    case 'today': {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      return events.filter(e => e.timestamp >= today);
    }
    case 'last_24_hours': {
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return events.filter(e => e.timestamp >= twentyFourHoursAgo);
    }
    case 'last_7_days': {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return events.filter(e => e.timestamp >= sevenDaysAgo);
    }
    case 'last_30_days': {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return events.filter(e => e.timestamp >= thirtyDaysAgo);
    }
    case 'last_hour': {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      return events.filter(e => e.timestamp >= oneHourAgo);
    }
    default:
      return events;
  }
}

// Filter events based on intent
function filterEvents(events: SecurityEvent[], intent: QueryIntent): SecurityEvent[] {
  let filtered = [...events];
  
  // Filter by event type
  if (intent.entities.eventType) {
    filtered = filtered.filter(e => intent.entities.eventType!.includes(e.eventType));
  }
  
  // Filter by time range
  if (intent.entities.timeRange) {
    filtered = filterByTimeRange(filtered, intent.entities.timeRange);
  }
  
  // Filter by severity
  if (intent.entities.severity) {
    filtered = filtered.filter(e => intent.entities.severity!.includes(e.severity));
  }
  
  // Filter by username
  if (intent.entities.username) {
    filtered = filtered.filter(e => 
      e.username.toLowerCase().includes(intent.entities.username!.toLowerCase())
    );
  }
  
  // Filter by IP
  if (intent.entities.ip) {
    filtered = filtered.filter(e => e.ip.includes(intent.entities.ip!));
  }
  
  return filtered;
}

// Calculate statistics
function calculateStats(events: SecurityEvent[]) {
  return {
    total: events.length,
    highSeverity: events.filter(e => e.severity === 'high').length,
    mediumSeverity: events.filter(e => e.severity === 'medium').length,
    lowSeverity: events.filter(e => e.severity === 'low').length
  };
}

// Generate summary text
function generateSummary(intent: QueryIntent, stats: QueryResult['stats']): string {
  const parts: string[] = [];
  
  parts.push(`Found ${stats.total} security events`);
  
  if (intent.entities.eventType) {
    const types = intent.entities.eventType.map(t => t.replace('_', ' ')).join(', ');
    parts.push(`matching type: ${types}`);
  }
  
  if (intent.entities.timeRange) {
    parts.push(`from ${intent.entities.timeRange.replace('_', ' ')}`);
  }
  
  const severityParts: string[] = [];
  if (stats.highSeverity > 0) severityParts.push(`${stats.highSeverity} high`);
  if (stats.mediumSeverity > 0) severityParts.push(`${stats.mediumSeverity} medium`);
  if (stats.lowSeverity > 0) severityParts.push(`${stats.lowSeverity} low`);
  
  if (severityParts.length > 0) {
    parts.push(`(${severityParts.join(', ')} severity)`);
  }
  
  return parts.join(' ') + '.';
}

// Main query processing function
export function processQuery(
  query: string, 
  allEvents: SecurityEvent[],
  previousContext?: QueryIntent
): QueryResult {
  // Parse query for entities
  const entities: QueryIntent['entities'] = {
    eventType: extractEventTypes(query),
    timeRange: extractTimeRange(query),
    severity: extractSeverity(query),
    username: extractUsername(query)
  };
  
  // Merge with previous context for multi-turn conversations
  if (previousContext && query.toLowerCase().includes('filter') && 
      !entities.eventType && !entities.timeRange) {
    // If it's a filter command but no new entities, use previous context
    if (previousContext.entities.eventType) {
      entities.eventType = previousContext.entities.eventType;
    }
    if (previousContext.entities.timeRange) {
      entities.timeRange = previousContext.entities.timeRange;
    }
  }
  
  const action = determineAction(query);
  const confidence = calculateConfidence(entities);
  
  const intent: QueryIntent = {
    action,
    entities,
    confidence
  };
  
  // Generate query translations
  const dslQuery = generateDSL(intent);
  const kqlQuery = generateKQL(intent);
  
  // Filter events
  const filteredEvents = filterEvents(allEvents, intent);
  
  // Calculate statistics
  const stats = calculateStats(filteredEvents);
  
  // Generate summary
  const summary = generateSummary(intent, stats);
  
  return {
    intent,
    dslQuery,
    kqlQuery,
    summary,
    events: filteredEvents,
    stats
  };
}

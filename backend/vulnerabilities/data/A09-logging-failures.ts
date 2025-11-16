import type { Vulnerability } from '../types.js';

export const A09_LoggingFailures: Vulnerability = {
  id: 'A09',
  code: 'A09:2021',
  title: 'Security Logging and Monitoring Failures',
  shortTitle: 'logging-failures',
  icon: '/A09.webp',
  owaspUrl: 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/',
  
  overview: {
    description: 'Security logging and monitoring came from the Top 10 community survey (#3). Logging and monitoring can be challenging to test, but detecting and responding to breaches is critical.',
    rank: 9,
    incidenceRate: '6.51%',
    testCoverage: '19.23%',
    avgWeightedExploit: 6.87,
    avgWeightedImpact: 4.99,
    maxOccurrences: '53,615',
  },
  
  description: [
    'Without logging and monitoring, breaches cannot be detected. Insufficient logging, detection, monitoring, and active response occurs any time auditable events are not logged properly.',
  ],
  
  commonVulnerabilities: [
    'Auditable events, such as logins, failed logins, and high-value transactions, are not logged',
    'Warnings and errors generate no, inadequate, or unclear log messages',
    'Logs of applications and APIs are not monitored for suspicious activity',
    'Logs are only stored locally',
    'Appropriate alerting thresholds and response escalation processes are not in place',
    'Penetration testing and DAST tools do not trigger alerts',
    'The application cannot detect, escalate, or alert for active attacks in real-time',
  ],
  
  howToPrevent: [
    'Ensure all login, access control, and server-side input validation failures can be logged with sufficient user context',
    'Ensure that logs are generated in a format that log management solutions can easily consume',
    'Ensure log data is encoded correctly to prevent injections or attacks on the logging systems',
    'Ensure high-value transactions have an audit trail with integrity controls',
    'DevSecOps teams should establish effective monitoring and alerting',
    'Establish or adopt an incident response and recovery plan, such as NIST 800-61r2',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Healthcare provider breach',
      description: 'A children\'s health plan provider couldn\'t detect a breach due to lack of monitoring. An external party informed them that an attacker had accessed sensitive health records. The data breach could have been in progress since 2013, over seven years.',
    },
    {
      title: 'Scenario #2: Indian airline data breach',
      description: 'A major Indian airline had a data breach involving more than ten years\' worth of personal data of millions of passengers. The breach occurred at a third-party cloud hosting provider.',
    },
    {
      title: 'Scenario #3: European airline GDPR breach',
      description: 'A major European airline suffered a reportable breach. Attackers exploited payment application vulnerabilities, harvesting more than 400,000 customer payment records. The airline was fined 20 million pounds.',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/utils.ts - Winston logger, backend/server.ts - Request logging middleware',
    testEndpoint: '/api/login',
    description: 'Winston logger with JSON format. All requests logged with IP. Failed logins, access control failures, and errors logged. Admin can view logs.',
  },
};

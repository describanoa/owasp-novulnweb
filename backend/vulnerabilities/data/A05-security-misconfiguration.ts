import type { Vulnerability } from '../types.js';

export const A05_SecurityMisconfiguration: Vulnerability = {
  id: 'A05',
  code: 'A05:2021',
  title: 'Security Misconfiguration',
  shortTitle: 'security-misconfiguration',
  icon: '/A05.webp',
  owaspUrl: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/',
  
  overview: {
    description: 'Moving up from #6 in the previous edition, 90% of applications were tested for some form of misconfiguration, with an average incidence rate of 4.51%, and over 208k occurrences.',
    rank: 5,
    incidenceRate: '4.51%',
    testCoverage: '89.58%',
    avgWeightedExploit: 8.12,
    avgWeightedImpact: 6.56,
    maxOccurrences: '208,387',
  },
  
  description: [
    'The application might be vulnerable if it has missing appropriate security hardening across any part of the application stack or improperly configured permissions on cloud services.',
  ],
  
  commonVulnerabilities: [
    'Missing appropriate security hardening across any part of the application stack',
    'Unnecessary features are enabled or installed (e.g., unnecessary ports, services, pages)',
    'Default accounts and their passwords are still enabled and unchanged',
    'Error handling reveals stack traces or other overly informative error messages to users',
    'Latest security features are disabled or not configured securely',
    'Security settings in application servers, frameworks, libraries, databases are not set to secure values',
    'The server does not send security headers or directives',
    'The software is out of date or vulnerable',
  ],
  
  howToPrevent: [
    'A repeatable hardening process makes it fast and easy to deploy another environment that is appropriately locked down',
    'A minimal platform without any unnecessary features, components, documentation, and samples',
    'A task to review and update configurations appropriate to all security notes, updates, and patches',
    'A segmented application architecture provides effective separation between components',
    'Sending security directives to clients, e.g., Security Headers',
    'An automated process to verify the effectiveness of the configurations and settings in all environments',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Sample applications left on server',
      description: 'The application server comes with sample applications not removed from the production server with known security flaws attackers use to compromise the server.',
    },
    {
      title: 'Scenario #2: Directory listing enabled',
      description: 'Directory listing is not disabled on the server. An attacker discovers they can list directories, finds and downloads compiled Java classes to reverse engineer.',
    },
    {
      title: 'Scenario #3: Detailed error messages',
      description: 'The application server\'s configuration allows detailed error messages, e.g., stack traces, to be returned to users, exposing sensitive information.',
    },
    {
      title: 'Scenario #4: Cloud storage misconfiguration',
      description: 'A cloud service provider has default sharing permissions open to the Internet, allowing sensitive data stored within cloud storage to be accessed.',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/server.ts - Helmet configuration, error handling',
    testEndpoint: '/api/health',
    description: 'Helmet for security headers (CSP, X-Frame-Options, HSTS). Production mode hides stack traces. CORS properly configured.',
  },
};

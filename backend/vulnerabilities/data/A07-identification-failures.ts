import type { Vulnerability } from '../types.js';

export const A07_IdentificationFailures: Vulnerability = {
  id: 'A07',
  code: 'A07:2021',
  title: 'Identification and Authentication Failures',
  shortTitle: 'identification-failures',
  icon: '/A07.webp',
  owaspUrl: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/',
  
  overview: {
    description: 'Previously known as Broken Authentication, this category slid down from the second position and now includes CWEs related to identification failures.',
    rank: 7,
    incidenceRate: '2.55%',
    testCoverage: '14.84%',
    avgWeightedExploit: 7.40,
    avgWeightedImpact: 6.50,
    maxOccurrences: '132,195',
  },
  
  description: [
    'Confirmation of the user\'s identity, authentication, and session management is critical to protect against authentication-related attacks.',
  ],
  
  commonVulnerabilities: [
    'Permits automated attacks such as credential stuffing',
    'Permits brute force or other automated attacks',
    'Permits default, weak, or well-known passwords',
    'Uses weak or ineffective credential recovery and forgot-password processes',
    'Uses plain text, encrypted, or weakly hashed passwords',
    'Has missing or ineffective multi-factor authentication',
    'Exposes session identifier in the URL',
    'Reuses session identifier after successful login',
    'Does not correctly invalidate Session IDs during logout',
  ],
  
  howToPrevent: [
    'Where possible, implement multi-factor authentication',
    'Do not ship or deploy with any default credentials',
    'Implement weak password checks against the top 10,000 worst passwords list',
    'Align password policies with NIST 800-63b guidelines',
    'Ensure registration, credential recovery, and API pathways are hardened against account enumeration',
    'Limit or increasingly delay failed login attempts',
    'Use a server-side, secure, built-in session manager that generates a new random session ID with high entropy after login',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Credential stuffing',
      description: 'Credential stuffing, the use of lists of known passwords, is a common attack. If an application does not implement automated threat protection, it can be used as a password oracle.',
    },
    {
      title: 'Scenario #2: Weak password requirements',
      description: 'Most authentication attacks occur due to the continued use of passwords as a sole factor. Password rotation and complexity requirements encourage users to use and reuse weak passwords.',
    },
    {
      title: 'Scenario #3: Session timeout issues',
      description: 'Application session timeouts aren\'t set correctly. A user uses a public computer and simply closes the browser tab. An attacker uses the same browser later and the user is still authenticated.',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/auth.ts - JWT authentication, backend/server.ts - Rate limiting',
    testEndpoint: '/api/login',
    description: 'JWT tokens with expiration (24h). Rate limiting (5 attempts/15min). Bcrypt password hashing. Session validation on each request.',
  },
};

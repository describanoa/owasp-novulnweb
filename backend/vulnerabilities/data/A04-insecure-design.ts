import type { Vulnerability } from '../types.js';

export const A04_InsecureDesign: Vulnerability = {
  id: 'A04',
  code: 'A04:2021',
  title: 'Insecure Design',
  shortTitle: 'insecure-design',
  icon: '/A04.webp',
  owaspUrl: 'https://owasp.org/Top10/A04_2021-Insecure_Design/',
  
  overview: {
    description: 'A new category for 2021 focuses on risks related to design and architectural flaws, with a call for more use of threat modeling, secure design patterns, and reference architectures.',
    rank: 4,
    incidenceRate: '3.00%',
    testCoverage: '24.19%',
    avgWeightedExploit: 6.46,
    avgWeightedImpact: 6.78,
    maxOccurrences: '262,407',
  },
  
  description: [
    'Insecure design is a broad category representing different weaknesses, expressed as "missing or ineffective control design."',
    'A secure design can still have implementation defects leading to vulnerabilities. An insecure design cannot be fixed by a perfect implementation as by definition, needed security controls were never created.',
    'One of the factors that contribute to insecure design is the lack of business risk profiling inherent in the software or system being developed.',
  ],
  
  commonVulnerabilities: [
    'Missing or ineffective control design',
    'Lack of business risk profiling',
    'Failure to determine what level of security design is required',
    'Missing threat modeling for critical authentication, access control, business logic, and key flows',
    'Lack of segregation of tenants',
    'Missing resource consumption limits',
  ],
  
  howToPrevent: [
    'Establish and use a secure development lifecycle with AppSec professionals',
    'Establish and use a library of secure design patterns or paved road ready to use components',
    'Use threat modeling for critical authentication, access control, business logic, and key flows',
    'Integrate security language and controls into user stories',
    'Integrate plausibility checks at each tier of your application',
    'Write unit and integration tests to validate that all critical flows are resistant to the threat model',
    'Segregate tier layers on the system and network layers',
    'Limit resource consumption by user or service',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Credential recovery workflow',
      description: 'A credential recovery workflow might include "questions and answers," which is prohibited by NIST 800-63b. Questions and answers cannot be trusted as evidence of identity.',
    },
    {
      title: 'Scenario #2: Cinema chain booking',
      description: 'A cinema chain allows group booking discounts. Attackers could book six hundred seats at once in a few requests, causing a massive loss of income.',
    },
    {
      title: 'Scenario #3: Retail chain bot protection',
      description: 'A retail chain\'s e-commerce website does not have protection against bots buying high-end video cards to resell, creating bad publicity and enduring bad blood with enthusiasts.',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/server.ts - Rate limiting, backend/utils.ts - File upload restrictions',
    testEndpoint: '/api/register',
    description: 'Rate limiting (5 auth attempts/15min), file size limits (1MB), MIME type validation, resource consumption controls.',
  },
};

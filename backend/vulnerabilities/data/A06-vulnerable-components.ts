import type { Vulnerability } from '../types.js';

export const A06_VulnerableComponents: Vulnerability = {
  id: 'A06',
  code: 'A06:2021',
  title: 'Vulnerable and Outdated Components',
  shortTitle: 'vulnerable-components',
  icon: '/A06.webp',
  owaspUrl: 'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/',
  
  overview: {
    description: 'It was #2 from the Top 10 community survey. Vulnerable Components are a known issue that we struggle to test and assess risk. It is the only category to not have any CVEs mapped to the included CWEs.',
    rank: 6,
    incidenceRate: '8.77%',
    testCoverage: '27.96%',
    avgWeightedExploit: 5.00,
    avgWeightedImpact: 5.00,
    maxOccurrences: '30,457',
  },
  
  description: [
    'You are likely vulnerable if you do not know the versions of all components you use (both client-side and server-side), including nested dependencies.',
  ],
  
  commonVulnerabilities: [
    'If you do not know the versions of all components you use',
    'If the software is vulnerable, unsupported, or out of date',
    'If you do not scan for vulnerabilities regularly and subscribe to security bulletins',
    'If you do not fix or upgrade the underlying platform, frameworks, and dependencies in a timely fashion',
    'If software developers do not test the compatibility of updated, upgraded, or patched libraries',
    'If you do not secure the components\' configurations',
  ],
  
  howToPrevent: [
    'Remove unused dependencies, unnecessary features, components, files, and documentation',
    'Continuously inventory the versions of both client-side and server-side components using tools like OWASP Dependency Check',
    'Only obtain components from official sources over secure links. Prefer signed packages',
    'Monitor for libraries and components that are unmaintained or do not create security patches',
    'Every organization must ensure an ongoing plan for monitoring, triaging, and applying updates',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Components with known vulnerabilities',
      description: 'Components typically run with the same privileges as the application itself, so flaws in any component can result in serious impact. CVE-2017-5638, a Struts 2 remote code execution vulnerability has been blamed for significant breaches.',
    },
    {
      title: 'Scenario #2: IoT devices difficult to patch',
      description: 'While the internet of things (IoT) is frequently difficult or impossible to patch, the importance of patching them can be great (e.g., biomedical devices).',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'package.json - Regular dependency updates',
    description: 'Using latest stable versions of Express, Mongoose, bcrypt, JWT, Helmet, Sharp. Regular security audits with npm audit.',
  },
};

import type { Vulnerability } from '../types.js';

export const A08_IntegrityFailures: Vulnerability = {
  id: 'A08',
  code: 'A08:2021',
  title: 'Software and Data Integrity Failures',
  shortTitle: 'integrity-failures',
  icon: '/A08.webp',
  owaspUrl: 'https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/',
  
  overview: {
    description: 'A new category for 2021 focuses on making assumptions related to software updates, critical data, and CI/CD pipelines without verifying integrity.',
    rank: 8,
    incidenceRate: '2.05%',
    testCoverage: '16.67%',
    avgWeightedExploit: 6.94,
    avgWeightedImpact: 7.94,
    maxOccurrences: '47,972',
  },
  
  description: [
    'Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations.',
    'An example is where an application relies upon plugins, libraries, or modules from untrusted sources, repositories, and content delivery networks (CDNs).',
    'An insecure CI/CD pipeline can introduce the potential for unauthorized access, malicious code, or system compromise.',
  ],
  
  commonVulnerabilities: [
    'Application relies upon plugins, libraries, or modules from untrusted sources',
    'Insecure CI/CD pipeline can introduce unauthorized access',
    'Auto-update functionality downloads updates without sufficient integrity verification',
    'Objects or data are encoded or serialized into a structure that an attacker can see and modify (insecure deserialization)',
  ],
  
  howToPrevent: [
    'Use digital signatures or similar mechanisms to verify the software or data is from the expected source',
    'Ensure libraries and dependencies are consuming trusted repositories',
    'Ensure that a software supply chain security tool is used to verify components do not contain known vulnerabilities',
    'Ensure that there is a review process for code and configuration changes',
    'Ensure that your CI/CD pipeline has proper segregation, configuration, and access control',
    'Ensure that unsigned or unencrypted serialized data is not sent to untrusted clients without integrity check',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Update without signing',
      description: 'Many home routers, set-top boxes, device firmware do not verify updates via signed firmware. Unsigned firmware is a growing target for attackers.',
    },
    {
      title: 'Scenario #2: SolarWinds malicious update',
      description: 'Nation-states attacked the SolarWinds Orion update mechanism. The firm distributed a highly targeted malicious update to more than 18,000 organizations.',
    },
    {
      title: 'Scenario #3: Insecure Deserialization',
      description: 'A React application calls Spring Boot microservices. An attacker notices the Java object signature and uses Java Serial Killer tool to gain remote code execution.',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/utils.ts - Sharp image re-encoding, package.json - Trusted dependencies',
    testEndpoint: '/api/profile/upload',
    description: 'Images re-encoded with Sharp to prevent malicious payloads. Dependencies from npm (trusted). File type validation.',
  },
};

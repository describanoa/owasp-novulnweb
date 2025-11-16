import type { Vulnerability } from '../types.js';

export const A10_SSRF: Vulnerability = {
  id: 'A10',
  code: 'A10:2021',
  title: 'Server-Side Request Forgery (SSRF)',
  shortTitle: 'ssrf',
  icon: '/A10-.webp',
  owaspUrl: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/',
  
  overview: {
    description: 'This category is added from the Top 10 community survey (#1). The data shows a relatively low incidence rate with above average testing coverage and above-average Exploit and Impact potential ratings.',
    rank: 10,
    incidenceRate: '2.72%',
    testCoverage: '67.72%',
    avgWeightedExploit: 8.28,
    avgWeightedImpact: 6.72,
    maxOccurrences: '9,503',
  },
  
  description: [
    'SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL.',
    'It allows an attacker to coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall, VPN, or another type of network ACL.',
    'As modern web applications provide end-users with convenient features, fetching a URL becomes a common scenario, increasing SSRF incidence.',
  ],
  
  commonVulnerabilities: [
    'Web application fetches a remote resource without validating the user-supplied URL',
    'Application sends requests to unexpected destinations',
    'Attacker can bypass firewall, VPN, or network ACL protections',
    'Cloud services and complex architectures increase SSRF severity',
  ],
  
  howToPrevent: [
    'Segment remote resource access functionality in separate networks',
    'Enforce "deny by default" firewall policies',
    'Sanitize and validate all client-supplied input data',
    'Enforce the URL schema, port, and destination with a positive allow list',
    'Do not send raw responses to clients',
    'Disable HTTP redirections',
    'Be aware of URL consistency to avoid DNS rebinding and TOCTOU race conditions',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Port scan internal servers',
      description: 'If the network architecture is unsegmented, attackers can map out internal networks and determine if ports are open or closed on internal servers.',
    },
    {
      title: 'Scenario #2: Sensitive data exposure',
      description: 'Attackers can access local files or internal services to gain sensitive information',
      exploitExample: 'file:///etc/passwd\nhttp://localhost:28017/',
    },
    {
      title: 'Scenario #3: Access cloud metadata',
      description: 'Most cloud providers have metadata storage. An attacker can read the metadata to gain sensitive information.',
      exploitExample: 'http://169.254.169.254/',
    },
    {
      title: 'Scenario #4: Compromise internal services',
      description: 'The attacker can abuse internal services to conduct further attacks such as Remote Code Execution (RCE) or Denial of Service (DoS).',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: false,
    location: 'Not currently implemented',
    description: 'This application does not fetch remote URLs based on user input, so SSRF is not applicable.',
  },
};

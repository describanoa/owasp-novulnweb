import type { Vulnerability } from '../types.js';

export const A02_CryptographicFailures: Vulnerability = {
  id: 'A02',
  code: 'A02:2021',
  title: 'Cryptographic Failures',
  shortTitle: 'cryptographic-failures',
  icon: '/A02.webp',
  owaspUrl: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/',
  
  overview: {
    description: 'Shifting up one position to #2, previously known as Sensitive Data Exposure, the focus is on failures related to cryptography (or lack thereof), which often lead to exposure of sensitive data.',
    rank: 2,
    incidenceRate: '4.49%',
    testCoverage: '46.44%',
    avgWeightedExploit: 7.29,
    avgWeightedImpact: 6.81,
    maxOccurrences: '233,788',
  },
  
  description: [
    'The first thing is to determine the protection needs of data in transit and at rest. For example, passwords, credit card numbers, health records, personal information, and business secrets require extra protection.',
  ],
  
  commonVulnerabilities: [
    'Is any data transmitted in clear text? This concerns protocols such as HTTP, SMTP, FTP',
    'Are any old or weak cryptographic algorithms or protocols used either by default or in older code?',
    'Are default crypto keys in use, weak crypto keys generated or re-used, or is proper key management or rotation missing?',
    'Is encryption not enforced, e.g., are any HTTP headers (browser) security directives or headers missing?',
    'Are deprecated hash functions such as MD5 or SHA1 in use?',
    'Are passwords being used as cryptographic keys in absence of a password base key derivation function?',
  ],
  
  howToPrevent: [
    'Classify data processed, stored, or transmitted by an application. Identify which data is sensitive',
    'Don\'t store sensitive data unnecessarily. Discard it as soon as possible',
    'Make sure to encrypt all sensitive data at rest',
    'Ensure up-to-date and strong standard algorithms, protocols, and keys are in place',
    'Encrypt all data in transit with secure protocols such as TLS with forward secrecy ciphers',
    'Disable caching for response that contain sensitive data',
    'Store passwords using strong adaptive and salted hashing functions with a work factor, such as Argon2, scrypt, bcrypt or PBKDF2',
    'Always use authenticated encryption instead of just encryption',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Automatic database decryption',
      description: 'An application encrypts credit card numbers in a database using automatic database encryption. However, this data is automatically decrypted when retrieved, allowing a SQL injection flaw to retrieve credit card numbers in clear text.',
    },
    {
      title: 'Scenario #2: Weak or missing TLS',
      description: 'A site doesn\'t use or enforce TLS for all pages. An attacker monitors network traffic, downgrades connections from HTTPS to HTTP, and steals the user\'s session cookie.',
    },
    {
      title: 'Scenario #3: Unsalted password hashes',
      description: 'The password database uses unsalted or simple hashes. All the unsalted hashes can be exposed with a rainbow table of pre-calculated hashes.',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/auth.ts - bcrypt password hashing with 12 salt rounds',
    testEndpoint: '/api/register',
    description: 'Passwords hashed with bcrypt (12 rounds). JWT tokens for session management. MongoDB connection uses TLS.',
  },
};

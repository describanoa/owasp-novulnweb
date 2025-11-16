import type { Vulnerability } from '../types.js';

export const A01_BrokenAccessControl: Vulnerability = {
  id: 'A01',
  code: 'A01:2021',
  title: 'Broken Access Control',
  shortTitle: 'broken-access-control',
  icon: '/A01.webp',
  owaspUrl: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/',
  
  overview: {
    description: 'Moving up from the fifth position, 94% of applications were tested for some form of broken access control with the average incidence rate of 3.81%, and has the most occurrences in the contributed dataset with over 318k.',
    rank: 1,
    incidenceRate: '3.81%',
    testCoverage: '94%',
    avgWeightedExploit: 6.92,
    avgWeightedImpact: 5.93,
    maxOccurrences: '318,487',
  },
  
  description: [
    'Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user\'s limits.',
  ],
  
  commonVulnerabilities: [
    'Violation of the principle of least privilege or deny by default, where access should only be granted for particular capabilities, roles, or users, but is available to anyone',
    'Bypassing access control checks by modifying the URL (parameter tampering or force browsing), internal application state, or the HTML page, or by using an attack tool modifying API requests',
    'Permitting viewing or editing someone else\'s account, by providing its unique identifier (insecure direct object references)',
    'Accessing API with missing access controls for POST, PUT and DELETE',
    'Elevation of privilege. Acting as a user without being logged in or acting as an admin when logged in as a user',
    'Metadata manipulation, such as replaying or tampering with a JSON Web Token (JWT) access control token, or a cookie or hidden field manipulated to elevate privileges or abusing JWT invalidation',
    'CORS misconfiguration allows API access from unauthorized/untrusted origins',
    'Force browsing to authenticated pages as an unauthenticated user or to privileged pages as a standard user',
  ],
  
  howToPrevent: [
    'Except for public resources, deny by default',
    'Implement access control mechanisms once and re-use them throughout the application, including minimizing Cross-Origin Resource Sharing (CORS) usage',
    'Model access controls should enforce record ownership rather than accepting that the user can create, read, update, or delete any record',
    'Unique application business limit requirements should be enforced by domain models',
    'Disable web server directory listing and ensure file metadata (e.g., .git) and backup files are not present within web roots',
    'Log access control failures, alert admins when appropriate (e.g., repeated failures)',
    'Rate limit API and controller access to minimize the harm from automated attack tooling',
    'Stateful session identifiers should be invalidated on the server after logout. Stateless JWT tokens should rather be short-lived so that the window of opportunity for an attacker is minimized',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Unverified data in SQL call',
      description: 'The application uses unverified data in a SQL call that is accessing account information',
      vulnerableCode: `pstmt.setString(1, request.getParameter("acct"));
ResultSet results = pstmt.executeQuery();`,
      language: 'java',
      exploitExample: 'https://example.com/app/accountInfo?acct=notmyacct',
    },
    {
      title: 'Scenario #2: Force browsing to admin pages',
      description: 'An attacker simply force browses to target URLs. Admin rights are required for access to the admin page.',
      exploitExample: 'https://example.com/app/getappInfo\nhttps://example.com/app/admin_getappInfo',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/server.ts - authenticateJWT and requireAdmin middleware',
    testEndpoint: '/api/admin/users',
    description: 'JWT-based authentication with role-based access control (RBAC). Admin routes protected with requireAdmin middleware.',
  },
};

import type { Vulnerability } from '../types.js';

export const A03_Injection: Vulnerability = {
  id: 'A03',
  code: 'A03:2021',
  title: 'Injection',
  shortTitle: 'injection',
  icon: '/A03.webp',
  owaspUrl: 'https://owasp.org/Top10/A03_2021-Injection/',
  
  overview: {
    description: 'Injection slides down to the third position. 94% of applications were tested for some form of injection with a max incidence rate of 19%, an average incidence rate of 3%, and 274k occurrences.',
    rank: 3,
    incidenceRate: '3.37%',
    testCoverage: '94.04%',
    avgWeightedExploit: 7.25,
    avgWeightedImpact: 7.15,
    maxOccurrences: '274,228',
  },
  
  description: [
    'An application is vulnerable to attack when user-supplied data is not validated, filtered, or sanitized by the application.',
    'Some of the more common injections are SQL, NoSQL, OS command, Object Relational Mapping (ORM), LDAP, and Expression Language (EL) or Object Graph Navigation Library (OGNL) injection.',
  ],
  
  commonVulnerabilities: [
    'User-supplied data is not validated, filtered, or sanitized by the application',
    'Dynamic queries or non-parameterized calls without context-aware escaping are used directly in the interpreter',
    'Hostile data is used within object-relational mapping (ORM) search parameters to extract additional, sensitive records',
    'Hostile data is directly used or concatenated in SQL or commands',
  ],
  
  howToPrevent: [
    'The preferred option is to use a safe API, which avoids using the interpreter entirely, provides a parameterized interface, or migrates to Object Relational Mapping Tools (ORMs)',
    'Use positive server-side input validation',
    'For any residual dynamic queries, escape special characters using the specific escape syntax for that interpreter',
    'Use LIMIT and other SQL controls within queries to prevent mass disclosure of records in case of SQL injection',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: SQL Injection',
      description: 'An application uses untrusted data in the construction of a vulnerable SQL call',
      vulnerableCode: `String query = "SELECT * FROM accounts WHERE custID='" + request.getParameter("id") + "'";`,
      language: 'java',
      exploitExample: `http://example.com/app/accountView?id=' UNION SELECT SLEEP(10);--`,
    },
    {
      title: 'Scenario #2: Hibernate Query Language (HQL) Injection',
      description: 'Similarly, an application\'s blind trust in frameworks may result in queries that are still vulnerable',
      vulnerableCode: `Query HQLQuery = session.createQuery("FROM accounts WHERE custID='" + request.getParameter("id") + "'");`,
      language: 'java',
    },
  ],
  
  codeExamples: [],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/db.ts - Mongoose schemas with validation, backend/server.ts - express-validator',
    testEndpoint: '/api/register',
    description: 'Mongoose prevents NoSQL injection with parameterized queries. express-validator validates all inputs.',
  },
};

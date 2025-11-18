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
  
  codeExamples: [
    {
      title: 'Prevención de Inyección NoSQL',
      language: 'typescript',
      vulnerable: {
        code: `app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Inyección NoSQL posible: {"username": {"$ne": null}, "password": {"$ne": null}}
  const user = await User.findOne({
    username: username,
    password: password
  });
  
  if (user) {
    return res.json({ success: true });
  }
});`,
        explanation: 'Usar directamente la entrada del usuario sin validación permite inyección NoSQL. Un atacante puede enviar operadores como $ne, $gt, $regex para bypassear la autenticación.',
      },
      secure: {
        code: `import { body, validationResult } from 'express-validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_-]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  },
  { ... }
});

export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username es requerido'),
  
  body('password')
    .notEmpty()
    .withMessage('Password es requerido'),
];

app.post(
  '/api/login',
  authLimiter,
  validateLogin,
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await loginUser(username, password);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(401).json(result);
      }
    } catch (error: any) {
      logger.error(\`Error en /api/login: \${error.message}\`);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  }
);`,
        explanation: 'Mongoose previene inyección NoSQL usando queries parametrizadas automáticamente, express-validator sanitiza y valida toda entrada del usuario. Los esquemas de Mongoose aplican validación a nivel de base de datos.',
      },
    },
  ],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/db.ts - Esquemas de Mongoose con validación, backend/server.ts - express-validator',
    testEndpoint: '/api/register',
    description: 'Mongoose previene inyección NoSQL usando queries parametrizadas automáticamente, express-validator valida todas las entradas.',
  },
};

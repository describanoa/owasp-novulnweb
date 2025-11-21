import type { Vulnerability } from '../types.js';

export const A09_LoggingFailures: Vulnerability = {
  id: 'A09',
  code: 'A09:2021',
  title: 'Security Logging and Monitoring Failures',
  shortTitle: 'logging-failures',
  icon: '/A09.webp',
  owaspUrl: 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/',
  
  overview: {
    description: 'Security logging and monitoring came from the Top 10 community survey (#3). Logging and monitoring can be challenging to test, but detecting and responding to breaches is critical.',
    rank: 9,
    incidenceRate: '6.51%',
    testCoverage: '19.23%',
    avgWeightedExploit: 6.87,
    avgWeightedImpact: 4.99,
    maxOccurrences: '53,615',
  },
  
  description: [
    'Without logging and monitoring, breaches cannot be detected. Insufficient logging, detection, monitoring, and active response occurs any time auditable events are not logged properly.',
  ],
  
  commonVulnerabilities: [
    'Auditable events, such as logins, failed logins, and high-value transactions, are not logged',
    'Warnings and errors generate no, inadequate, or unclear log messages',
    'Logs of applications and APIs are not monitored for suspicious activity',
    'Logs are only stored locally',
    'Appropriate alerting thresholds and response escalation processes are not in place',
    'Penetration testing and DAST tools do not trigger alerts',
    'The application cannot detect, escalate, or alert for active attacks in real-time',
  ],
  
  howToPrevent: [
    'Ensure all login, access control, and server-side input validation failures can be logged with sufficient user context',
    'Ensure that logs are generated in a format that log management solutions can easily consume',
    'Ensure log data is encoded correctly to prevent injections or attacks on the logging systems',
    'Ensure high-value transactions have an audit trail with integrity controls',
    'DevSecOps teams should establish effective monitoring and alerting',
    'Establish or adopt an incident response and recovery plan, such as NIST 800-61r2',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Healthcare provider breach',
      description: 'A children\'s health plan provider couldn\'t detect a breach due to lack of monitoring. An external party informed them that an attacker had accessed sensitive health records. The data breach could have been in progress since 2013, over seven years.',
    },
    {
      title: 'Scenario #2: Indian airline data breach',
      description: 'A major Indian airline had a data breach involving more than ten years\' worth of personal data of millions of passengers. The breach occurred at a third-party cloud hosting provider.',
    },
    {
      title: 'Scenario #3: European airline GDPR breach',
      description: 'A major European airline suffered a reportable breach. Attackers exploited payment application vulnerabilities, harvesting more than 400,000 customer payment records. The airline was fined 20 million pounds.',
    },
  ],
  
  codeExamples: [
    {
      title: 'Logging de Eventos de Seguridad',
      language: 'typescript',
      vulnerable: {
        code: `app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await loginUser(username, password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  return res.json({ token: user.token });
});

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  const users = await User.find();
  return res.json({ users });
});`,
        explanation: 'Sin logging, es imposible detectar ataques de fuerza bruta, accesos no autorizados, o patrones sospechosos. No hay registro de quién accedió a qué recursos ni cuándo. Los administradores no pueden auditar actividad.',
      },
      secure: {
        code: `import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(\`\${req.method} \${req.path} - IP: \${req.ip}\`);
  next();
});

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
);

app.get('/api/admin/users', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    logger.info(\`Administrador (\${req.user?.username}) consultó lista de usuarios\`);
    
    return res.status(200).json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      })),
    });
  } catch (error: any) {
    logger.error(\`Error en GET /api/admin/users: \${error.message}\`);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

app.get('/api/admin/logs', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const fs = await import('fs/promises');
    const logsPath = path.join(process.cwd(), 'logs', 'combined.log');
    
    const logContent = await fs.readFile(logsPath, 'utf-8');
    const lines = logContent.trim().split('\n');
    
    const recentLogs = lines.slice(-100).reverse().map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });
    
    logger.info(\`Administrador (\${req.user?.username}) consultó logs del sistema\`);
    
    return res.status(200).json({
      success: true,
      logs: recentLogs,
    });
  } catch (error: any) {
    logger.error(\`Error en GET /api/admin/logs: \${error.message}\`);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});`,
        explanation: 'Winston registra todos los eventos importantes: requests HTTP, logins exitosos/fallidos, accesos a rutas admin y errores. Los logs usan formato JSON estructurado con timestamps para facilitar el análisis. Se separan los logs de error en su archivo dedicado. Los administradores pueden revisar logs desde el panel admin para auditar actividad y detectar patrones sospechosos.',
      },
    },
  ],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/utils.ts - Logger con Winston, backend/server.ts - Middleware de registro de solicitudes',
    testEndpoint: '',
    description: 'Logger Winston con formato JSON. Todas las solicitudes se registran con la IP. Se registran los intentos de inicio de sesión fallidos, fallos de control de acceso y errores. El administrador puede ver los registros.',
  },
};

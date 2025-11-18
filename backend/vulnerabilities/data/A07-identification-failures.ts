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
  
  codeExamples: [
    {
      title: 'Autenticación JWT y Prevención de Fuerza Bruta',
      language: 'typescript',
      vulnerable: {
        code: `import jwt from 'jsonwebtoken';

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (user && password === user.password) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    return res.json({ token });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
});`,
        explanation: 'Los tokens JWT sin expiración permanecen válidos indefinidamente. Sin rate limiting, los atacantes pueden intentar miles de combinaciones de credenciales. Las contraseñas se comparan directamente sin hashing.',
      },
      secure: {
        code: `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login/registro, intenta más tarde',
  skipSuccessfulRequests: true,
});

export const loginUser = async (username: string, password: string) => {
  try {
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      logger.warn(\`Intento de login fallido - usuario no existe: \${username}\`);
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      logger.warn(\`Intento de login fallido - password incorrecto: \${username}\`);
      throw new Error('Credenciales inválidas');
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        role: user.role,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(\`Login exitoso: \${username}\`);

    return {
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error: any) {
    logger.error(\`Error en loginUser: \${error.message}\`);
    return {
      success: false,
      message: error.message || 'Error al iniciar sesión',
    };
  }
};`,
        explanation: 'Los tokens JWT expiran automáticamente después de 24 horas, minimizando la ventana de oportunidad para atacantes. Rate limiting limita a 5 intentos cada 15 minutos, previniendo fuerza bruta. Uso de bcrypt para comparación segura de contraseñas. Los mensajes de error no revelan si el usuario existe.',
      },
    },
  ],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/auth.ts - Autenticación con JWT, backend/server.ts - Limitación de velocidad (rate limiting)',
    testEndpoint: '/api/login',
    description: 'Tokens JWT con expiración (24 h). Rate limiting (5 intentos cada 15 minutos). Hash de contraseñas con Bcrypt. Validación de sesión en cada solicitud',
  },
};

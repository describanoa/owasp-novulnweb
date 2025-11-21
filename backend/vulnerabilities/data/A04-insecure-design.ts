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
  
  codeExamples: [
    {
      title: 'Rate Limiting y Límites de Recursos',
      language: 'typescript',
      vulnerable: {
        code: `app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await loginUser(username, password);
  return res.json({ token: user.token });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  await processFile(req.file);
  return res.json({ success: true });
});`,
        explanation: 'Sin rate limiting, los atacantes pueden realizar ataques de fuerza bruta ilimitados. Sin límites de tamaño de archivo, pueden causar denegación de servicio (DoS) consumiendo recursos del servidor.',
      },
      secure: {
        code: `import rateLimit from 'express-rate-limit';
import multer from 'multer';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login/registro, intenta más tarde',
  skipSuccessfulRequests: true,
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

export const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB máximo
  },
  fileFilter: (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      logger.warn(\`Tipo de archivo rechazado: \${file.mimetype}, nombre: \${file.originalname}\`);
      cb(new Error('Solo se permiten imágenes JPG o PNG'));
    }
  },
});

app.post(
  '/api/profile/upload',
  authenticateJWT,
  upload.single('profileImage'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
      }
      
      const processedPath = await processImage(req.file.path);
      const filename = path.basename(processedPath);
      
      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      const imagePath = \`/uploads/\${filename}\`;
      user.profileImage = imagePath;
      await user.save();
      
      logger.info(\`Imagen de perfil actualizada para usuario: \${user.username}\`);
      
      return res.status(200).json({
        success: true,
        message: 'Imagen subida correctamente',
        profileImage: imagePath,
      });
    } catch (error: any) {
      logger.error(\`Error en /api/profile/upload: \${error.message}\`);
      res.status(500).json({ success: false, message: error.message || 'Error al subir imagen' });
    }
  }
);`,
        explanation: 'Implemento un rate limiting con 5 intentos máximos cada 15 minutos para prevenir fuerza bruta. Los uploads están limitados a 1MB y solo permiten formatos de imagen específicos.',
      },
    },
  ],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/server.ts - Limitación de velocidad (rate limiting), backend/utils.ts - Restricciones de subida de archivos',
    testEndpoint: '/api/register',
    description: 'Limitación de velocidad (5 intentos de autenticación cada 15 minutos), límites de tamaño de archivo (1 MB), validación de tipo MIME y controles de consumo de recursos.',
  },
};

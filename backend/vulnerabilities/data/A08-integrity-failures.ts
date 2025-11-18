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
  
  codeExamples: [
    {
      title: 'Procesamiento Seguro de Archivos Subidos',
      language: 'typescript',
      vulnerable: {
        code: `import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  
  user.profileImage = filePath;
  await user.save();
  
  return res.json({ success: true, path: filePath });
});`,
        explanation: 'Guardar archivos directamente sin validación permite que atacantes suban archivos maliciosos. Las imágenes pueden contener exploits embebidos, código ejecutable disfrazado o metadatos maliciosos que pueden comprometer el sistema.',
      },
      secure: {
        code: `import sharp from 'sharp';
import multer from 'multer';
import { randomUUID } from 'crypto';

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

export const processImage = async (filePath: string): Promise<string> => {
  try {
    const uniqueName = randomUUID();
    const processedPath = path.join(
      path.dirname(filePath),
      'profile-' + uniqueName + '.jpg'
    );

    await sharp(filePath)
      .resize(500, 500, { fit: 'cover' })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 90 })
      .toFile(processedPath);

    fs.unlinkSync(filePath);

    logger.info(\`Imagen procesada: \${processedPath}\`);
    return processedPath;
  } catch (error: any) {
    logger.error(\`Error procesando imagen: \${error.message}\`);
    throw new Error('Error al procesar imagen');
  }
};

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
        explanation: 'Sharp re-codifica completamente la imagen, eliminando cualquier código malicioso embebido o metadatos peligrosos. Se valida tipo MIME, limita tamaño (1MB), redimensiona a tamaño fijo (500x500) y se convierte todo a JPEG. El archivo original se elimina después del proceso.',
      },
    },
  ],
  
  implementationInApp: {
    hasExample: true,
    location: 'backend/utils.ts - Re-codificación de imágenes con Sharp, backend/server.ts - Endpoint de subida de imágenes',
    testEndpoint: '/api/profile/upload',
    description: 'Imágenes re-codificadas con Sharp para prevenir cargas maliciosas. Validación del tipo de archivo.',
  },
};

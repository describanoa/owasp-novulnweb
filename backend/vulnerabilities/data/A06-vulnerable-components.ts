import type { Vulnerability } from '../types.js';

export const A06_VulnerableComponents: Vulnerability = {
  id: 'A06',
  code: 'A06:2021',
  title: 'Vulnerable and Outdated Components',
  shortTitle: 'vulnerable-components',
  icon: '/A06.webp',
  owaspUrl: 'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/',
  
  overview: {
    description: 'It was #2 from the Top 10 community survey. Vulnerable Components are a known issue that we struggle to test and assess risk. It is the only category to not have any CVEs mapped to the included CWEs.',
    rank: 6,
    incidenceRate: '8.77%',
    testCoverage: '27.96%',
    avgWeightedExploit: 5.00,
    avgWeightedImpact: 5.00,
    maxOccurrences: '30,457',
  },
  
  description: [
    'You are likely vulnerable if you do not know the versions of all components you use (both client-side and server-side), including nested dependencies.',
  ],
  
  commonVulnerabilities: [
    'If you do not know the versions of all components you use',
    'If the software is vulnerable, unsupported, or out of date',
    'If you do not scan for vulnerabilities regularly and subscribe to security bulletins',
    'If you do not fix or upgrade the underlying platform, frameworks, and dependencies in a timely fashion',
    'If software developers do not test the compatibility of updated, upgraded, or patched libraries',
    'If you do not secure the components\' configurations',
  ],
  
  howToPrevent: [
    'Remove unused dependencies, unnecessary features, components, files, and documentation',
    'Continuously inventory the versions of both client-side and server-side components using tools like OWASP Dependency Check',
    'Only obtain components from official sources over secure links. Prefer signed packages',
    'Monitor for libraries and components that are unmaintained or do not create security patches',
    'Every organization must ensure an ongoing plan for monitoring, triaging, and applying updates',
  ],
  
  attackScenarios: [
    {
      title: 'Scenario #1: Components with known vulnerabilities',
      description: 'Components typically run with the same privileges as the application itself, so flaws in any component can result in serious impact. CVE-2017-5638, a Struts 2 remote code execution vulnerability has been blamed for significant breaches.',
    },
    {
      title: 'Scenario #2: IoT devices difficult to patch',
      description: 'While the internet of things (IoT) is frequently difficult or impossible to patch, the importance of patching them can be great (e.g., biomedical devices).',
    },
  ],
  
  codeExamples: [
    {
      title: 'Gestión de Dependencias con Versiones Específicas',
      language: 'json',
      vulnerable: {
        code: `{
  "dependencies": {
    "express": "*",           // Cualquier versión
    "mongoose": "^6.0.0",     // Permite actualizaciones menores
    "jsonwebtoken": "~8.0.0", // Permite parches
    "bcryptjs": "latest",     // Siempre la última
    "helmet": ">4.0.0"        // Cualquiera mayor a 4.0.0
  }
}

// Sin auditorías de seguridad regulares
// Sin seguimiento de CVEs
// Dependencias no actualizadas hace meses`,
        explanation: 'Usar versiones flexibles (*, latest, ^, ~) puede instalar versiones con vulnerabilidades conocidas. Sin auditorías de seguridad, las dependencias pueden permanecer vulnerables indefinidamente. No conocer las versiones exactas dificulta reproducir builds y detectar problemas.',
      },
      secure: {
        code: `{
  "name": "owasp-novulnweb",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "dev:backend": "tsx watch backend/server.ts",
    "dev:all": "concurrently \\"pnpm dev\\" \\"pnpm dev:backend\\"",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/react": "4.4.2",
    "@tailwindcss/vite": "4.1.17",
    "astro": "5.15.9",
    "bcryptjs": "3.0.3",
    "cookie-parser": "1.4.7",
    "cors": "2.8.5",
    "dotenv": "17.2.3",
    "express": "5.1.0",
    "express-rate-limit": "8.2.1",
    "express-validator": "7.3.0",
    "helmet": "8.1.0",
    "jsonwebtoken": "9.0.2",
    "mongodb": "7.0.0",
    "mongoose": "8.20.0",
    "multer": "2.0.2",
    "prismjs": "1.30.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "sharp": "0.34.5",
    "winston": "3.18.3"
  },
  "devDependencies": {
    "@types/cookie-parser": "1.4.10",
    "@types/cors": "2.8.19",
    "@types/express": "5.0.5",
    "@types/jsonwebtoken": "9.0.10",
    "@types/multer": "2.0.0",
    "@types/prismjs": "1.26.5",
    "@types/react": "19.2.6",
    "@types/react-dom": "19.2.3",
    "concurrently": "9.2.1",
    "tailwindcss": "4.1.17",
    "tsx": "4.20.6"
  }
}

// Proceso de actualización:
// 1. Ejecutar 'npm audit' semanalmente
// 2. Revisar 'npm outdated' mensualmente  
// 3. Probar actualizaciones en entorno de desarrollo
// 4. Actualizar en producción después de tests`,
        explanation: 'Uso de versiones fijas (sin ^, ~, *) para garantizar builds reproducibles. Ejecuto npm audit regularmente para detectar vulnerabilidades conocidas. El archivo pnpm-lock.yaml asegura versiones exactas en todos los entornos.',
      },
    },
  ],
  
  implementationInApp: {
    hasExample: true,
    location: 'package.json - Actualización regular de dependencias',
    description: 'Uso de las versiones estables más recientes de Express, Mongoose, bcrypt, JWT, Helmet y Sharp. Auditorías de seguridad periódicas con npm audit.',
  },
};

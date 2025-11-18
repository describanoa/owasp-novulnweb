import type { Vulnerability } from '../types.js';

export const A10_SSRF: Vulnerability = {
  id: 'A10',
  code: 'A10:2021',
  title: 'Server-Side Request Forgery (SSRF)',
  shortTitle: 'ssrf',
  icon: '/A10.webp',
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
  
  codeExamples: [
    {
      title: 'Prevención de SSRF en Fetching de URLs',
      language: 'typescript',
      vulnerable: {
        code: `// ❌ VULNERABLE: Fetch URL sin validación
import axios from 'axios';

app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;
  
  // Fetch directo de URL proporcionada por usuario
  const response = await axios.get(url);
  
  return res.json({ data: response.data });
});

// Ejemplos de ataques:
// POST /api/fetch-url {"url": "http://169.254.169.254/latest/meta-data/"}
// POST /api/fetch-url {"url": "file:///etc/passwd"}
// POST /api/fetch-url {"url": "http://localhost:27017/admin"}
// POST /api/fetch-url {"url": "http://internal-service.local/api/admin"}`,
        explanation: 'Permitir que usuarios especifiquen URLs arbitrarias permite SSRF. Atacantes pueden: 1) Acceder a metadata de cloud (AWS, Azure, GCP), 2) Escanear puertos internos, 3) Leer archivos locales, 4) Acceder a servicios internos protegidos por firewall, 5) Ejecutar comandos en servicios internos vulnerables.',
      },
      secure: {
        code: `// ✅ SEGURO: No implementado en esta app (no necesario)
// Esta aplicación NO permite a usuarios proporcionar URLs para fetch.
// Si en el futuro se necesitara esta funcionalidad, así se implementaría:

import axios from 'axios';
import { URL } from 'url';

// Whitelist de dominios permitidos
const ALLOWED_DOMAINS = [
  'api.example.com',
  'cdn.example.com',
];

const BLOCKED_IPS = [
  '127.0.0.1',      // localhost
  '0.0.0.0',
  '169.254.169.254', // AWS metadata
  '::1',             // IPv6 localhost
];

const validateUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    
    // Solo permitir HTTP/HTTPS
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Protocolo no permitido');
    }
    
    // Verificar contra whitelist
    if (!ALLOWED_DOMAINS.includes(url.hostname)) {
      throw new Error('Dominio no autorizado');
    }
    
    // Verificar IPs bloqueadas
    if (BLOCKED_IPS.includes(url.hostname)) {
      throw new Error('IP bloqueada');
    }
    
    return url.href;
  } catch (error) {
    throw new Error('URL inválida');
  }
};

app.post('/api/fetch-url', authenticateJWT, async (req, res) => {
  const { url } = req.body;
  
  // Validar URL contra whitelist
  const validatedUrl = validateUrl(url);
  
  // Fetch con timeout y sin seguir redirects
  const response = await axios.get(validatedUrl, {
    timeout: 5000,
    maxRedirects: 0,
    validateStatus: (status) => status === 200,
  });
  
  logger.info(\`Usuario \${req.user.username} fetch URL: \${validatedUrl}\`);
  
  // No devolver respuesta raw - solo datos procesados
  return res.json({ 
    success: true,
    dataLength: response.data.length 
  });
});`,
        explanation: 'NOTA: Esta app NO implementa fetching de URLs, así que SSRF no es aplicable. Si fuera necesario, implementaríamos: 1) Whitelist estricta de dominios permitidos, 2) Validación de protocolo (solo HTTP/HTTPS), 3) Bloquear IPs privadas y metadata, 4) Deshabilitar redirects, 5) Timeout corto, 6) No devolver respuestas raw al cliente, 7) Logging de todas las requests.',
      },
    },
  ],
  
  implementationInApp: {
    hasExample: false,
    location: 'Not currently implemented',
    description: 'This application does not fetch remote URLs based on user input, so SSRF is not applicable.',
  },
};

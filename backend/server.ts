/**
 * MITIGACIÓN OWASP: Express Server con protecciones de seguridad
 * - A05:2021 – Security Misconfiguration: Helmet para headers seguros
 * - A07:2021 – Identification Failures: Rate limiting
 * - A01:2021 – Broken Access Control: JWT middleware
 */

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB, User } from './db.js';
import { registerUser, loginUser, verifyToken } from './auth.js';
import type { JWTPayload } from './auth.js';
import {
  upload,
  processImage,
  validateRegister,
  validateLogin,
  checkValidation,
  logger,
} from './utils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4321';

// OWASP A05 - Security Misconfiguration: Helmet para headers seguros
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:3001"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// OWASP A05 - CORS configurado correctamente
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // OWASP A05 - Limitar tamaño de payload
app.use(cookieParser());

// OWASP A09 - Logging: Middleware para loggear requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// OWASP A07 - Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', globalLimiter);

// OWASP A07 - Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login/registro, intenta más tarde',
  skipSuccessfulRequests: true,
});

/**
 * OWASP A01 - Broken Access Control: Middleware para verificar JWT
 */
interface AuthRequest extends Request {
  user?: JWTPayload;
}

const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Intento de acceso sin token: ${req.path}`);
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
  
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  
  if (!payload) {
    logger.warn(`Token inválido en: ${req.path}`);
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
  
  req.user = payload;
  next();
};

/**
 * POST /api/register
 * OWASP A03 - Injection: Validación con express-validator
 * OWASP A02 - Cryptographic Failures: Password hasheado en auth.ts
 */
app.post(
  '/api/register',
  authLimiter,
  validateRegister,
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const result = await registerUser(username, email, password);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      logger.info(`Usuario registrado: ${username}`);
      res.json(result);
    } catch (error: any) {
      logger.error(`Error en /api/register: ${error.message}`);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  }
);

/**
 * POST /api/login
 * OWASP A07 - Identification Failures: Rate limiting + validación
 */
app.post(
  '/api/login',
  authLimiter,
  validateLogin,
  checkValidation,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await loginUser(username, password);
      
      if (!result.success) {
        return res.status(401).json(result);
      }
      
      logger.info(`Login exitoso: ${username}`);
      res.json(result);
    } catch (error: any) {
      logger.error(`Error en /api/login: ${error.message}`);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  }
);

/**
 * GET /api/profile
 * OWASP A01 - Broken Access Control: Requiere autenticación
 */
app.get('/api/profile', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error: any) {
    logger.error(`Error en /api/profile: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

/**
 * POST /api/profile/upload
 * OWASP A04 - Insecure Design: Multer + Sharp para subida segura
 */
app.post(
  '/api/profile/upload',
  authenticateJWT,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se recibió imagen' });
      }
      
      // Procesar imagen con Sharp (re-codificar)
      const processedPath = await processImage(req.file.path);
      const filename = path.basename(processedPath);
      
      // Actualizar usuario
      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      user.profileImage = `/uploads/${filename}`;
      await user.save();
      
      logger.info(`Imagen subida: ${filename} por ${user.username}`);
      
      res.json({
        success: true,
        message: 'Imagen subida exitosamente',
        profileImage: user.profileImage,
      });
    } catch (error: any) {
      logger.error(`Error en /api/profile/upload: ${error.message}`);
      res.status(500).json({ success: false, message: error.message || 'Error al subir imagen' });
    }
  }
);

// OWASP A05 - CORS para uploads (debe ir ANTES de servir archivos)
app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/**
 * Health check
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * OWASP A05 - Security Misconfiguration: Middleware global de manejo de errores
 * Evita exponer stack traces y detalles internos
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log del error completo para debugging (solo en servidor)
  logger.error(`Error no manejado: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // OWASP A05: NO exponer stack trace ni detalles internos al cliente
  // Solo enviar mensaje genérico y seguro
  
  // Errores de Multer (subida de archivos)
  if (err.message === 'Solo se permiten imágenes JPG o PNG') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message === 'File too large') {
    return res.status(400).json({
      success: false,
      message: 'La imagen no debe superar 1MB',
    });
  }

  // Error genérico para cualquier otro caso
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message || 'Error interno del servidor',
  });
});

/**
 * Iniciar servidor
 */
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  });
};

startServer();
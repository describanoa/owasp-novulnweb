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
import vulnerabilityRoutes from './vulnerabilities/routes.js';

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
 * OWASP A01 - Broken Access Control: Middleware para verificar rol de admin
 */
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    logger.warn('Intento de acceso admin sin autenticación');
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
  
  if (req.user.role !== 'admin') {
    logger.warn(`Usuario ${req.user.username} intentó acceder a ruta admin sin permisos`);
    return res.status(403).json({ success: false, message: 'Acceso denegado: Se requiere rol de administrador' });
  }
  
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
      
      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
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
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(401).json(result);
      }
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
    
    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    logger.error(`Error en /api/profile: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

/**
 * POST /api/profile/upload
 * OWASP A08 - Integrity Failures: Validación estricta de uploads
 * OWASP A01 - Broken Access Control: Solo usuarios autenticados
 */
app.post(
  '/api/profile/upload',
  authenticateJWT,
  upload.single('profileImage'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
      }
      
      // OWASP A08 - Integrity: Procesar imagen con Sharp
      const processedPath = await processImage(req.file.path);
      const filename = path.basename(processedPath);
      
      // Actualizar usuario
      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      // Guardar ruta relativa de la imagen
      const imagePath = `/uploads/${filename}`;
      user.profileImage = imagePath;
      await user.save();
      
      logger.info(`Imagen de perfil actualizada para usuario: ${user.username}`);
      
      return res.status(200).json({
        success: true,
        message: 'Imagen subida correctamente',
        profileImage: imagePath,
      });
    } catch (error: any) {
      logger.error(`Error en /api/profile/upload: ${error.message}`);
      res.status(500).json({ success: false, message: error.message || 'Error al subir imagen' });
    }
  }
);

/**
 * DELETE /api/profile/image
 * OWASP A01 - Broken Access Control: Solo el propietario puede eliminar su imagen
 * OWASP A04 - Insecure Design: Eliminar archivo físico del servidor
 */
app.delete('/api/profile/image', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    // Verificar que el usuario tiene imagen
    if (!user.profileImage) {
      return res.status(400).json({ success: false, message: 'No hay imagen de perfil para eliminar' });
    }
    
    // OWASP A04 - Eliminar archivo físico del servidor
    const fs = await import('fs');
    const imagePath = path.join(process.cwd(), 'uploads', path.basename(user.profileImage));
    
    // Verificar que el archivo existe antes de intentar eliminarlo
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      logger.info(`Archivo físico eliminado: ${imagePath}`);
    } else {
      logger.warn(`Archivo no encontrado en disco: ${imagePath}`);
    }
    
    // Actualizar usuario en BD
    user.profileImage = undefined as any;
    await user.save();
    
    logger.info(`Imagen de perfil eliminada para usuario: ${user.username}`);
    
    return res.status(200).json({
      success: true,
      message: 'Imagen eliminada correctamente',
    });
  } catch (error: any) {
    logger.error(`Error en DELETE /api/profile/image: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error al eliminar imagen' });
  }
});

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
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

/**
 * RUTAS DE VULNERABILIDADES - API Educativa OWASP Top 10
 */
app.use('/api/vulnerabilities', vulnerabilityRoutes);

/**
 * RUTAS ADMIN - Solo accesibles por administradores
 */

/**
 * GET /api/admin/users
 * OWASP A01 - Broken Access Control: Solo admin puede ver lista de usuarios
 */
app.get('/api/admin/users', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find()
      .select('-password') // No enviar passwords
      .sort({ createdAt: -1 }); // Más recientes primero
    
    logger.info(`Administrador (${req.user?.username}) consultó lista de usuarios`);
    
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
    logger.error(`Error en GET /api/admin/users: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

/**
 * GET /api/admin/stats
 * OWASP A01 - Broken Access Control: Estadísticas solo para admin
 */
app.get('/api/admin/stats', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const usersWithImage = await User.countDocuments({ profileImage: { $ne: null } });
    
    // Leer logs de errores recientes
    const fs = await import('fs/promises');
    const logsPath = path.join(process.cwd(), 'logs', 'error.log');
    let recentErrors = 0;
    
    try {
      const logContent = await fs.readFile(logsPath, 'utf-8');
      const lines = logContent.trim().split('\n');
      recentErrors = lines.length;
    } catch (err) {
      // Si no existe el archivo, no hay errores
      recentErrors = 0;
    }
    
    logger.info(`Administrador (${req.user?.username}) consultó estadísticas`);
    
    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        usersWithImage,
        recentErrors,
      },
    });
  } catch (error: any) {
    logger.error(`Error en GET /api/admin/stats: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

/**
 * GET /api/admin/logs
 * OWASP A01 - Broken Access Control: Logs solo para admin
 * OWASP A09 - Security Logging: Acceso controlado a logs sensibles
 */
app.get('/api/admin/logs', authenticateJWT, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const fs = await import('fs/promises');
    const logsPath = path.join(process.cwd(), 'logs', 'combined.log');
    
    const logContent = await fs.readFile(logsPath, 'utf-8');
    const lines = logContent.trim().split('\n');
    
    // Últimas 100 líneas
    const recentLogs = lines.slice(-100).reverse().map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });
    
    logger.info(`Administrador (${req.user?.username}) consultó logs del sistema`);
    
    return res.status(200).json({
      success: true,
      logs: recentLogs,
    });
  } catch (error: any) {
    logger.error(`Error en GET /api/admin/logs: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// OWASP A05 - Error handling: No revelar stack traces en producción
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error no manejado: ${err.message}`, { stack: err.stack });
  
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error del servidor' 
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    message,
  });
});

// Conectar a DB y arrancar servidor
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
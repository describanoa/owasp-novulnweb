/**
 * MITIGACIÓN OWASP: Utilidades de Seguridad
 * - A09:2021 – Security Logging Failures: Winston para logs
 * - A03:2021 – Injection: express-validator para validación
 * - A04:2021 – Insecure Design: Procesamiento seguro de imágenes con Sharp
 */

import { body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import winston from 'winston';

/**
 * OWASP A09 - Security Logging: Winston para logs de seguridad
 */
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

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

/**
 * OWASP A03 - Injection: Validaciones con express-validator
 */
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username debe tener entre 3 y 30 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username solo puede contener letras, números, guiones y guiones bajos'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password debe contener al menos una mayúscula, una minúscula y un número'),
];

export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username es requerido'),
  
  body('password')
    .notEmpty()
    .withMessage('Password es requerido'),
];

/**
 * Middleware para verificar errores de validación
 */
export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validación fallida: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * OWASP A04 - Insecure Design: Configuración segura de Multer
 * Solo aceptar imágenes JPG/PNG, máximo 1MB
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB máximo (OWASP A04)
  },
  fileFilter: (req, file, cb) => {
    // OWASP A04: Solo permitir tipos de imagen seguros
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      logger.warn(`Tipo de archivo rechazado: ${file.mimetype}, nombre: ${file.originalname}`);
      cb(new Error('Solo se permiten imágenes JPG o PNG'));
    }
  },
});

/**
 * OWASP A04 - Insecure Design: Procesar imagen con Sharp
 * Re-codifica la imagen para eliminar posibles exploits embebidos
 */
export const processImage = async (filePath: string): Promise<string> => {
  try {
    const processedPath = filePath.replace(
      path.extname(filePath),
      '-processed.jpg'
    );

    // Re-codificar imagen a JPEG limpio
    await sharp(filePath)
      .resize(500, 500, { fit: 'cover' }) // Redimensionar
      .jpeg({ quality: 90 }) // Convertir a JPEG
      .toFile(processedPath);

    // Eliminar archivo original
    fs.unlinkSync(filePath);

    logger.info(`Imagen procesada: ${processedPath}`);
    return processedPath;
  } catch (error: any) {
    logger.error(`Error procesando imagen: ${error.message}`);
    throw new Error('Error al procesar imagen');
  }
};
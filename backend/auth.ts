/**
 * MITIGACIÓN OWASP: Sistema de Autenticación
 * - A02:2021 – Cryptographic Failures: bcryptjs para hashear contraseñas
 * - A01:2021 – Broken Access Control: JWT para control de acceso
 * - A07:2021 – Identification Failures: Validación de credenciales
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const SALT_ROUNDS = 12; // OWASP recomienda 10-12 rondas - OWASP A02 => Alto factor de trabajo para bcrypt

if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET no está configurada en .env');
  process.exit(1);
}

/**
 * Payload del JWT
 */
export type JWTPayload = {
  userId: string;
  username: string;
  email: string;
}

/**
 * Registrar un nuevo usuario
 * OWASP A02 - Cryptographic Failures: Hashear password con bcryptjs
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error('El usuario o email ya existe');
    }

    // OWASP A02: Hashear la contraseña con 12 rondas de salt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear el usuario
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generar JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: '24h' } // OWASP A07: Token expira en 24 horas
    );

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
    return {
      success: false,
      message: error.message || 'Error al registrar usuario',
    };
  }
};

/**
 * Login de usuario
 * OWASP A07 - Identification Failures: Verificar credenciales de forma segura
 */
export const loginUser = async (email: string, password: string) => {
  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      // OWASP A07: No revelar si el usuario existe o no
      throw new Error('Credenciales inválidas');
    }

    // OWASP A02: Comparar password con el hash usando bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // OWASP A07: Mismo mensaje para usuario inexistente o password incorrecto
      throw new Error('Credenciales inválidas');
    }

    // Actualizar lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Generar JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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
    return {
      success: false,
      message: error.message || 'Error al iniciar sesión',
    };
  }
};

/**
 * Verificar JWT
 * OWASP A01 - Broken Access Control: Validar token antes de dar acceso
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null; // Token inválido o expirado
  }
};
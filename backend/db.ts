/**
 * MITIGACIÓN OWASP: Database Connection con Mongoose
 * - A03:2021 – Injection: Mongoose usa queries parametrizadas por defecto
 * - A02:2021 – Cryptographic Failures: Conexión segura con MongoDB Atlas (TLS/SSL)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI no está configurada en .env');
  process.exit(1);
}

/**
 * Conectar a MongoDB Atlas
 * OWASP A02 - Cryptographic Failures: Usa TLS/SSL por defecto en mongodb+srv://
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      // Opciones de seguridad
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Schema de Usuario con validaciones
 * OWASP A03 - Injection: Mongoose previene NoSQL injection con schemas tipados
 * OWASP A02 - Cryptographic Failures: Password hasheada con bcrypt
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    // OWASP A03 - Injection: Validación estricta de formato
    match: /^[a-zA-Z0-9_-]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // OWASP A03 - Injection: Validación de email
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 60, // bcrypt hash length
    select: false, // OWASP A05: No incluir password en queries por defecto
  },
  profileImage: {
    type: String,
    default: null,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
});

// OWASP A05 - Security Misconfiguration: Nunca devolver password en JSON
userSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);

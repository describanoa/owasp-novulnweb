import { useState, type FormEvent } from 'react';

const API_URL = 'http://localhost:3001';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Error al registrar usuario');
        setLoading(false);
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem('token', data.token);

      // También guardar token en cookies para server-side rendering
      document.cookie = `token=${data.token}; path=/; max-age=${24 * 60 * 60}`; // 24h

      const urlParams = new URLSearchParams(globalThis.location.search);
      const redirectUrl = urlParams.get('redirect') || '/profile';

      // Redirigir a la URL solicitada o al perfil por defecto
      globalThis.location.href = redirectUrl;
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
          Usuario
        </label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          required
          minLength={3}
          maxLength={30}
          disabled={loading}
        />
        <p className="text-xs text-gray-400 mt-1">
          3-30 caracteres, solo letras, números, guiones
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          required
          minLength={8}
          disabled={loading}
        />
        <p className="text-xs text-gray-400 mt-1">
          Mínimo 8 caracteres, incluye mayúscula, minúscula y número
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 cursor-pointer"
      >
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </button>
    </form>
  );
}
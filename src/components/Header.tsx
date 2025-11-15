import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Validar token con el backend
    validateToken();

    // Revisar cambios en el storage (login/logout)
    const handleStorageChange = () => {
      validateToken();
    };

    globalThis.addEventListener('storage', handleStorageChange);
    return () => globalThis.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Validar token con el backend
   * OWASP A07 - Identification Failures: Validar token antes de mostrar UI autenticada
   */
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsValidating(false);
      return;
    }

    try {
      // Validar el token con el backend
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        // Token inválido o expirado
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Error de conexión - asumir no autenticado
      setIsAuthenticated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    globalThis.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-blue-600">
          🔒 SecureApp
        </a>
        
        <div className="space-x-4">
          {/* Mostrar loading mientras valida el token */}
          {isValidating ? (
            <span className="text-gray-500">Cargando...</span>
          ) : isAuthenticated ? (
            <>
              <a href="/profile" className="text-gray-700 hover:text-blue-600">
                Mi Perfil
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-gray-700 hover:text-blue-600">
                Iniciar Sesión
              </a>
              <a
                href="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Registrarse
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
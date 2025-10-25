import { useEffect, useState } from 'react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay token en el localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Revisar cambios en el storage (login/logout)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    globalThis.addEventListener('storage', handleStorageChange);
    return () => globalThis.removeEventListener('storage', handleStorageChange);
  }, []);

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
          {isAuthenticated ? (
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
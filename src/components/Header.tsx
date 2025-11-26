import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

/**
 * OWASP A09 - Security Logging: Enviar eventos de seguridad al backend
 * Los eventos del cliente se registran en el servidor para auditoría
 */
const logSecurityEvent = async (event: string, details?: Record<string, any>) => {
  try {
    await fetch(`${API_URL}/api/security-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        details,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.warn('No se pudo enviar evento de seguridad:', event);
  }
};

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Validar token con el backend
    validateToken();

    // Revisar cambios en el storage (login/logout)
    const handleStorageChange = () => {
      validateToken();
    };

    globalThis.addEventListener('storage', handleStorageChange);

    // Intervalo para verificar la sesión (localStorage | cookies)
    const intervalId = setInterval(() => {
      const localToken = localStorage.getItem('token');
      const cookieToken = document.cookie
        .split('; ')
        .some((item) => item.trim().startsWith('token='));

        // OWASP A09 - Loggear evento de seguridad en el backend
        if (localToken && !cookieToken) {
          // Si el token está en localStorage pero no en cookies, cerrar la sesión
          logSecurityEvent('TOKEN_COOKIE_ELIMINADO', { reason: 'Falta la cookie de sesión, cerrando sesión' });
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setIsAdmin(false);
          globalThis.location.href = '/';
        } else if (!localToken && cookieToken) {
          // Si el token está en cookies pero no en localStorage, cerrar la sesión
          logSecurityEvent('TOKEN_LOCALSTORAGE_ELIMINADO', { reason: 'Falta el token local de sesión, cerrando sesión' });
          document.cookie = 'token=; path=/; max-age=0';
          setIsAuthenticated(false);
          setIsAdmin(false);
          globalThis.location.href = '/';
        }
      }, 2500);

    return () => {
      globalThis.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId)
    }
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
        const data = await response.json();
        setIsAuthenticated(true);
        // Verificar si es admin
        if (data.user && data.user.role === 'admin') {
          setIsAdmin(true);
        }
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
    document.cookie = 'token=; path=/; max-age=0';
    setIsAuthenticated(false);
    globalThis.location.href = '/';
  };

  return (
    <div className="fixed z-50 py-8 md:py-6 top-0 left-0 w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm transition-all duration-300">
      <header className="flex items-center justify-between container mx-auto px-4">
        <a href="/" className="flex items-center gap-3 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <span className="text-white">SecureApp</span>
        </a>
        
        <div className="flex items-center gap-x-4 md:gap-x-10 flex-wrap justify-end">
          {/* Mostrar loading mientras valida el token */}
          {isValidating ? (
            <span className="uppercase font-mono text-foreground/60 text-sm md:text-base">Cargando...</span>
          ) : isAuthenticated ? (
            <>
              <nav className="flex items-center justify-center gap-x-4 md:gap-x-10">
                <a href="/profile" className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out text-xs md:text-sm">
                  Mi Perfil
                </a>
                {isAdmin && (
                  <a href="/admin" className="uppercase inline-block font-mono text-purple-400 hover:text-purple-300 duration-150 transition-colors ease-out text-xs md:text-sm">
                    Admin
                  </a>
                )}
              </nav>
              <button
                onClick={handleLogout}
                className="uppercase transition-colors ease-out duration-150 font-mono text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-none text-xs md:text-sm"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <nav className="flex items-center gap-x-4 md:gap-x-10">
              <a href="/login" className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out text-xs md:text-sm">
                Iniciar Sesión
              </a>
              <a
                href="/register"
                className="uppercase transition-colors ease-out duration-150 font-mono text-primary hover:text-primary/80 text-xs md:text-sm"
              >
                Registrarse
              </a>
            </nav>
          )}
        </div>
      </header>
    </div>
  );
}
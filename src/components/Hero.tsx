/**
 * MITIGACIÓN OWASP: Hero Component para página principal
 */

import { useEffect, useState } from 'react';

export default function Hero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Verificar si hay token de sesión
    const token = localStorage.getItem('token');
    const tokenValid = (token && token.length > 0) ? true : false;
    setIsAuthenticated(tokenValid);
  }, []);

  const [clickedUrl, setClickedUrl] = useState('');

  const handleProtectedClick = (e: React.MouseEvent, url: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setClickedUrl(url);
      setShowAlert(true);
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          🔒 Aplicación Web Segura
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Proyecto universitario con mitigación completa del OWASP Top 10 (2021).
          Login, registro y perfil con las mejores prácticas de seguridad.
        </p>

        {/* Alerta de autenticación requerida */}
        {showAlert && (
          <div className="mb-8 max-w-2xl mx-auto animate-fade-down animate-duration-1000">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="font-bold text-yellow-900 mb-1">
                    ¡Autenticación requerida!
                  </p>
                  <p className="text-yellow-800 text-sm">
                    Necesitas{' '}
                    <a href={`/login?redirect=${encodeURIComponent(clickedUrl)}`} className="underline font-semibold hover:text-yellow-900">
                      iniciar sesión
                    </a>{' '}
                    o{' '}
                    <a href={`/register?redirect=${encodeURIComponent(clickedUrl)}`} className="underline font-semibold hover:text-yellow-900">
                      registrarte
                    </a>{' '}
                    para acceder a este contenido.
                  </p>
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className="text-yellow-600 hover:text-yellow-900 text-2xl font-bold cursor-pointer"
                >
                  x
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center items-center flex-wrap">
            <a
              href="/vulnerabilities"
              onClick={(e) => handleProtectedClick(e, '/vulnerabilities')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold cursor-pointer shadow-lg transition-colors"
            >
              Vulnerabilidades
            </a>
            <a 
              href="/scripts"
              onClick={(e) => handleProtectedClick(e, '/scripts')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold cursor-pointer shadow-lg transition-colors"
            >
              Scripts de Prueba
            </a>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Protección Total</h3>
            <p className="text-gray-600">
              Mitigaciones contra todas las vulnerabilidades del OWASP Top 10
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Autenticación JWT</h3>
            <p className="text-gray-600">
              Tokens seguros con bcrypt para hash de passwords
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">Validación Estricta</h3>
            <p className="text-gray-600">
              Rate limiting, sanitización de inputs y validación de uploads
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
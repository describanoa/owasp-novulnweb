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
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          🔒 Aplicación Web Segura
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Proyecto universitario con mitigación completa del OWASP Top 10 (2021).
          Login, registro y perfil con las mejores prácticas de seguridad.
        </p>

        {/* Alerta de autenticación requerida */}
        {showAlert && (
          <div className="mb-8 max-w-2xl mx-auto animate-fade-down animate-duration-1000">
            <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="text-left flex-1">
                  <p className="font-bold text-yellow-300 mb-2 text-lg">
                    ¡Autenticación requerida!
                  </p>
                  <p className="text-gray-200 text-sm">
                    Necesitas{' '}
                    <a href={`/login?redirect=${encodeURIComponent(clickedUrl)}`} className="text-yellow-300 underline font-semibold hover:text-yellow-200 transition-colors">
                      iniciar sesión
                    </a>{' '}
                    o{' '}
                    <a href={`/register?redirect=${encodeURIComponent(clickedUrl)}`} className="text-yellow-300 underline font-semibold hover:text-yellow-200 transition-colors">
                      registrarte
                    </a>{' '}
                    para acceder a este contenido.
                  </p>
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className="text-yellow-300 hover:text-white text-2xl font-bold cursor-pointer transition-colors bg-white/5 hover:bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center items-center flex-wrap">
            <a
              href="/vulnerabilities"
              onClick={(e) => handleProtectedClick(e, '/vulnerabilities')}
              className="bg-white/10 backdrop-blur-md hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 text-white px-8 py-3 rounded-xl text-lg font-semibold cursor-pointer shadow-lg transition-all duration-200"
            >
              Vulnerabilidades
            </a>
            <a 
              href="/scripts"
              onClick={(e) => handleProtectedClick(e, '/scripts')}
              className="bg-white/10 backdrop-blur-md hover:bg-green-500/20 border border-white/20 hover:border-green-500/50 text-white px-8 py-3 rounded-xl text-lg font-semibold cursor-pointer shadow-lg transition-all duration-200"
            >
              Scripts de Prueba
            </a>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2 text-white">Protección Total</h3>
            <p className="text-gray-300">
              Mitigaciones contra todas las vulnerabilidades del OWASP Top 10
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2 text-white">Autenticación JWT</h3>
            <p className="text-gray-300">
              Tokens seguros con bcrypt para hash de passwords
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2 text-white">Validación Estricta</h3>
            <p className="text-gray-300">
              Rate limiting, sanitización de inputs y validación de uploads
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
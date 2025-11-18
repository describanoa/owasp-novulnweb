/**
 * MITIGACIÓN OWASP: Hero Component para página principal
 */

export default function Hero() {
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

        <div className="flex gap-4 justify-center items-center flex-wrap">
          <a 
            href="/vulnerabilities"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold cursor-pointer shadow-lg"
          >
            Vulnerabilidades
          </a>
          <button 
            disabled
            className="bg-gray-300 text-gray-600 px-8 py-3 rounded-lg text-lg font-semibold cursor-not-allowed shadow-lg border-2 border-gray-400"
          >
            Próximamente...
          </button>
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

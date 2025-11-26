/**
 * MITIGACIÓN OWASP: Footer Component
 * - Información estática, sin riesgos de seguridad
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent border-t border-white/10 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🔒 SecureApp</h3>
            <p className="text-gray-300">
              Aplicación web segura con mitigación completa del OWASP Top 10 (2021).
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Seguridad</h4>
            <ul className="text-gray-300 space-y-2">
              <li>✓ Protección contra Injection</li>
              <li>✓ Autenticación segura (JWT + bcrypt)</li>
              <li>✓ Validación de uploads</li>
              <li>✓ Rate limiting</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Tecnologías</h4>
            <ul className="text-gray-300 space-y-2">
              <li>• Astro + React + TypeScript</li>
              <li>• Node.js + Express</li>
              <li>• MongoDB + Mongoose</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-4 text-center text-gray-400">
          <p>© {currentYear} SecureApp - Proyecto Universitario OWASP Top 10</p>
        </div>
      </div>
    </footer>
  );
}
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} SecureApp - Proyecto OWASP Top 10
        </p>
        <p className="text-xs text-gray-400 mt-2">
            Desarrollado para demostrar vulnerabilidades web
        </p>
      </div>
    </footer>
  );
}
import { useEffect, useState, type FormEvent } from 'react';

const API_URL = 'http://localhost:3001';

type UserData = {
  username: string;
  email: string;
  profileImage?: string;
  role: string;
  createdAt: string;
}

export default function ProfileForm() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cargar datos del usuario
  useEffect(() => {
    loadProfile();
  }, []);

  // Limpiar objeto URL al desmontar componente (OWASP A04 - prevenir memory leaks)
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const loadProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      globalThis.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        // Token inválido o expirado
        localStorage.removeItem('token');
        globalThis.location.href = '/login';
        return;
      }

      setUser(data.user);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar el perfil');
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    const formElement = e.currentTarget;
    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setError('Selecciona una imagen');
      setUploading(false);
      return;
    }

    // Validar tipo de archivo
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setError('Solo se permiten imágenes JPG o PNG');
      setUploading(false);
      return;
    }

    // Validar tamaño (1MB)
    if (file.size > 1 * 1024 * 1024) {
      setError('La imagen no puede superar 1MB');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/profile/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Error al subir imagen');
        setUploading(false);
        return;
      }

      setSuccess('Imagen subida exitosamente');
      setUploading(false);

      // Recargar perfil para ver la nueva imagen
      loadProfile();

      // Limpiar preview y input
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      fileInput.value = '';
    } catch (err) {
      setError('Error de conexión con el servidor');
      setUploading(false);
    }
  };

  /**
   * Eliminar imagen de perfil
   * OWASP A01 - Broken Access Control: Solo el propietario puede eliminar su imagen
   */
  const handleDeleteImage = async () => {
    // Confirmación antes de eliminar
    if (!confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/profile/image`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Error al eliminar imagen');
        setUploading(false);
        return;
      }

      setSuccess('Imagen eliminada correctamente');
      setUploading(false);

      // Recargar perfil
      loadProfile();
    } catch (err) {
      setError('Error de conexión con el servidor');
      setUploading(false);
    }
  };

  /**
   * Manejar cambio de archivo y mostrar preview
   * OWASP A03 - Injection: Validar tipo de archivo antes de preview
   * OWASP A08 - Integrity Failures: Solo archivos de imagen válidos
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Limpiar preview anterior
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }

    if (!file) {
      return;
    }

    // OWASP A03 - Validar tipo MIME antes de crear preview
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setError('Solo se permiten imágenes JPG o PNG');
      e.target.value = '';
      return;
    }

    // OWASP A08 - Validar tamaño antes de crear preview
    if (file.size > 1 * 1024 * 1024) {
      setError('La imagen no puede superar 1MB');
      e.target.value = '';
      return;
    }

    // Limpiar errores previos
    setError('');
    
    // OWASP A04 - Usar createObjectURL (seguro, no ejecuta código)
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error al cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-center">
        {user.profileImage ? (
          <img
            src={`${API_URL}${user.profileImage}`}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-blue-500 flex items-center justify-center">
            <span className="text-5xl text-gray-400">👤</span>
          </div>
        )}
      </div>
      {/* Información del usuario */}
      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">
          Información de la cuenta
        </h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-3">
            <label className="text-sm font-medium text-gray-400">Usuario</label>
            <p className="text-lg text-white font-semibold">{user.username}</p>
          </div>
          
          <div className="border-b border-gray-700 pb-3">
            <label className="text-sm font-medium text-gray-400">Email</label>
            <p className="text-lg text-white font-semibold">{user.email}</p>
          </div>
          
          <div className="border-b border-gray-700 pb-3">
            <label className="text-sm font-medium text-gray-400">Rol</label>
            <p className="text-lg text-white font-semibold capitalize">{user.role}</p>
          </div>
          
          <div className="pb-3">
            <label className="text-sm font-medium text-gray-400">Miembro desde</label>
            <p className="text-lg text-white font-semibold">
              {new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Actalizar foto de perfil */}
      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">
          Actualizar foto de perfil
        </h2>

        <form onSubmit={handleImageUpload} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Seleccionar imagen
            </label>
            
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="flex-1 px-3 py-2 bg-white/5 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                disabled={uploading}
              />
              
              {/* Preview de la imagen seleccionada */}
              {imagePreview && (
                <div className="flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border-2 border-gray-600"
                  />
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-400 mt-1">
              JPG o PNG, máximo 1MB
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 cursor-pointer"
          >
            {uploading ? 'Subiendo...' : 'Subir imagen'}
          </button>
        </form>

        {/* Botón para eliminar imagen (solo si existe) */}
        {user.profileImage && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleDeleteImage}
              disabled={uploading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-600 cursor-pointer"
            >
              {uploading ? 'Eliminando...' : '🗑️ Eliminar foto de perfil'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
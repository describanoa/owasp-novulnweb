/**
 * MITIGACIÓN OWASP: Admin Panel Component
 * - A01:2021 – Broken Access Control: Verifica rol de admin
 * - A09:2021 – Security Logging: Muestra logs del sistema
 */

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage: string | null;
  createdAt: string;
  lastLogin: string | null;
};

type Stats = {
  totalUsers: number;
  totalAdmins: number;
  usersWithImage: number;
  recentErrors: number;
};

type Log = {
  level: string;
  message: string;
  timestamp: string;
};

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'logs'>('stats');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      globalThis.location.href = '/login';
      return;
    }

    try {
      // Intentar cargar estadísticas para verificar acceso admin
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        setError('Acceso denegado: Se requiere rol de administrador');
        setLoading(false);
        return;
      }

      if (response.status === 401) {
        localStorage.removeItem('token');
        globalThis.location.href = '/login';
        return;
      }

      if (response.ok) {
        await loadData();
      } else {
        setError('Error al verificar permisos de administrador');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  const loadData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Cargar todo en paralelo
      const [statsRes, usersRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const logsData = await logsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (usersData.success) setUsers(usersData.users);
      if (logsData.success) setLogs(logsData.logs);

      setLoading(false);
    } catch (err) {
      setError('Error al cargar datos del panel');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verificando permisos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          <p className="font-bold">❌ {error}</p>
          <a href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Panel de Administración
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 font-semibold transition cursor-pointer ${
            activeTab === 'stats'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          📊 Estadísticas
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition cursor-pointer ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          👥 Usuarios ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 font-semibold transition cursor-pointer ${
            activeTab === 'logs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          📋 Logs ({logs.length})
        </button>
      </div>

      {/* Contenido según tab activa */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-medium">Total Usuarios</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-medium">Administradores</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalAdmins}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-medium">Con Imagen</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.usersWithImage}</p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
            <p className="text-gray-600 text-sm font-medium">Errores Recientes</p>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.recentErrors}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.profileImage ? (
                          <img
                            src={`${API_URL}${user.profileImage}`}
                            alt={user.username}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <span className="text-gray-600 text-sm">👤</span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('es-ES')
                        : 'Nunca'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded border-l-4 ${
                  log.level === 'error'
                    ? 'bg-red-50 border-red-500'
                    : log.level === 'warn'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span
                      className={`text-xs font-semibold uppercase ${
                        log.level === 'error'
                          ? 'text-red-700'
                          : log.level === 'warn'
                          ? 'text-yellow-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {log.level}
                    </span>
                    <p className="text-sm text-gray-800 mt-1">{log.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {new Date(log.timestamp).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

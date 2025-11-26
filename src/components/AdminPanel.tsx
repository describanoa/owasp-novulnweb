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
      <div className="container mx-auto px-4 py-8 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-gray-300">Verificando permisos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl text-center backdrop-blur-md">
          <p className="font-bold text-lg mb-2">❌ {error}</p>
          <a href="/" className="text-white hover:text-red-200 underline transition-colors inline-block">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">
          Panel de Administración
        </h1>
        <div className="text-sm text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Sistema Operativo
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          📊 Estadísticas
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          👥 Usuarios ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          📋 Logs ({logs.length})
        </button>
      </div>

      {/* Contenido según tab activa */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors group">
            <p className="text-gray-400 text-sm font-medium group-hover:text-blue-300 transition-colors">Total Usuarios</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors group">
            <p className="text-gray-400 text-sm font-medium group-hover:text-purple-300 transition-colors">Administradores</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.totalAdmins}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-green-500/50 transition-colors group">
            <p className="text-gray-400 text-sm font-medium group-hover:text-green-300 transition-colors">Con Imagen</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.usersWithImage}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-red-500/50 transition-colors group">
            <p className="text-gray-400 text-sm font-medium group-hover:text-red-300 transition-colors">Errores Recientes</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.recentErrors}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Registro</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Último Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.profileImage ? (
                          <img
                            src={`${API_URL}${user.profileImage}`}
                            alt={user.username}
                            className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 border-2 border-white/10">
                            <span className="text-gray-400 text-lg">👤</span>
                          </div>
                        )}
                        <span className="font-medium text-white">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
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
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 transition-all hover:bg-white/5 ${
                  log.level === 'error'
                    ? 'bg-red-900/10 border-red-500'
                    : log.level === 'warn'
                    ? 'bg-yellow-900/10 border-yellow-500'
                    : 'bg-blue-900/10 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                          log.level === 'error'
                            ? 'bg-red-500/20 text-red-300'
                            : log.level === 'warn'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 font-mono">{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

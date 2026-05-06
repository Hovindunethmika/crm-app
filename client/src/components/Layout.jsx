import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '▪' },
  { to: '/leads', label: 'Leads', icon: '▪' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 flex flex-col flex-shrink-0" style={{ background: '#0f172a' }}>
        {/* Logo */}
        <div className="px-5 py-6">
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', color: '#f59e0b', fontWeight: 800, letterSpacing: '2px' }}>
            PULSE
          </span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', color: '#475569', fontWeight: 700 }}>
            CRM
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-slate-900'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: '#f59e0b', color: '#0f172a' } : {}
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid #1e293b' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#f59e0b', color: '#0f172a' }}
            >
              {getInitials(user?.name)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-slate-500 hover:text-red-400 transition-colors text-left py-1"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
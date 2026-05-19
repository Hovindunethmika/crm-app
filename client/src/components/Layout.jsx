import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', path: '/leads', icon: Users },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#09090b' }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '72px' : '240px',
        minWidth: collapsed ? '72px' : '240px',
        height: '100vh',
        backgroundColor: '#09090b',
        borderRight: '1px solid rgba(39,39,42,0.8)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 30,
      }}>

        {/* Logo */}
        <div style={{
          height: '64px', display: 'flex', alignItems: 'center',
          padding: '0 16px', borderBottom: '1px solid rgba(39,39,42,0.8)',
          gap: '12px', overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}>
            <Zap size={16} color="white" />
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px', whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff', letterSpacing: '-0.3px' }}>Pulse</span>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#52525b', letterSpacing: '-0.3px' }}>CRM</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} title={collapsed ? item.label : undefined} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '14px', fontWeight: 500, transition: 'all 0.15s',
                backgroundColor: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                color: isActive ? '#a78bfa' : '#71717a',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = '#18181b'; e.currentTarget.style.color = '#e4e4e7'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#71717a'; }}}
              >
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '20px', backgroundColor: '#8b5cf6', borderRadius: '0 4px 4px 0',
                  }} />
                )}
                <item.icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(39,39,42,0.8)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
            borderRadius: '8px', fontSize: '14px', fontWeight: 500, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#18181b'; e.currentTarget.style.color = '#a1a1aa'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#52525b'; }}
          >
            {collapsed ? <ChevronRight size={18} style={{ flexShrink: 0 }} /> : <ChevronLeft size={18} style={{ flexShrink: 0 }} />}
            {!collapsed && <span>Collapse</span>}
          </button>

          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
            borderRadius: '8px', fontSize: '14px', fontWeight: 500, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#52525b'; }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* User */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 600, color: '#a78bfa',
            }}>{initials}</div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#d4d4d8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                <p style={{ fontSize: '11px', color: '#3f3f46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1, height: '100vh', overflowY: 'auto',
        backgroundColor: '#09090b', minWidth: 0,
      }}>
        {children}
      </main>
    </div>
  );
}
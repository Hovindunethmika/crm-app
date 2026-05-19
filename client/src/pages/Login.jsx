import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#e4e4e7',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Outfit, sans-serif',
      padding: '24px',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', justifyContent: 'center' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
          }}>
            <Zap size={18} color="white" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
            <span style={{ fontWeight: 700, fontSize: '20px', color: '#ffffff', letterSpacing: '-0.3px' }}>Pulse</span>
            <span style={{ fontWeight: 700, fontSize: '20px', color: '#3f3f46', letterSpacing: '-0.3px' }}>CRM</span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#111113',
          border: '1px solid #1c1c1e',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '13px', color: '#52525b', margin: 0 }}>
              Sign in to your PulseCRM account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#f87171',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#71717a', marginBottom: '8px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#27272a'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#71717a', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#27272a'}
              />
            </div>

            {/* Hint */}
            <div style={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '12px', color: '#3f3f46' }}>Test credentials</span>
              <span style={{ fontSize: '12px', color: '#52525b', fontFamily: 'monospace' }}>
                admin@example.com / password123
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: loading ? '#5b21b6' : '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit, sans-serif',
                transition: 'background-color 0.15s',
                boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                marginTop: '4px',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#6d28d9'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#7c3aed'; }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#27272a', marginTop: '24px' }}>
          PulseCRM — Sales Lead Management
        </p>
      </div>
    </div>
  );
}
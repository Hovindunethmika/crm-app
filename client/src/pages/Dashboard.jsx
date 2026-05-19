import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Target, DollarSign, ArrowRight } from 'lucide-react';
import api from '../lib/api';

const fmt = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

const STATUS_COLORS = {
  New: { bg: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: 'rgba(14,165,233,0.2)' },
  Contacted: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
  Qualified: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'Proposal Sent': { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  Won: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  Lost: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
};

const card = {
  backgroundColor: '#111113',
  border: '1px solid #1c1c1e',
  borderRadius: '12px',
  padding: '20px',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/leads')])
      .then(([s, l]) => {
        setStats(s.data);
        setRecentLeads(l.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '24px', height: '24px', border: '2px solid #7c3aed',
        borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: '#38bdf8', bg: 'rgba(14,165,233,0.1)' },
    { label: 'Qualified', value: stats.qualifiedLeads, icon: Target, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Won Deals', value: stats.wonLeads, icon: TrendingUp, color: '#4ade80', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Won Revenue', value: fmt(stats.wonDealValue), icon: DollarSign, color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
  ];

  const pipeline = [
    { label: 'New', count: stats.newLeads, color: '#0ea5e9' },
    { label: 'Qualified', count: stats.qualifiedLeads, color: '#8b5cf6' },
    { label: 'Won', count: stats.wonLeads, color: '#22c55e' },
    { label: 'Lost', count: stats.lostLeads, color: '#ef4444' },
  ];

  return (
    <div style={{ padding: '36px 40px', backgroundColor: '#09090b', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.4px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#52525b', margin: '6px 0 0' }}>
          Your sales pipeline at a glance
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {statCards.map((c) => (
          <div key={c.label} style={{
            ...card,
            transition: 'border-color 0.15s',
            cursor: 'default',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#27272a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1c1c1e'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {c.label}
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={16} color={c.color} />
              </div>
            </div>
            <p style={{ fontSize: '30px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline Breakdown */}
      <div style={{ ...card, marginBottom: '20px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Pipeline Breakdown
        </h2>
        {/* Bar */}
        <div style={{ display: 'flex', height: '6px', borderRadius: '99px', overflow: 'hidden', backgroundColor: '#1c1c1e', gap: '2px', marginBottom: '14px' }}>
          {stats.totalLeads > 0 && pipeline.map((p) => (
            p.count > 0 && (
              <div key={p.label} style={{
                width: `${(p.count / stats.totalLeads) * 100}%`,
                backgroundColor: p.color,
                borderRadius: '99px',
                transition: 'width 0.5s ease',
              }} />
            )
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {pipeline.map((p) => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#71717a' }}>{p.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#d4d4d8' }}>{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid #1c1c1e',
        }}>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Leads
          </h2>
          <Link to="/leads" style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', color: '#8b5cf6', textDecoration: 'none', fontWeight: 500,
          }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p style={{ padding: '40px', textAlign: 'center', color: '#3f3f46', fontSize: '14px', margin: 0 }}>
            No leads yet — create your first one.
          </p>
        ) : (
          recentLeads.map((lead, i) => {
            const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.New;
            return (
              <Link key={lead.id} to={`/leads/${lead.id}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px', textDecoration: 'none',
                borderBottom: i < recentLeads.length - 1 ? '1px solid #18181b' : 'none',
                transition: 'background-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    backgroundColor: '#18181b', border: '1px solid #27272a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700, color: '#71717a',
                  }}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#e4e4e7', margin: 0 }}>{lead.name}</p>
                    <p style={{ fontSize: '12px', color: '#52525b', margin: '2px 0 0' }}>{lead.company}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                    borderRadius: '99px', border: `1px solid ${sc.border}`,
                    backgroundColor: sc.bg, color: sc.color,
                  }}>
                    {lead.status}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#a1a1aa', minWidth: '60px', textAlign: 'right' }}>
                    {fmt(lead.dealValue)}
                  </span>
                  <ArrowRight size={14} color="#3f3f46" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
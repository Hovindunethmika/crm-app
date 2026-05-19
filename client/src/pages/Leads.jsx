import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import api from '../lib/api';
import LeadModal from '../components/LeadModal';

const STATUS_COLORS = {
  New: { bg: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: 'rgba(14,165,233,0.2)' },
  Contacted: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
  Qualified: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'Proposal Sent': { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  Won: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  Lost: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
};

const STATUSES = ['', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['', 'Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

const fmt = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

const inputStyle = {
  backgroundColor: '#111113',
  border: '1px solid #1c1c1e',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '13px',
  color: '#d4d4d8',
  outline: 'none',
  fontFamily: 'Outfit, sans-serif',
  transition: 'border-color 0.15s',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [filters, setFilters] = useState({ status: '', source: '', salesperson: '', search: '' });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await api.get('/leads', { params });
      setLeads(res.data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    setDeleting(id);
    await api.delete(`/leads/${id}`);
    fetchLeads();
    setDeleting(null);
  };

  const openEdit = (lead) => { setEditLead(lead); setModalOpen(true); };
  const openCreate = () => { setEditLead(null); setModalOpen(true); };
  const set = (key) => (e) => setFilters(f => ({ ...f, [key]: e.target.value }));

  return (
    <div style={{ padding: '36px 40px', backgroundColor: '#09090b', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.4px' }}>Leads</h1>
          <p style={{ fontSize: '14px', color: '#52525b', margin: '6px 0 0' }}>
            {leads.length} lead{leads.length !== 1 ? 's' : ''} in your pipeline
          </p>
        </div>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 18px', backgroundColor: '#7c3aed',
          color: '#ffffff', border: 'none', borderRadius: '8px',
          fontSize: '14px', fontWeight: 500, cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif', transition: 'background-color 0.15s',
          boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6d28d9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7c3aed'}
        >
          <Plus size={16} /> New Lead
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#3f3f46" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search name, company, email..."
            value={filters.search}
            onChange={set('search')}
            style={{ ...inputStyle, paddingLeft: '32px', width: '240px' }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = '#1c1c1e'}
          />
        </div>
        <select value={filters.status} onChange={set('status')} style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#7c3aed'}
          onBlur={e => e.target.style.borderColor = '#1c1c1e'}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select value={filters.source} onChange={set('source')} style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#7c3aed'}
          onBlur={e => e.target.style.borderColor = '#1c1c1e'}
        >
          {SOURCES.map(s => <option key={s} value={s}>{s || 'All Sources'}</option>)}
        </select>
        <input
          type="text"
          placeholder="Filter salesperson..."
          value={filters.salesperson}
          onChange={set('salesperson')}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#7c3aed'}
          onBlur={e => e.target.style.borderColor = '#1c1c1e'}
        />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#111113', border: '1px solid #1c1c1e', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1c1c1e' }}>
              {['Lead', 'Status', 'Source', 'Salesperson', 'Deal Value', ''].map((h, i) => (
                <th key={i} style={{
                  padding: '12px 20px', textAlign: 'left',
                  fontSize: '11px', fontWeight: 600, color: '#52525b',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{
                    width: '20px', height: '20px', border: '2px solid #7c3aed',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', margin: '0 auto',
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '14px' }}>
                  No leads found. Adjust filters or create a new lead.
                </td>
              </tr>
            ) : leads.map((lead) => {
              const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.New;
              const isHovered = hoveredRow === lead.id;
              return (
                <tr key={lead.id}
                  onMouseEnter={() => setHoveredRow(lead.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid #18181b',
                    backgroundColor: isHovered ? 'rgba(255,255,255,0.02)' : 'transparent',
                    transition: 'background-color 0.1s',
                  }}
                >
                  {/* Lead */}
                  <td style={{ padding: '14px 20px' }}>
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
                  </td>
                  {/* Status */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                      borderRadius: '99px', border: `1px solid ${sc.border}`,
                      backgroundColor: sc.bg, color: sc.color, whiteSpace: 'nowrap',
                    }}>{lead.status}</span>
                  </td>
                  {/* Source */}
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#71717a' }}>{lead.source}</td>
                  {/* Salesperson */}
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#71717a' }}>{lead.salesperson || '—'}</td>
                  {/* Deal Value */}
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: '#d4d4d8' }}>
                    {fmt(lead.dealValue)}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end',
                      opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s',
                    }}>
                      <Link to={`/leads/${lead.id}`} title="View" style={{
                        padding: '6px', borderRadius: '6px', display: 'flex',
                        color: '#52525b', textDecoration: 'none', transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#27272a'; e.currentTarget.style.color = '#e4e4e7'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#52525b'; }}
                      >
                        <Eye size={15} />
                      </Link>
                      <button onClick={() => openEdit(lead)} title="Edit" style={{
                        padding: '6px', borderRadius: '6px', display: 'flex',
                        color: '#52525b', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#27272a'; e.currentTarget.style.color = '#e4e4e7'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#52525b'; }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(lead.id)} disabled={deleting === lead.id} title="Delete" style={{
                        padding: '6px', borderRadius: '6px', display: 'flex',
                        color: '#52525b', background: 'none', border: 'none',
                        cursor: deleting === lead.id ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#52525b'; }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lead={editLead}
        onSave={() => { setModalOpen(false); fetchLeads(); }}
      />
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Send, MessageSquare } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import LeadModal from '../components/LeadModal';

const STATUS_COLORS = {
  New: { bg: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: 'rgba(14,165,233,0.2)' },
  Contacted: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
  Qualified: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  'Proposal Sent': { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  Won: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  Lost: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
};

const fmt = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const card = {
  backgroundColor: '#111113',
  border: '1px solid #1c1c1e',
  borderRadius: '12px',
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await api.post(`/leads/${id}/notes`, { content: noteText });
    setNoteText('');
    await fetchLead();
    setAddingNote(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this lead permanently?')) return;
    await api.delete(`/leads/${id}`);
    navigate('/leads');
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!lead) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', color: '#3f3f46' }}>
      Lead not found
    </div>
  );

  const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.New;

  const infoItems = [
    { label: 'Email', value: lead.email },
    { label: 'Phone', value: lead.phone },
    { label: 'Lead Source', value: lead.source },
    { label: 'Salesperson', value: lead.salesperson },
    { label: 'Deal Value', value: fmt(lead.dealValue) },
    { label: 'Created', value: fmtDate(lead.createdAt) },
    { label: 'Last Updated', value: fmtDate(lead.updatedAt) },
  ];

  return (
    <div style={{ padding: '36px 40px', backgroundColor: '#09090b', minHeight: '100vh', maxWidth: '900px' }}>

      {/* Back */}
      <Link to="/leads" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '13px', color: '#52525b', textDecoration: 'none',
        marginBottom: '24px', transition: 'color 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
        onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
      >
        <ArrowLeft size={14} /> Back to Leads
      </Link>

      {/* Lead Card */}
      <div style={{ ...card, padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
              backgroundColor: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: 700, color: '#a78bfa',
            }}>
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.3px' }}>
                {lead.name}
              </h1>
              <p style={{ fontSize: '14px', color: '#52525b', margin: '4px 0 10px' }}>{lead.company}</p>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '99px', border: `1px solid ${sc.border}`,
                backgroundColor: sc.bg, color: sc.color,
              }}>{lead.status}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setEditOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', backgroundColor: '#18181b', border: '1px solid #27272a',
              borderRadius: '8px', color: '#a1a1aa', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#27272a'; e.currentTarget.style.color = '#e4e4e7'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#18181b'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <Edit2 size={14} /> Edit
            </button>
            <button onClick={handleDelete} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', backgroundColor: 'transparent', border: '1px solid transparent',
              borderRadius: '8px', color: '#52525b', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#52525b'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
          marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #1c1c1e',
        }}>
          {infoItems.map((item) => (
            <div key={item.label}>
              <p style={{ fontSize: '11px', color: '#3f3f46', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {item.label}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#a1a1aa', margin: 0 }}>{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '16px 24px', borderBottom: '1px solid #1c1c1e',
        }}>
          <MessageSquare size={15} color="#52525b" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Activity Notes
          </h2>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#3f3f46' }}>
            {lead.notes?.length || 0} notes
          </span>
        </div>

        {/* Add Note */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #18181b' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 600, color: '#a78bfa', marginTop: '2px',
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Log a call, email, meeting update..."
                onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleAddNote(); }}
                style={{
                  width: '100%', backgroundColor: '#18181b', border: '1px solid #27272a',
                  borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
                  color: '#e4e4e7', fontFamily: 'Outfit, sans-serif',
                  resize: 'none', outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#27272a'}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: '#3f3f46' }}>⌘ + Enter to submit</span>
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteText.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 14px', backgroundColor: '#7c3aed',
                    color: '#fff', border: 'none', borderRadius: '7px',
                    fontSize: '12px', fontWeight: 500, cursor: addingNote || !noteText.trim() ? 'not-allowed' : 'pointer',
                    opacity: addingNote || !noteText.trim() ? 0.4 : 1,
                    fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s',
                  }}
                >
                  <Send size={12} />
                  {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes List */}
        {!lead.notes?.length ? (
          <p style={{ padding: '40px', textAlign: 'center', color: '#3f3f46', fontSize: '14px', margin: 0 }}>
            No notes yet. Log your first interaction.
          </p>
        ) : (
          lead.notes.map((note, i) => (
            <div key={note.id} style={{
              display: 'flex', gap: '12px', padding: '16px 24px',
              borderBottom: i < lead.notes.length - 1 ? '1px solid #18181b' : 'none',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: '#18181b', border: '1px solid #27272a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: '#71717a', marginTop: '2px',
              }}>
                {note.createdBy?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#71717a' }}>{note.createdBy?.name}</span>
                  <span style={{ fontSize: '11px', color: '#3f3f46' }}>{fmtDate(note.createdAt)}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0, lineHeight: 1.6 }}>{note.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <LeadModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        lead={lead}
        onSave={() => { setEditOpen(false); fetchLead(); }}
      />
    </div>
  );
}
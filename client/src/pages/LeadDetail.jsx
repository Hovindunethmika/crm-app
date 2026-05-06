import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Send, MessageSquare } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import LeadModal from '../components/LeadModal';
import { cn } from '../lib/utils';

const STATUS_COLORS = {
  New: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Qualified: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Proposal Sent': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Won: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Lost: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const fmt = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
    <div className="flex-1 h-full flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!lead) return (
    <div className="flex-1 h-full flex items-center justify-center text-zinc-600">Lead not found</div>
  );

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
    <div className="p-8 max-w-4xl">
      <Link to="/leads" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      {/* Lead Card */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6 mb-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl font-bold text-violet-400">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{lead.name}</h1>
              <p className="text-zinc-500 text-sm mt-0.5">{lead.company}</p>
              <span className={cn('mt-2 inline-block text-xs px-2.5 py-1 rounded-full border font-medium', STATUS_COLORS[lead.status])}>
                {lead.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 text-sm rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/60">
          {infoItems.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-zinc-600 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-zinc-300">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-800/60">
          <MessageSquare className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-300">Activity Notes</h2>
          <span className="ml-auto text-xs text-zinc-600">{lead.notes?.length || 0} notes</span>
        </div>

        {/* Add Note */}
        <div className="px-6 py-4 border-b border-zinc-800/40">
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400 flex-shrink-0 mt-1">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Log a call, email, meeting update..."
                className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors resize-none"
                onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleAddNote(); }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-zinc-700">⌘ + Enter to submit</span>
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteText.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Send className="w-3 h-3" />
                  {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="divide-y divide-zinc-800/40">
          {!lead.notes?.length ? (
            <p className="px-6 py-8 text-center text-zinc-600 text-sm">No notes yet. Log your first interaction.</p>
          ) : (
            lead.notes.map((note) => (
              <div key={note.id} className="flex gap-3 px-6 py-4">
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0 mt-0.5">
                  {note.createdBy?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-zinc-400">{note.createdBy?.name}</span>
                    <span className="text-xs text-zinc-700">{fmtDate(note.createdAt)}</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{note.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
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
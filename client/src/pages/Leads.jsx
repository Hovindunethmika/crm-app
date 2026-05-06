import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import api from '../lib/api';
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

const STATUSES = ['', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['', 'Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

const fmt = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

const selectClass =
  'bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500/50 transition-colors';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleting, setDeleting] = useState(null);
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-zinc-500 text-sm mt-1">{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" /> New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Search name, company, email..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-violet-500/50 transition-colors placeholder-zinc-600"
          />
        </div>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className={selectClass}>
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select value={filters.source} onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))} className={selectClass}>
          {SOURCES.map((s) => <option key={s} value={s}>{s || 'All Sources'}</option>)}
        </select>
        <input
          type="text"
          placeholder="Filter salesperson..."
          value={filters.salesperson}
          onChange={(e) => setFilters((f) => ({ ...f, salesperson: e.target.value }))}
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500/50 transition-colors placeholder-zinc-600"
        />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800/60">
              {['Lead', 'Status', 'Source', 'Salesperson', 'Deal Value', ''].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center">
                  <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-zinc-600 text-sm">
                  No leads found. Adjust filters or create a new lead.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{lead.name}</p>
                        <p className="text-xs text-zinc-600">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', STATUS_COLORS[lead.status])}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-500">{lead.source}</td>
                  <td className="px-5 py-4 text-sm text-zinc-500">{lead.salesperson || '—'}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-zinc-200">{fmt(lead.dealValue)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="p-1.5 rounded-md hover:bg-zinc-700 text-zinc-600 hover:text-zinc-200 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEdit(lead)}
                        className="p-1.5 rounded-md hover:bg-zinc-700 text-zinc-600 hover:text-zinc-200 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleting === lead.id}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
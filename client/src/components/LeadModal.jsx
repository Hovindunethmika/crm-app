import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../lib/api';
import { cn } from '../lib/utils';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

const defaultForm = {
  name: '', company: '', email: '', phone: '',
  source: 'Website', salesperson: '', status: 'New', dealValue: '',
};

const inputClass =
  'w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors';

export default function LeadModal({ open, onClose, lead, onSave }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(lead ? { ...lead, dealValue: String(lead.dealValue) } : defaultForm);
      setErrors({});
    }
  }, [open, lead]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.company.trim()) e.company = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      lead ? await api.put(`/leads/${lead.id}`, form) : await api.post('/leads', form);
      onSave();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-white">{lead ? 'Edit Lead' : 'New Lead'}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {lead ? 'Update lead information' : 'Add a new lead to your pipeline'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name *</label>
              <input className={cn(inputClass, errors.name && 'border-red-500/50')} placeholder="John Smith" value={form.name} onChange={set('name')} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Company *</label>
              <input className={cn(inputClass, errors.company && 'border-red-500/50')} placeholder="Acme Corp" value={form.company} onChange={set('company')} />
              {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email *</label>
              <input type="email" className={cn(inputClass, errors.email && 'border-red-500/50')} placeholder="john@acme.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone</label>
              <input className={inputClass} placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Lead Source</label>
              <select className={inputClass} value={form.source} onChange={set('source')}>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Status</label>
              <select className={inputClass} value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Salesperson</label>
              <input className={inputClass} placeholder="Your name" value={form.salesperson} onChange={set('salesperson')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Deal Value ($)</label>
              <input type="number" className={inputClass} placeholder="5000" value={form.dealValue} onChange={set('dealValue')} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-violet-500/20"
          >
            {loading ? 'Saving...' : lead ? 'Save Changes' : 'Create Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
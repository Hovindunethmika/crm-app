import { useLayoutEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import api from '../lib/api';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

const defaultForm = {
  name: '', company: '', email: '', phone: '',
  source: 'Website', salesperson: '', status: 'New', dealValue: '',
};

const inp = (extra = {}) => ({
  width: '100%',
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '14px',
  color: '#e4e4e7',
  outline: 'none',
  fontFamily: 'Outfit, sans-serif',
  transition: 'border-color 0.15s',
  ...extra,
});

export default function LeadModal({ open, onClose, lead, onSave }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const prevOpenRef = useRef(open);

  useLayoutEffect(() => {
    if (open && !prevOpenRef.current) {
      // Modal just opened
      const initial = lead
        ? { ...lead, dealValue: String(lead.dealValue) }
        : defaultForm;
      setForm(initial);
      setErrors({});
    }
    prevOpenRef.current = open;
  }, [open, lead]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

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

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'relative', backgroundColor: '#111113',
        border: '1px solid #27272a', borderRadius: '16px',
        width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
        fontFamily: 'Outfit, sans-serif',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #1c1c1e',
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>
              {lead ? 'Edit Lead' : 'New Lead'}
            </h2>
            <p style={{ fontSize: '12px', color: '#52525b', margin: '4px 0 0' }}>
              {lead ? 'Update lead information' : 'Add a new lead to your pipeline'}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#52525b', padding: '6px', borderRadius: '6px', display: 'flex',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#e4e4e7'}
            onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            [{ key: 'name', label: 'Full Name *', placeholder: 'John Smith' },
             { key: 'company', label: 'Company *', placeholder: 'Acme Corp' }],
            [{ key: 'email', label: 'Email *', placeholder: 'john@acme.com', type: 'email' },
             { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8900' }],
            [{ key: 'salesperson', label: 'Salesperson', placeholder: 'Your name' },
             { key: 'dealValue', label: 'Deal Value ($)', placeholder: '5000', type: 'number' }],
          ].map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {row.map(({ key, label, placeholder, type = 'text' }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#71717a', marginBottom: '6px' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={set(key)}
                    style={inp(errors[key] ? { borderColor: '#ef4444' } : {})}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = errors[key] ? '#ef4444' : '#27272a'}
                  />
                  {errors[key] && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{errors[key]}</p>}
                </div>
              ))}
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { key: 'source', label: 'Lead Source', options: SOURCES },
              { key: 'status', label: 'Status', options: STATUSES },
            ].map(({ key, label, options }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#71717a', marginBottom: '6px' }}>
                  {label}
                </label>
                <select value={form[key]} onChange={set(key)} style={inp({ cursor: 'pointer' })}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#27272a'}
                >
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px',
          padding: '16px 24px', borderTop: '1px solid #1c1c1e',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', fontSize: '14px', fontWeight: 500,
            color: '#71717a', background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: '8px', fontFamily: 'Outfit, sans-serif', transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#e4e4e7'}
            onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
          >
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '8px 20px', fontSize: '14px', fontWeight: 500,
            color: '#ffffff', backgroundColor: loading ? '#5b21b6' : '#7c3aed',
            border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif', transition: 'background-color 0.15s',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#6d28d9'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#7c3aed'; }}
          >
            {loading ? 'Saving...' : lead ? 'Save Changes' : 'Create Lead'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
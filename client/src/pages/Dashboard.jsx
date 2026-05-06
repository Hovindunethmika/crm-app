import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Target, DollarSign, ArrowRight } from 'lucide-react';
import api from '../lib/api';
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
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  }).format(val);

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

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Qualified', value: stats.qualifiedLeads, icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Won Deals', value: stats.wonLeads, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Won Revenue', value: fmt(stats.wonDealValue), icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const pipeline = [
    { label: 'New', count: stats.newLeads, color: 'bg-sky-500' },
    { label: 'Qualified', count: stats.qualifiedLeads, color: 'bg-violet-500' },
    { label: 'Won', count: stats.wonLeads, color: 'bg-emerald-500' },
    { label: 'Lost', count: stats.lostLeads, color: 'bg-red-500' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Your sales pipeline at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{card.label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.bg)}>
                <card.icon className={cn('w-4 h-4', card.color)} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline bar */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-4">Pipeline Breakdown</h2>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-3 bg-zinc-800">
          {stats.totalLeads > 0 && pipeline.map((p) => (
            <div
              key={p.label}
              className={cn('transition-all', p.color)}
              style={{ width: `${(p.count / stats.totalLeads) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex gap-6">
          {pipeline.map((p) => (
            <div key={p.label} className="flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', p.color)} />
              <span className="text-xs text-zinc-500">{p.label}</span>
              <span className="text-xs font-semibold text-zinc-300">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <h2 className="text-sm font-semibold text-zinc-300">Recent Leads</h2>
          <Link to="/leads" className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-zinc-800/40">
          {recentLeads.length === 0 ? (
            <p className="px-6 py-8 text-center text-zinc-600 text-sm">No leads yet — create your first one.</p>
          ) : (
            recentLeads.map((lead) => (
              <Link
                key={lead.id}
                to={`/leads/${lead.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-800/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{lead.name}</p>
                    <p className="text-xs text-zinc-600">{lead.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', STATUS_COLORS[lead.status])}>
                    {lead.status}
                  </span>
                  <span className="text-sm font-medium text-zinc-400">{fmt(lead.dealValue)}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
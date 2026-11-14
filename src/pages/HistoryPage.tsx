import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Activity, 
  FileText, 
  Search,
  PlusCircle
} from 'lucide-react';
import { api } from '../services/api';
import type { SessionHistoryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await api.listSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this decision session?')) {
      return;
    }
    try {
      setDeletingId(id);
      await api.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.diagnosis_id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const statusToCheck = s.debate_status || s.status;
    const matchesFilter = filter === 'all' || statusToCheck === filter;
    const matchesSearch = 
      s.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.diagnosis_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-[11px] font-bold text-olive-primary tracking-widest uppercase bg-[#F0ECE1] px-2.5 py-0.5 rounded-full border border-border-warm">
              Audit Ledger
            </span>
          </div>
          <h1 className="font-serif-heading text-[36px] font-light text-text-primary leading-tight">
            Decision Session History
          </h1>
          <p className="font-sans text-[15px] text-text-secondary">
            Inspect, resume, or audit all past diagnosis and multi-agent debate sessions.
          </p>
        </div>

        <Link
          to="/app/new"
          className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm font-sans text-[14px] font-semibold px-5 py-2.5 rounded-[10px] hover:bg-olive-dark transition-colors shadow-sm self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          New Diagnosis
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-warm border border-border-warm rounded-[14px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company or session..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-border-warm rounded-[8px] pl-10 pr-4 py-2 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto font-sans text-[13px]">
          {['all', 'completed', 'in_progress', 'confirmed', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-[8px] font-medium capitalize transition-colors ${
                filter === st
                  ? 'bg-olive-primary text-surface-warm'
                  : 'bg-[#FAF8F3] text-text-secondary hover:text-text-primary border border-border-warm'
              }`}
            >
              {st === 'in_progress' ? 'Debating' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-text-muted font-sans text-[14px]">
            <div className="w-6 h-6 border-2 border-olive-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading persisted sessions...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-text-secondary font-sans">
            <History className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <h4 className="font-serif-heading text-[20px] text-text-primary mb-1">No sessions match your filter</h4>
            <p className="text-[14px] text-text-muted">Try clearing the search query or start a new diagnosis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-warm bg-[#FAF8F3] text-[12px] font-sans font-semibold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-6">Company / Session</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Last Updated</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm text-[14px] font-sans">
                {filteredSessions.map((s) => {
                  const statusDisplay = s.debate_status || s.status;
                  return (
                    <tr key={s.diagnosis_id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-text-primary">{s.company_name}</div>
                        <div className="text-[12px] text-text-muted">{s.title} &bull; <span className="font-mono">{s.diagnosis_id.slice(0, 8)}</span></div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                          statusDisplay === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : statusDisplay === 'in_progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          {statusDisplay === 'completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : statusDisplay === 'in_progress' ? (
                            <Activity className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                          )}
                          {statusDisplay}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-text-muted text-[13px]">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-3">
                          {s.debate_status === 'completed' && s.latest_debate_id ? (
                            <Link
                              to={`/app/reports/${s.latest_debate_id}`}
                              className="font-semibold text-olive-primary hover:text-olive-dark inline-flex items-center gap-1 text-[13px]"
                            >
                              <FileText className="w-3.5 h-3.5" /> Report
                            </Link>
                          ) : s.latest_debate_id ? (
                            <Link
                              to={`/app/session/${s.latest_debate_id}`}
                              className="font-semibold text-olive-primary hover:text-olive-dark inline-flex items-center gap-1 text-[13px]"
                            >
                              <Activity className="w-3.5 h-3.5" /> Debate
                            </Link>
                          ) : (
                            <Link
                              to={`/app/diagnosis/${s.diagnosis_id}`}
                              className="font-semibold text-text-secondary hover:text-text-primary text-[13px]"
                            >
                              Intake
                            </Link>
                          )}

                          <button
                            onClick={() => handleDelete(s.diagnosis_id)}
                            disabled={deletingId === s.diagnosis_id}
                            className="text-text-muted hover:text-red-600 transition-colors p-1"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

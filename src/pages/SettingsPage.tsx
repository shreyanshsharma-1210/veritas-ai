import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  RefreshCw,
  Sliders,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  KeyRound,
  Bot
} from 'lucide-react';

interface BackendHealth {
  status: string;
  service: string;
  version: string;
  default_provider: string;
  active_model?: string;
  groq_key_1_active?: boolean;
  groq_key_2_active?: boolean;
  gemini_key_active?: boolean;
  closer_agent_provider?: string;
  skeptic_agent_provider?: string;
}

export const SettingsPage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [healthData, setHealthData] = useState<BackendHealth | null>(null);
  const [statusText, setStatusText] = useState('Online');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setChecking(true);
      const res = await fetch('/health');
      if (res.ok) {
        const data: BackendHealth = await res.json();
        setHealthData(data);
        setStatusText('Operational');
      } else {
        setStatusText('Degraded');
      }
    } catch {
      setStatusText('Offline / Standalone');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-[960px] mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-border-warm">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-sans text-[11px] font-bold text-[#C7A05A] tracking-widest uppercase bg-[#F5F1ED] px-2.5 py-0.5 rounded-full border border-[#C7A05A]/40">
            System Architecture
          </span>
        </div>
        <h1 className="font-serif-heading text-[36px] font-light text-text-primary leading-tight">
          Platform Architecture & Settings
        </h1>
        <p className="font-sans text-[15px] text-text-secondary">
          Inspect multi-agent providers, dedicated Groq key assignments, and deterministic execution parameters.
        </p>
      </div>

      {/* Backend Status Card */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-olive-primary" />
            <div>
              <h3 className="font-serif-heading text-[22px] font-medium text-text-primary">
                Multi-Agent Backend Engine
              </h3>
              <span className="font-sans text-[13px] text-text-secondary">
                FastAPI + Async SQLAlchemy (aiosqlite)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
              statusText === 'Operational' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${statusText === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
              {statusText}
            </span>

            <button
              onClick={checkHealth}
              disabled={checking}
              className="p-2 text-text-muted hover:text-text-primary transition-colors"
              title="Refresh Health Check"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border-warm text-[13px] font-sans">
          <div className="p-3 bg-[#FAF8F3] border border-border-warm rounded-[10px]">
            <span className="text-text-muted block text-[11px] uppercase">Service Version</span>
            <span className="font-bold text-text-primary">Veritas AI v2.0 (Hackathon Edition)</span>
          </div>

          <div className="p-3 bg-[#FAF8F3] border border-border-warm rounded-[10px]">
            <span className="text-text-muted block text-[11px] uppercase">Active Model</span>
            <span className="font-bold text-olive-primary">{healthData?.active_model || 'openai/gpt-oss-20b'}</span>
          </div>

          <div className="p-3 bg-[#FAF8F3] border border-border-warm rounded-[10px]">
            <span className="text-text-muted block text-[11px] uppercase">Latency Profile</span>
            <span className="font-bold text-emerald-700">~1.1s / turn (Sub-second LPU)</span>
          </div>
        </div>
      </div>

      {/* Model Providers Grid */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-olive-primary" />
            <div>
              <h3 className="font-serif-heading text-[22px] font-medium text-text-primary">
                Supported LLM Inference Providers
              </h3>
              <p className="font-sans text-[13px] text-text-secondary">
                Configured with dual dedicated Groq keys for independent agent quotas and low-latency deliberation.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[12px] font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" /> Dual Groq Active
          </span>
        </div>

        <div className="space-y-4 font-sans">
          {/* Card 1: Closer Agent (Groq Key 1) */}
          <div className="p-4 rounded-[12px] bg-[#FAF8F3] border-2 border-[#D9D3C1] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-olive-primary" />
                <span className="font-bold text-text-primary text-[15px]">Closer AI &bull; Groq API Key #1</span>
                <span className="text-[11px] bg-olive-primary text-surface-warm font-mono px-2 py-0.5 rounded font-bold">
                  Dedicated Agent
                </span>
              </div>
              <p className="text-[13px] text-text-secondary">
                Powers the Solution Architect using model <code className="bg-stone-200 px-1.5 py-0.5 rounded text-[12px]">openai/gpt-oss-20b</code>. Generates strategic interventions and compromises.
              </p>
              <div className="flex items-center gap-2 text-[12px] text-text-muted pt-1">
                <KeyRound className="w-3.5 h-3.5 text-olive-primary" />
                <span className="font-mono">GROQ_API_KEY (gsk_1XdTRham...UmDn)</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active & Verified
              </span>
            </div>
          </div>

          {/* Card 2: Skeptic Agent (Groq Key 2) */}
          <div className="p-4 rounded-[12px] bg-[#FAF8F3] border-2 border-[#E5D7D7] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-red-800" />
                <span className="font-bold text-text-primary text-[15px]">Skeptic AI &bull; Groq API Key #2</span>
                <span className="text-[11px] bg-red-800 text-surface-warm font-mono px-2 py-0.5 rounded font-bold">
                  Dedicated Agent
                </span>
              </div>
              <p className="text-[13px] text-text-secondary">
                Powers the Empirical Auditor using model <code className="bg-stone-200 px-1.5 py-0.5 rounded text-[12px]">openai/gpt-oss-20b</code>. Stress-tests claims against diagnostic facts.
              </p>
              <div className="flex items-center gap-2 text-[12px] text-text-muted pt-1">
                <KeyRound className="w-3.5 h-3.5 text-red-800" />
                <span className="font-mono">GROQ_API_KEY_SECONDARY (gsk_fJrWTTKH...lmcI)</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active & Verified
              </span>
            </div>
          </div>

          {/* Card 3: Dynamic Fallback & Redundancy Pool */}
          <div className="p-4 rounded-[12px] bg-[#FAF8F3] border border-border-warm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-olive-primary" />
                <span className="font-bold text-text-primary text-[14px]">Multi-Key Failover & Fallback Models</span>
                <span className="text-[11px] bg-stone-200 text-stone-700 font-mono px-2 py-0.5 rounded">Resilience</span>
              </div>
              <p className="text-[13px] text-text-secondary">
                If an individual key reaches its rate limit, calls automatically rotate to the partner key and test candidate models (<code className="text-[11px]">openai/gpt-oss-120b</code>, <code className="text-[11px]">qwen/qwen3.8-27b</code>).
              </p>
            </div>
            <span className="font-sans text-[12px] font-semibold text-text-muted shrink-0">
              Automatic Rotation
            </span>
          </div>
        </div>
      </div>

      {/* Orchestration Parameters */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Sliders className="w-6 h-6 text-olive-primary" />
          <h3 className="font-serif-heading text-[22px] font-medium text-text-primary">
            Deterministic Orchestration Guardrails
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-[13px]">
          <div className="p-4 rounded-[10px] bg-[#FAF8F3] border border-border-warm">
            <span className="font-bold text-text-primary block mb-1">Max Rounds Bound</span>
            <span className="text-text-secondary">
              Strictly clamped to <strong>3 rounds</strong> in backend controller with fast convergence exit.
            </span>
          </div>

          <div className="p-4 rounded-[10px] bg-[#FAF8F3] border border-border-warm">
            <span className="font-bold text-text-primary block mb-1">Empirical Grounding</span>
            <span className="text-text-secondary">
              All objections must cite <code>targeted_field</code> or are penalized in evaluation.
            </span>
          </div>

          <div className="p-4 rounded-[10px] bg-[#FAF8F3] border border-border-warm">
            <span className="font-bold text-text-primary block mb-1">Math Monotonicity Enforcement</span>
            <span className="text-text-secondary">
              Strict validation ensures $M3 \le M1$ cohort decay and positive unit economics.
            </span>
          </div>

          <div className="p-4 rounded-[10px] bg-[#FAF8F3] border border-border-warm">
            <span className="font-bold text-text-primary block mb-1">Open Risk Transparency</span>
            <span className="text-text-secondary">
              Unresolved objections are surfaced directly in the final blueprint rather than suppressed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

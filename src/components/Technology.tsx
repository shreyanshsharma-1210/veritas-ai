import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Cpu, Calculator, GitBranch, Database, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';

const customEase = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: customEase },
  }),
};

export const Technology: React.FC = () => {
  return (
    <section id="technology" className="bg-[#30272A] border-y border-[#4A3A40] scroll-mt-20 py-20 px-6 md:px-12 text-left">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: customEase }}
          className="text-center mb-16"
        >
          <span className="font-sans text-[12px] font-bold tracking-[0.2em] text-[#C7A05A] uppercase">
            Technology & System Architecture
          </span>
          <h2 className="font-serif-heading text-[44px] md:text-[58px] font-medium text-[#F5F1ED] mt-3 leading-tight">
            Engineering-grade decision intelligence.
          </h2>
          <p className="font-sans text-[16px] text-[#E9DFDC]/80 max-w-[760px] mx-auto mt-4 leading-relaxed">
            Veritas AI replaces unreliable single-prompt LLM generation with an adversarial dual-agent state machine, 
            strictly bounded debate rounds, and deterministic mathematical verification.
          </p>
        </motion.div>

        {/* 1. VISUAL REASONING PIPELINE (Charcoal Plum Surface + White Nodes + Gold Connectors) */}
        <div className="bg-[#241C1E] border border-[#4A3A40] rounded-[24px] shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-center justify-between border-b border-[#4A3A40] pb-6 mb-10">
            <div>
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#C7A05A] uppercase block">
                Core Runtime Pipeline
              </span>
              <h3 className="font-serif-heading text-[26px] font-bold text-[#F5F1ED] mt-1">
                Deterministic Multi-Agent Execution Flow
              </h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#30272A] border border-[#C7A05A]/40 text-xs font-semibold text-[#C7A05A] shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[#C7A05A]" /> Sub-2s Turn Latency
            </span>
          </div>

          {/* Pipeline Diagram */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2 xl:gap-4 max-w-[1250px] mx-auto">
            
            {/* Card 1: Fact Intake (White Architecture Node) */}
            <div className="w-[210px] bg-[#FFFFFF] border border-[#E2D9D4] rounded-[16px] p-5 text-center shadow-md relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#F5F1ED] border border-[#C7A05A]/40 flex items-center justify-center text-[#451F2D] mx-auto mb-3 shadow-xs">
                <Layers className="w-5 h-5 text-[#451F2D]" />
              </div>
              <span className="font-sans text-[14px] font-bold text-[#241C1E] block">
                5-Step Fact Intake
              </span>
              <span className="text-[12px] text-[#6B5B60] mt-1 block">
                SaaS Cohorts & Goals
              </span>
            </div>

            {/* Dotted Gold Connector 1 */}
            <div className="relative shrink-0 hidden lg:block">
              <svg width="50" height="16" viewBox="0 0 50 16" fill="none" className="text-[#C7A05A]">
                <line x1="0" y1="8" x2="42" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M40 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <motion.div
                className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-[#C7A05A]"
                animate={{ x: [0, 42], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>

            {/* Card 2: Math Engine (White Architecture Node) */}
            <div className="w-[210px] bg-[#FFFFFF] border border-[#E2D9D4] rounded-[16px] p-5 text-center shadow-md relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#F5F1ED] border border-[#C7A05A]/40 flex items-center justify-center text-[#451F2D] mx-auto mb-3 shadow-xs">
                <Calculator className="w-5 h-5 text-[#451F2D]" />
              </div>
              <span className="font-sans text-[14px] font-bold text-[#241C1E] block">
                Math Validator
              </span>
              <span className="text-[12px] text-[#6B5B60] mt-1 block">
                M3 ≤ M1 Monotonicity
              </span>
            </div>

            {/* Dotted Gold Connector 2 */}
            <div className="relative shrink-0 hidden lg:block">
              <svg width="50" height="16" viewBox="0 0 50 16" fill="none" className="text-[#C7A05A]">
                <line x1="0" y1="8" x2="42" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M40 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <motion.div
                className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-[#C7A05A]"
                animate={{ x: [0, 42], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.4 }}
              />
            </div>

            {/* Card 3: Dual Groq Adversarial Loop */}
            <div className="flex flex-col gap-3 items-center z-10">
              {/* Closer Agent Card */}
              <div className="w-[200px] bg-[#FFFFFF] border border-[#451F2D]/40 rounded-[14px] p-3 text-center flex items-center justify-center gap-3 shadow-md">
                <div className="w-8 h-8 rounded-full bg-[#F5F1ED] border border-[#451F2D]/20 flex items-center justify-center text-[#451F2D] shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-sans text-[13px] font-bold text-[#451F2D]">Closer AI</span>
                  <span className="block text-[11px] text-[#C7A05A] font-medium">Dedicated Groq Key 1</span>
                </div>
              </div>

              {/* Bidirectional vertical arrows */}
              <div className="flex items-center justify-center gap-2 text-[#C7A05A] py-0.5">
                <motion.svg 
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </motion.svg>
                <span className="font-sans text-[10px] font-bold tracking-[0.15em] text-[#E9DFDC]/70 uppercase">Max 3 Rounds</span>
              </div>

              {/* Skeptic Agent Card */}
              <div className="w-[200px] bg-[#FFFFFF] border border-[#9B747A]/50 rounded-[14px] p-3 text-center flex items-center justify-center gap-3 shadow-md">
                <div className="w-8 h-8 rounded-full bg-[#F5F1ED] border border-[#9B747A]/30 flex items-center justify-center text-[#9B747A] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-sans text-[13px] font-bold text-[#451F2D]">Skeptic AI</span>
                  <span className="block text-[11px] text-[#9B747A] font-medium">Dedicated Groq Key 2</span>
                </div>
              </div>
            </div>

            {/* Dotted Gold Connector 3 */}
            <div className="relative shrink-0 hidden lg:block">
              <svg width="50" height="16" viewBox="0 0 50 16" fill="none" className="text-[#C7A05A]">
                <line x1="0" y1="8" x2="42" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M40 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <motion.div
                className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-[#C7A05A]"
                animate={{ x: [0, 42], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.8 }}
              />
            </div>

            {/* Card 4: Verified Recommendation (White Architecture Node) */}
            <div className="w-[210px] bg-[#FFFFFF] border border-[#E2D9D4] rounded-[16px] p-5 text-center shadow-md relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#F5F1ED] border border-[#C7A05A]/40 flex items-center justify-center text-[#451F2D] mx-auto mb-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#451F2D]" />
              </div>
              <span className="font-sans text-[14px] font-bold text-[#241C1E] block">
                Recommendation
              </span>
              <span className="text-[12px] text-[#6B5B60] mt-1 block">
                ARR Impact & Residuals
              </span>
            </div>

          </div>
        </div>

        {/* 2. FOUR TECHNICAL SPECIFICATION PILLARS (Charcoal Plum Cards + Gold Accents) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Pillar 1 */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="bg-[#241C1E] border border-[#4A3A40] rounded-[20px] p-6 shadow-md flex flex-col justify-between hover:border-[#C7A05A]/60 transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#30272A] border border-[#C7A05A]/40 flex items-center justify-center text-[#C7A05A] mb-5 shadow-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-sans text-[16px] font-bold text-[#F5F1ED] mb-2">
                Dual Groq LPU Inference
              </h4>
              <p className="font-sans text-[13px] text-[#E9DFDC]/75 leading-relaxed mb-4">
                Two independent Groq API keys eliminate rate-limit collisions between Closer and Skeptic agents. Ultra-fast inference executes debate turns in ~1.1 seconds.
              </p>
            </div>
            <div className="pt-4 border-t border-[#4A3A40] font-mono text-[11px] text-[#C7A05A] flex items-center justify-between">
              <span>Model: GPT-OSS-20B</span>
              <span className="font-semibold">1,000+ T/s</span>
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="bg-[#241C1E] border border-[#4A3A40] rounded-[20px] p-6 shadow-md flex flex-col justify-between hover:border-[#C7A05A]/60 transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#30272A] border border-[#C7A05A]/40 flex items-center justify-center text-[#C7A05A] mb-5 shadow-xs">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="font-sans text-[16px] font-bold text-[#F5F1ED] mb-2">
                Deterministic Math Engine
              </h4>
              <p className="font-sans text-[13px] text-[#E9DFDC]/75 leading-relaxed mb-4">
                All financial and cohort projections are computed via formulaic Python functions, never left to LLM guesswork. Zero financial hallucinations guaranteed.
              </p>
            </div>
            <div className="pt-4 border-t border-[#4A3A40] font-mono text-[11px] text-[#C7A05A] flex items-center justify-between">
              <span>ARR = ΔR × N × ARPU</span>
              <span className="font-semibold">M3 ≤ M1 Proof</span>
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="bg-[#241C1E] border border-[#4A3A40] rounded-[20px] p-6 shadow-md flex flex-col justify-between hover:border-[#C7A05A]/60 transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#30272A] border border-[#C7A05A]/40 flex items-center justify-center text-[#C7A05A] mb-5 shadow-xs">
                <GitBranch className="w-5 h-5" />
              </div>
              <h4 className="font-sans text-[16px] font-bold text-[#F5F1ED] mb-2">
                Bounded 3-Round Machine
              </h4>
              <p className="font-sans text-[13px] text-[#E9DFDC]/75 leading-relaxed mb-4">
                Orchestrator enforces a hard maximum of 3 rounds. Objections are tagged against diagnostic fields, and evaluated for early convergence to prevent endless loops.
              </p>
            </div>
            <div className="pt-4 border-t border-[#4A3A40] font-mono text-[11px] text-[#C7A05A] flex items-center justify-between">
              <span>Max Rounds: 3</span>
              <span className="font-semibold">Strict Bounds</span>
            </div>
          </motion.div>

          {/* Pillar 4 */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="bg-[#241C1E] border border-[#4A3A40] rounded-[20px] p-6 shadow-md flex flex-col justify-between hover:border-[#C7A05A]/60 transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#30272A] border border-[#C7A05A]/40 flex items-center justify-center text-[#C7A05A] mb-5 shadow-xs">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-sans text-[16px] font-bold text-[#F5F1ED] mb-2">
                Async FastAPI + SQLite WAL
              </h4>
              <p className="font-sans text-[13px] text-[#E9DFDC]/75 leading-relaxed mb-4">
                Asynchronous SQLAlchemy 2.0 with write-ahead logging guarantees non-blocking audit persistence. Server-Sent Events stream agent reasoning live to the UI.
              </p>
            </div>
            <div className="pt-4 border-t border-[#4A3A40] font-mono text-[11px] text-[#C7A05A] flex items-center justify-between">
              <span>SSE Streaming</span>
              <span className="font-semibold">Async I/O</span>
            </div>
          </motion.div>

        </div>

        {/* 3. TECH STACK PILLS */}
        <div className="bg-[#241C1E] border border-[#4A3A40] rounded-[16px] px-6 py-4 flex flex-wrap items-center justify-center md:justify-between gap-4 text-xs font-medium text-[#E9DFDC]">
          <span className="font-sans font-bold text-[#C7A05A] uppercase tracking-wider text-[11px]">
            Technology Stack
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {['Python 3.14', 'FastAPI', 'Groq LPU (Dual-Key)', 'SQLite WAL', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion 12'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-[6px] bg-[#30272A] border border-[#4A3A40] text-[#E9DFDC] font-mono text-[11px]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

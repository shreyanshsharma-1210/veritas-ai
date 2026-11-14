import React from 'react';
import { motion } from 'framer-motion';

export const Architecture: React.FC = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 pb-10">
      {/* Container Card */}
      <div className="bg-surface-warm border border-border-warm rounded-[24px] shadow-sm p-10 md:p-14 text-center">
        {/* Label */}
        <span className="inline-block font-sans text-[12px] font-bold tracking-[0.2em] text-text-muted uppercase mb-14">
          Built on a Structured Reasoning Engine
        </span>

        {/* Pipeline Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2 xl:gap-4 max-w-[1250px] mx-auto">
          
          {/* Card 1: Business Context */}
          <div className="w-[210px] bg-[#FFFFFF] border border-border-warm rounded-[16px] p-5 md:p-6 text-center shadow-sm relative z-10">
            <div className="w-12 h-12 rounded-full bg-surface-warm border border-border-warm flex items-center justify-center text-olive-primary mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <span className="font-sans text-[15px] font-bold text-text-primary">
              Business Context
            </span>
          </div>

          {/* Dotted Connector 1 */}
          <div className="relative shrink-0 hidden lg:block">
            <svg width="56" height="16" viewBox="0 0 56 16" fill="none" className="text-olive-muted">
              <line x1="0" y1="8" x2="48" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M44 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <motion.div
              className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-olive-primary"
              animate={{ x: [0, 48], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
          <div className="lg:hidden text-olive-muted my-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Card 2: Diagnosis Engine */}
          <div className="w-[210px] bg-[#FFFFFF] border border-border-warm rounded-[16px] p-5 md:p-6 text-center shadow-sm relative z-10">
            <div className="w-12 h-12 rounded-full bg-surface-warm border border-border-warm flex items-center justify-center text-olive-primary mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925-3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 002.25 9c0 1.285.645 2.42 1.636 3.102A3.75 3.75 0 003.75 18H12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 01-.495-7.467 5.99 5.99 0 011.925-3.546 5.974 5.974 0 002.133-1A3.75 3.75 0 0121.75 9c0 1.285-.645 2.42-1.636 3.102A3.75 3.75 0 0120.25 18H12z" />
              </svg>
            </div>
            <span className="font-sans text-[15px] font-bold text-text-primary">
              Diagnosis Engine
            </span>
          </div>

          {/* Dotted Connector 2 */}
          <div className="relative shrink-0 hidden lg:block">
            <svg width="56" height="16" viewBox="0 0 56 16" fill="none" className="text-olive-muted">
              <line x1="0" y1="8" x2="48" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M44 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <motion.div
              className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-olive-primary"
              animate={{ x: [0, 48], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
            />
          </div>
          <div className="lg:hidden text-olive-muted my-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Card 3: Debate Controller */}
          <div className="w-[210px] bg-[#FFFFFF] border border-border-warm rounded-[16px] p-5 md:p-6 text-center shadow-sm relative z-10">
            <div className="w-12 h-12 rounded-full bg-surface-warm border border-border-warm flex items-center justify-center text-olive-primary mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.99l1.004.831a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.491l-1.216-.456c-.356-.133-.752-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.83c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="font-sans text-[15px] font-bold text-text-primary">
              Debate Controller
            </span>
          </div>

          {/* Dotted Split Connector */}
          <div className="relative shrink-0 hidden lg:block">
            <svg width="56" height="32" viewBox="0 0 56 32" fill="none" className="text-olive-muted">
              <path d="M0 16h14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M14 16c6 0 10-10 16-10h14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M14 16c6 0 10 10 16 10h14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M40 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 22l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <motion.div
              className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-olive-primary"
              animate={{ x: [0, 14, 24, 44], y: [0, 0, -10, -10], opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay: 1 }}
            />
            <motion.div
              className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-warning-warm"
              animate={{ x: [0, 14, 24, 44], y: [0, 0, 10, 10], opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay: 1.4 }}
            />
          </div>
          <div className="lg:hidden text-olive-muted my-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Card 4 Stack: Debate Loop (Closer & Skeptic) */}
          <div className="flex flex-col gap-4 items-center z-10">
            {/* Closer AI Card */}
            <div className="w-[185px] bg-[#FFFFFF] border border-border-warm rounded-[16px] p-4 text-center flex items-center justify-center gap-3 shadow-sm relative overflow-hidden group">
              <div className="w-9 h-9 rounded-full bg-surface-warm border border-border-warm flex items-center justify-center text-olive-primary shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block font-sans text-[14px] font-bold text-text-primary">Closer AI</span>
              </div>
            </div>

            {/* Bidirectional vertical arrows */}
            <div className="flex items-center justify-center gap-3 text-olive-muted">
              <motion.svg 
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </motion.svg>
              <span className="font-sans text-[11px] font-bold tracking-[0.15em] text-text-muted uppercase">Debate</span>
            </div>

            {/* Skeptic AI Card */}
            <div className="w-[185px] bg-[#FFFFFF] border border-border-warm rounded-[16px] p-4 text-center flex items-center justify-center gap-3 shadow-sm relative overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-surface-warm border border-border-warm flex items-center justify-center text-warning-warm shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block font-sans text-[14px] font-bold text-text-primary">Skeptic AI</span>
              </div>
            </div>
          </div>

          {/* Dotted Merge Connector */}
          <div className="relative shrink-0 hidden lg:block">
            <svg width="56" height="32" viewBox="0 0 56 32" fill="none" className="text-olive-muted">
              <path d="M12 6h14c6 0 10 10 16 10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M12 26h14c6 0 10-10 16-10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M42 16h8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M46 12l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <motion.div
              className="absolute left-3 top-1/2 -mt-1 w-2 h-2 rounded-full bg-olive-primary"
              animate={{ x: [0, 14, 24, 38], y: [-10, -10, 0, 0], opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay: 1.8 }}
            />
          </div>
          <div className="lg:hidden text-olive-muted my-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Card 5: Verified Recommendation */}
          <div className="w-[210px] bg-[#FFFFFF] border border-border-warm rounded-[16px] p-5 md:p-6 text-center shadow-sm relative z-10">
            <div className="w-12 h-12 rounded-full bg-surface-warm border border-border-warm flex items-center justify-center text-olive-primary mx-auto mb-4 relative overflow-hidden group">
              <motion.div 
                className="absolute inset-0 bg-[#F4F1EB]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="font-sans text-[15px] font-bold text-text-primary">
              Verified Recommendation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

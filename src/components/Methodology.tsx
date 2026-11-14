import React from 'react';
import { motion, type Variants } from 'framer-motion';

const customEase = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.15, ease: customEase },
  }),
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.2 + i * 0.12, ease: customEase },
  }),
};

export const Methodology: React.FC = () => {
  return (
    <section id="working" className="max-w-[1440px] mx-auto px-6 md:px-12 pt-14 pb-14 scroll-mt-24">
      {/* Centered Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: customEase }}
        className="text-center mb-16"
      >
        <span className="font-sans text-[12px] font-bold tracking-[0.2em] text-[#C7A05A] uppercase">
          How Veritas AI Works
        </span>
        <h2 className="font-serif-heading text-[44px] md:text-[62px] font-medium text-[#451F2D] mt-3">
          Our consultative methodology.
        </h2>
      </motion.div>

      {/* Grid of Three Cards */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 relative">
        
        {/* CARD ONE: Diagnose */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex-grow flex-shrink flex-basis-0 bg-[#FFFFFF] border border-[#E2D9D4] rounded-[24px] p-8 md:p-10 flex flex-col justify-between shadow-sm min-h-[500px]"
        >
          <div>
            {/* Header: Number & Icon */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1ED] border border-[#C7A05A]/40 flex items-center justify-center font-serif-heading text-[18px] font-bold text-[#C7A05A] shadow-xs">
                01
              </div>
              <div className="text-[#451F2D]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925-3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 002.25 9c0 1.285.645 2.42 1.636 3.102A3.75 3.75 0 003.75 18H12z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 01-.495-7.467 5.99 5.99 0 011.925-3.546 5.974 5.974 0 002.133-1A3.75 3.75 0 0121.75 9c0 1.285-.645 2.42-1.636 3.102A3.75 3.75 0 0120.25 18H12z" />
                </svg>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-sans text-[26px] md:text-[28px] font-bold text-[#451F2D] text-left mb-3">
              Diagnose
            </h3>
            <p className="font-sans text-[16px] text-[#6B5B60] text-left leading-relaxed mb-8">
              Understand the business, collect structured evidence, validate assumptions.
            </p>
          </div>

          {/* Internal diagnostics list */}
          <div className="space-y-3 w-full">
            {[
              { label: 'Business Goal', value: 'Retention', icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></> },
              { label: 'Data Sources', value: '7 Connected', icon: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></> },
              { label: 'Key Factors', value: '12 Identified', icon: <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5l-.75.75" /> },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ x: 3 }}
                className="bg-[#FAF8F5] border border-[#E2D9D4] rounded-[12px] p-3.5 flex items-center justify-between shadow-2xs transition-shadow duration-200 hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#C7A05A] shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {row.icon}
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="block font-sans text-[10px] text-[#94858A] font-bold uppercase tracking-[0.15em]">{row.label}</span>
                    <span className="block font-sans text-[15px] font-bold text-[#241C1E] mt-0.5">{row.value}</span>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FFFFFF] border border-[#E2D9D4] flex items-center justify-center text-[#2E5A44]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Separator Arrow (desktop only) */}
        <div className="hidden lg:flex items-center justify-center text-[#C7A05A]">
          <motion.svg
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </motion.svg>
        </div>

        {/* CARD TWO: Debate */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex-grow flex-shrink flex-basis-0 bg-[#FFFFFF] border border-[#E2D9D4] rounded-[24px] p-8 md:p-10 flex flex-col justify-between shadow-sm min-h-[500px]"
        >
          <div>
            {/* Header: Number & Icon */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1ED] border border-[#C7A05A]/40 flex items-center justify-center font-serif-heading text-[18px] font-bold text-[#C7A05A] shadow-xs">
                02
              </div>
              <div className="text-[#451F2D]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M19 8l-7-3-7 3m14 4H5m14 0a3 3 0 11-6 0m6 0a3 3 0 10-6 0M5 12a3 3 0 11-6 0m6 0a3 3 0 10-6 0" />
                </svg>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-sans text-[26px] md:text-[28px] font-bold text-[#451F2D] text-left mb-3">
              Debate
            </h3>
            <p className="font-sans text-[16px] text-[#6B5B60] text-left leading-relaxed mb-8">
              Two specialized AI agents challenge every proposal until risks are resolved.
            </p>
          </div>

          {/* Internal debate visualizers */}
          <div className="bg-[#FAF8F5] p-5 rounded-[16px] border border-[#E2D9D4] my-auto">
            <div className="flex items-center justify-between gap-2.5">
              {/* Closer Card */}
              <div className="flex-1 text-center flex flex-col items-center">
                <div className="bg-[#FFFFFF] border border-[#451F2D]/30 rounded-[12px] p-3.5 w-full shadow-2xs">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F1ED] border border-[#451F2D]/20 text-[#451F2D] mb-1.5 shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="block font-sans text-[14px] font-bold text-[#451F2D]">Closer</span>
                  <span className="block font-sans text-[10px] text-[#C7A05A] uppercase tracking-[0.1em] font-bold">Proposer</span>
                </div>
                <span className="font-sans text-[11px] text-[#6B5B60] mt-2 block leading-snug">Makes the case for impact</span>
              </div>

              {/* Debate arrows — animated ping-pong */}
              <div className="flex flex-col items-center justify-center text-[#C7A05A] shrink-0 px-1">
                <motion.svg
                  animate={{ x: [0, 3, 0, -3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M17 8l4 4-4 4M7 16l-4-4 4-4M3 12h18" />
                </motion.svg>
              </div>

              {/* Skeptic Card */}
              <div className="flex-1 text-center flex flex-col items-center">
                <div className="bg-[#FFFFFF] border border-[#9B747A]/40 rounded-[12px] p-3.5 w-full shadow-2xs">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F1ED] border border-[#9B747A]/30 text-[#9B747A] mb-1.5 shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="block font-sans text-[14px] font-bold text-[#451F2D]">Skeptic</span>
                  <span className="block font-sans text-[10px] text-[#9B747A] uppercase tracking-[0.1em] font-bold">Challenger</span>
                </div>
                <span className="font-sans text-[11px] text-[#6B5B60] mt-2 block leading-snug">Questions assumptions</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Separator Arrow (desktop only) */}
        <div className="hidden lg:flex items-center justify-center text-[#C7A05A]">
          <motion.svg
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </motion.svg>
        </div>

        {/* CARD THREE: Decide */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex-grow flex-shrink flex-basis-0 bg-[#FFFFFF] border border-[#E2D9D4] rounded-[24px] p-8 md:p-10 flex flex-col justify-between shadow-sm min-h-[500px]"
        >
          <div>
            {/* Header: Number & Icon */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1ED] border border-[#C7A05A]/40 flex items-center justify-center font-serif-heading text-[18px] font-bold text-[#C7A05A] shadow-xs">
                03
              </div>
              <div className="text-[#451F2D]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-sans text-[26px] md:text-[28px] font-bold text-[#451F2D] text-left mb-3">
              Decide
            </h3>
            <p className="font-sans text-[16px] text-[#6B5B60] text-left leading-relaxed mb-8">
              Deliver transparent, evidence-backed recommendations.
            </p>
          </div>

          {/* Internal decisions list */}
          <div className="space-y-3 w-full">
            {[
              { label: 'All critical risks resolved', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
              { label: 'Expected impact quantified', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></> },
              { label: 'Action plan with priorities', icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><polyline points="9 11 12 14 22 4" /></> },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ x: 3 }}
                className="bg-[#FAF8F5] border border-[#E2D9D4] rounded-[12px] p-3.5 flex items-center justify-between shadow-2xs transition-shadow duration-200 hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#C7A05A] shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {row.icon}
                    </svg>
                  </div>
                  <span className="font-sans text-[15px] font-medium text-[#241C1E] text-left">{row.label}</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FFFFFF] border border-[#E2D9D4] flex items-center justify-center text-[#451F2D] shrink-0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

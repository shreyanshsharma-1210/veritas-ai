import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { DashboardPreview } from './DashboardPreview';

const customEase = [0.16, 1, 0.3, 1] as const;

export const Hero: React.FC = () => {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: customEase } }
  };

  const lineGrow: Variants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: { scaleY: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 md:pt-10 pb-10 md:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[48fr_52fr] gap-8 lg:gap-12 items-start">
        {/* Left Column Wrapper */}
        <div className="w-full flex lg:justify-end">
          <motion.div 
            className="w-full max-w-[520px] flex flex-col items-start text-left"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } }
            }}
          >
            {/* Large serif heading: Veritas AI */}
            <motion.h1 variants={fadeUp} className="font-serif-heading text-[60px] md:text-[76px] leading-[1.05] font-light text-[#451F2D] mb-2">
              VERITAS AI
            </motion.h1>
            
            <motion.h2 variants={fadeUp} className="font-sans text-[18px] md:text-[22px] font-semibold text-[#C7A05A] tracking-widest uppercase mb-4">
              Enterprise AI Sales Consultant
            </motion.h2>
            
            <motion.p variants={fadeUp} className="font-sans text-[16px] md:text-[18px] text-[#6B5B60] leading-relaxed mb-8 max-w-[440px]">
              Built on structured reasoning rather than one-shot AI responses.
            </motion.p>

            <motion.hr variants={fadeUp} className="w-full border-t border-[#E2D9D4] mb-8" />

            {/* Pipeline Flowchart */}
            <div className="w-full flex flex-col items-center mb-8">
              <motion.div variants={fadeUp} className="font-sans text-[13px] font-bold tracking-widest text-[#94858A] uppercase">
                Business Context
              </motion.div>
              
              <motion.div variants={lineGrow} className="h-5 w-[1px] bg-[#C7A05A]/60 my-1 origin-top"></motion.div>
              <motion.svg variants={fadeUp} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#C7A05A] mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>

              <motion.div variants={fadeUp} className="flex items-center gap-2 font-sans text-[17px] font-semibold text-[#451F2D]">
                <span>🧠</span> Diagnose
              </motion.div>

              <motion.div variants={lineGrow} className="h-5 w-[1px] bg-[#C7A05A]/60 my-1 origin-top"></motion.div>
              <motion.svg variants={fadeUp} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#C7A05A] mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>

              <motion.div variants={fadeUp} className="flex items-center gap-2 font-sans text-[17px] font-semibold text-[#451F2D]">
                <span>⚖️</span> Debate
              </motion.div>

              <motion.div variants={lineGrow} className="h-5 w-[1px] bg-[#C7A05A]/60 my-1 origin-top"></motion.div>
              <motion.svg variants={fadeUp} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#C7A05A] mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>

              <motion.div variants={fadeUp} className="flex items-center gap-2 font-sans text-[17px] font-semibold text-[#451F2D]">
                <span>✓</span> Decide
              </motion.div>

              <motion.div variants={lineGrow} className="h-5 w-[1px] bg-[#C7A05A]/60 my-1 origin-top"></motion.div>
              <motion.svg variants={fadeUp} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#C7A05A] mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>

              <motion.div variants={fadeUp} className="flex items-center gap-2 font-sans text-[15px] font-semibold text-[#451F2D] bg-[#FFFFFF] px-5 py-2.5 rounded-full border border-[#C7A05A]/40 shadow-xs">
                <span>📄</span> Verified Recommendation
              </motion.div>
            </div>

            <motion.hr variants={fadeUp} className="w-full border-t border-[#E2D9D4] mb-8" />

            {/* Supporting copy */}
            <motion.p variants={fadeUp} className="font-serif-heading text-[24px] md:text-[28px] font-light text-[#6B5B60] leading-relaxed mb-8">
              Every recommendation earns its <span className="italic text-[#C7A05A] font-normal">truth</span>.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={fadeUp} className="flex flex-row items-center gap-4 w-full sm:w-auto">
              {/* Primary button */}
              <Link
                to="/app/new"
                className="inline-flex items-center justify-center gap-2 bg-[#451F2D] text-[#F5F1ED] border border-[#C7A05A]/30 font-sans text-[16px] font-semibold px-8 py-4 rounded-[12px] hover:bg-[#371723] hover:border-[#C7A05A] transition-all shadow-sm group"
              >
                Start Diagnosis
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 14 14" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#C7A05A] transition-transform group-hover:translate-x-0.5"
                >
                  <path 
                    d="M1.16669 7H12.8334M12.8334 7L7.00002 1.16667M12.8334 7L7.00002 12.8333" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {/* Secondary button */}
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 border border-[#E2D9D4] bg-[#FFFFFF] text-[#451F2D] font-sans text-[16px] font-semibold px-8 py-4 rounded-[12px] shadow-xs hover:bg-[#E9DFDC]/30 hover:border-[#C7A05A]/50 transition-colors"
              >
                {/* Play icon */}
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  className="text-[#C7A05A]"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                </svg>
                Launch Workspace
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column Wrapper - Aligns to the left side of its 52% column */}
        <div className="w-full flex lg:justify-start">
          {/* Dashboard (Max Width 560px) */}
          <motion.div 
            className="w-full max-w-[560px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

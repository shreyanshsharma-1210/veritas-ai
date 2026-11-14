import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, type Variants } from 'framer-motion';

const customEase = [0.16, 1, 0.3, 1] as const;

const Counter = ({ value, delay }: { value: number; delay: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest) + "%");

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, delay, ease: customEase });
    return controls.stop;
  }, [value, delay, count]);

  return <motion.span>{rounded}</motion.span>;
};

export const DashboardPreview: React.FC = () => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 1.4 + i * 0.15, ease: customEase }
    })
  };

  const chartDraw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 1.5, delay: 2.2, ease: customEase } 
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E2D9D4] rounded-[24px] shadow-md p-8 md:p-10 flex flex-col h-full">
      {/* Top Section */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E2D9D4] mb-6">
        <div>
          <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#94858A] uppercase">
            Veritas AI Session
          </h4>
          <h3 className="font-serif-heading text-[24px] md:text-[30px] font-medium text-[#451F2D] mt-3">
            Increase Month 3 Retention
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-[#F5F1ED] px-4 py-2 rounded-full border border-[#C7A05A]/40 shadow-xs">
          <motion.span 
            className="w-2 h-2 rounded-full bg-[#C7A05A]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          ></motion.span>
          <span className="font-sans text-[12px] font-bold tracking-[0.1em] text-[#C7A05A] uppercase">
            Live
          </span>
        </div>
      </div>

      {/* Main Content: Reasoning Panels Workspace */}
      <div className="flex flex-col gap-4 flex-grow">
        {/* Panel One: Diagnosis */}
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, boxShadow: "0px 8px 24px rgba(69,31,45,0.08)" }}
          variants={cardVariants}
          className="bg-[#FAF8F5] border border-[#E2D9D4] rounded-[12px] py-4.5 px-5 flex items-center justify-between shadow-xs transition-shadow duration-300"
        >
          <div className="text-left">
            <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#94858A] uppercase">
              Diagnosis
            </span>
            <p className="font-sans text-[15px] text-[#241C1E] font-semibold mt-1.5">
              Analyzed 7 data sources
            </p>
            <p className="font-sans text-[13px] text-[#6B5B60] mt-0.5">
              Identified 12 key factors
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#451F2D] flex items-center justify-center text-[#451F2D] shrink-0 mr-1 shadow-xs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </motion.div>

        {/* Panel Two: Closer (Proposer) */}
        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, boxShadow: "0px 8px 24px rgba(69,31,45,0.08)" }}
          variants={cardVariants}
          className="bg-[#FAF8F5] border border-[#E2D9D4] rounded-[12px] py-4.5 px-5 flex items-center justify-between shadow-xs transition-shadow duration-300"
        >
          <div className="flex-grow text-left">
            <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#451F2D] uppercase">
              Closer <span className="text-[#94858A] font-normal tracking-normal">(Proposer)</span>
            </span>
            <p className="font-sans text-[15px] text-[#241C1E] font-semibold mt-1.5">
              Proposal generated
            </p>
            <p className="font-sans text-[13px] text-[#6B5B60] mt-0.5">
              Expected lift: 6–8%
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0 mr-1">
            {/* Mini Line Chart SVG */}
            <div className="relative">
              <svg width="84" height="32" viewBox="0 0 84 32" fill="none" className="text-[#451F2D] opacity-90 z-10 relative">
                {/* Grid Lines */}
                <line x1="0" y1="8" x2="84" y2="8" stroke="#E2D9D4" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="16" x2="84" y2="16" stroke="#E2D9D4" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="24" x2="84" y2="24" stroke="#E2D9D4" strokeWidth="1" strokeDasharray="2 2" />
                <motion.path 
                  d="M1 24C15 16 20 2 35 12C50 22 65 6 83 2" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  variants={chartDraw}
                  initial="hidden"
                  animate="visible"
                />
              </svg>
            </div>
            <div className="text-right min-w-[70px]">
              <span className="block font-sans text-[10px] text-[#94858A] font-bold tracking-wider uppercase">Confidence</span>
              <span className="font-sans text-[18px] font-bold text-[#451F2D]">
                <Counter value={72} delay={2.3} />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Panel Three: Skeptic (Challenger) */}
        <motion.div 
          custom={2}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, boxShadow: "0px 8px 24px rgba(69,31,45,0.08)" }}
          variants={cardVariants}
          className="bg-[#FAF8F5] border border-[#E2D9D4] rounded-[12px] py-4.5 px-5 flex items-center justify-between shadow-xs transition-shadow duration-300"
        >
          <div className="flex-grow text-left">
            <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#9B747A] uppercase">
              Skeptic <span className="text-[#94858A] font-normal tracking-normal">(Challenger)</span>
            </span>
            <p className="font-sans text-[15px] text-[#241C1E] font-semibold mt-1.5">
              2 objections raised
            </p>
            <p className="font-sans text-[13px] text-[#6B5B60] mt-0.5">
              Evaluating assumptions
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0 mr-1">
            {/* Mini Line Chart SVG (Dusty Rose) */}
            <div className="relative">
              <svg width="84" height="32" viewBox="0 0 84 32" fill="none" className="text-[#9B747A] opacity-90 z-10 relative">
                {/* Grid Lines */}
                <line x1="0" y1="8" x2="84" y2="8" stroke="#E2D9D4" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="16" x2="84" y2="16" stroke="#E2D9D4" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="24" x2="84" y2="24" stroke="#E2D9D4" strokeWidth="1" strokeDasharray="2 2" />
                <motion.path 
                  d="M1 30C15 28 25 10 38 18C52 26 66 8 83 10" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  variants={chartDraw}
                  initial="hidden"
                  animate="visible"
                />
              </svg>
            </div>
            <div className="text-right min-w-[70px]">
              <span className="block font-sans text-[10px] text-[#94858A] font-bold tracking-wider uppercase">Risk Level</span>
              <span className="font-sans text-[15px] font-bold text-[#C7A05A]">Medium</span>
            </div>
          </div>
        </motion.div>

        {/* Panel Four: Recommendation */}
        <motion.div 
          custom={3}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, boxShadow: "0px 8px 24px rgba(69,31,45,0.08)" }}
          variants={cardVariants}
          className="bg-[#FAF8F5] border border-[#E2D9D4] rounded-[12px] py-4.5 px-5 flex items-center justify-between shadow-xs transition-shadow duration-300"
        >
          <div className="text-left">
            <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#94858A] uppercase">
              Recommendation
            </span>
            <p className="font-sans text-[15px] text-[#241C1E] font-semibold mt-1.5">
              Building final recommendation
            </p>
            <p className="font-sans text-[13px] text-[#6B5B60] mt-0.5">
              Resolving open risks
            </p>
          </div>
          <div className="pr-3 shrink-0 mr-1">
            {/* Signature Gold Dotted Spinner */}
            <motion.svg 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="text-[#C7A05A]" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
            </motion.svg>
          </div>
        </motion.div>
      </div>

      {/* Bottom status/timeline bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8 }}
        className="mt-6 pt-5 border-t border-[#E2D9D4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <span className="font-sans text-[12px] text-[#94858A] font-bold uppercase tracking-[0.1em]">
            10:42 AM
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E2D9D4]"></span>
          <span className="font-sans text-[13px] text-[#6B5B60]">
            Skeptic raised objection on expected lift
          </span>
        </div>
        <div>
          <a href="#timeline" className="font-sans text-[13px] font-bold text-[#451F2D] hover:text-[#C7A05A] flex items-center gap-1.5 transition-colors">
            View Timeline
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#C7A05A]">
              <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

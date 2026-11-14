import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, type Variants } from 'framer-motion';

const customEase = [0.16, 1, 0.3, 1] as const;

const AnimatedNumber = ({ value, suffix = '', delay = 0 }: { value: number; suffix?: string; delay?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.8,
      delay,
      ease: customEase,
    });
    return controls.stop;
  }, [value, delay, count, suffix]);

  return <motion.span>{rounded}</motion.span>;
};

const colVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: customEase },
  }),
};

export const StatsBar: React.FC = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-6 pb-6">
      <div className="bg-[#FFFFFF] border border-[#E2D9D4] rounded-[24px] shadow-sm p-8 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E2D9D4]">
        
        {/* Column One */}
        <motion.div
          custom={0}
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-center justify-center gap-4 md:px-8 first:pl-0"
        >
          <div className="w-12 h-12 rounded-full bg-[#F5F1ED] border border-[#C7A05A]/50 flex items-center justify-center text-[#451F2D] shrink-0 shadow-xs">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-sans text-[38px] font-bold text-[#451F2D] leading-none mb-1.5">
              <AnimatedNumber value={50} suffix="+" delay={0} />
            </span>
            <span className="font-sans text-[12px] font-bold tracking-[0.15em] text-[#6B5B60] uppercase block">
              Analyses Run
            </span>
          </div>
        </motion.div>

        {/* Column Two */}
        <motion.div
          custom={1}
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-center justify-center gap-4 pt-6 md:pt-0 md:px-8"
        >
          <div className="w-12 h-12 rounded-full bg-[#F5F1ED] border border-[#C7A05A]/50 flex items-center justify-center text-[#451F2D] shrink-0 shadow-xs">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-sans text-[38px] font-bold text-[#451F2D] leading-none mb-1.5">
              <AnimatedNumber value={93} suffix="%" delay={0.15} />
            </span>
            <span className="font-sans text-[12px] font-bold tracking-[0.15em] text-[#6B5B60] uppercase block">
              Risk Resolution Rate
            </span>
          </div>
        </motion.div>

        {/* Column Three */}
        <motion.div
          custom={2}
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-center justify-center gap-4 pt-6 md:pt-0 md:px-8 last:pr-0"
        >
          <div className="w-12 h-12 rounded-full bg-[#F5F1ED] border border-[#C7A05A]/50 flex items-center justify-center text-[#451F2D] shrink-0 shadow-xs">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <motion.span
              className="block font-sans text-[38px] font-bold text-[#451F2D] leading-none mb-1.5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Minutes
            </motion.span>
            <span className="font-sans text-[12px] font-bold tracking-[0.15em] text-[#6B5B60] uppercase block">
              Problem to Recommendation
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

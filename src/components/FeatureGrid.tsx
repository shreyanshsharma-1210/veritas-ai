import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  const isBlush = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ y: -4, borderColor: "#C7A05A", boxShadow: "0px 12px 32px rgba(69,31,45,0.08)" }}
      className={`${
        isBlush ? 'bg-[#FAF8F5]' : 'bg-[#FFFFFF]'
      } border border-[#E2D9D4] rounded-[24px] py-10 px-7 text-left flex flex-col justify-between h-full shadow-xs cursor-default transition-all duration-300`}
    >
      <div>
        {/* Icon container */}
        <div className="w-12 h-12 rounded-[12px] bg-[#F5F1ED] border border-[#C7A05A]/40 flex items-center justify-center text-[#C7A05A] mb-7 shrink-0 shadow-xs">
          {icon}
        </div>
        {/* Title */}
        <h4 className="font-sans text-[17px] font-bold text-[#451F2D] mb-2.5">
          {title}
        </h4>
        {/* Description */}
        <p className="font-sans text-[14px] text-[#6B5B60] leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export const FeatureGrid: React.FC = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-6 md:px-8 pt-10 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        <FeatureCard
          index={0}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          }
          title="Transparent Reasoning"
          description="See every step of the analysis and debate."
        />

        <FeatureCard
          index={1}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          }
          title="Risk Detection"
          description="Uncover hidden risks before you act."
        />

        <FeatureCard
          index={2}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          }
          title="Evidence Based"
          description="Every claim backed by data and logic."
        />

        <FeatureCard
          index={3}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
          title="Decision Ready"
          description="Clear action plan with owners and timelines."
        />

        <FeatureCard
          index={4}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          }
          title="Export & Share"
          description="Share reports that build confidence instantly."
        />

      </div>
    </section>
  );
};

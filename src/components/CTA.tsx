import React from 'react';
import { Link } from 'react-router-dom';

export const CTA: React.FC = () => {
  return (
    <section className="bg-[#451F2D] border-t border-[#572A3B] py-20 px-6 md:px-12 text-left">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Heading */}
        <div className="lg:col-span-7 text-left">
          <h2 className="font-serif-heading text-[46px] md:text-[68px] leading-[1.05] font-light text-[#F5F1ED] tracking-tight">
            Ready to replace AI guesses with AI <span className="italic text-[#C7A05A] font-normal">reasoning?</span>
          </h2>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-5 text-left flex flex-col items-start">
          {/* Supporting paragraph */}
          <p className="font-sans text-[16px] md:text-[18px] text-[#E9DFDC]/90 leading-relaxed mb-10 max-w-[480px]">
            Launch Veritas AI and get recommendations you can trust and act on. Experience a platform built to debate itself before it advises you.
          </p>

          {/* Large Signature Gold CTA Button */}
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2.5 bg-[#C7A05A] text-[#451F2D] font-sans text-[17px] font-bold px-8 py-4.5 rounded-[12px] border border-[#DFC080] shadow-lg hover:bg-[#DFC080] transition-all hover:scale-[1.01] mb-3 shrink-0 group"
          >
            Launch Veritas AI
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 14 14" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#451F2D] transition-transform group-hover:translate-x-0.5"
            >
              <path 
                d="M1.16669 7H12.8334M12.8334 7L7.00002 1.16667M12.8334 7L7.00002 12.8333" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Tiny Helper Info */}
          <span className="font-sans text-[13px] text-[#E9DFDC]/60 pl-1">
            No credit card required • Zero-latency local execution
          </span>
        </div>

      </div>
    </section>
  );
};

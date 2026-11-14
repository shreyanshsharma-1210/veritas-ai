import React from 'react';

export const ProblemSolution: React.FC = () => {
  return (
    <section id="problem-solution" className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12 pb-10 scroll-mt-24">
      <div className="relative border border-[#572A3B] rounded-[24px] bg-[#451F2D] shadow-xl grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#572A3B] overflow-hidden">
        
        {/* Center Divider Arrow (Visible only on desktop) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#C7A05A] border border-[#DFC080] items-center justify-center text-[#451F2D] z-10 shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>

        {/* LEFT COLUMN: The Problem */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row lg:flex-col xl:flex-row items-center gap-8 lg:gap-10 bg-[#371723]/90">
          {/* Scribble Illustration */}
          <div className="w-full max-w-[200px] flex items-center justify-center shrink-0">
            <svg 
              width="180" 
              height="180" 
              viewBox="0 0 180 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#9B747A]"
            >
              {/* Complex geometric wireframe scribble */}
              <circle cx="90" cy="90" r="70" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
              <circle cx="90" cy="90" r="50" stroke="currentColor" strokeWidth="0.75" />
              <circle cx="90" cy="90" r="30" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 4" />
              
              {/* Intersecting lines simulating complex path chaos */}
              <path d="M20 90H160" stroke="currentColor" strokeWidth="0.75" />
              <path d="M90 20V160" stroke="currentColor" strokeWidth="0.75" />
              
              {/* Diagonal lines */}
              <path d="M40.5 40.5L139.5 139.5" stroke="currentColor" strokeWidth="0.75" strokeDasharray="5 5" />
              <path d="M139.5 40.5L40.5 139.5" stroke="currentColor" strokeWidth="0.75" strokeDasharray="5 5" />
              
              {/* Random chaotic connecting nodes representing unvalidated guesses */}
              <path 
                d="M45 60 L75 45 L110 50 L135 75 L125 115 L95 135 L55 120 L45 60" 
                stroke="currentColor" 
                strokeWidth="1.25" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M60 70 L90 55 L120 70 L115 105 L80 115 L60 70" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              
              {/* Scattered x markers */}
              <path d="M50 50 L56 56 M56 50 L50 56" stroke="currentColor" strokeWidth="1.25" />
              <path d="M125 125 L131 131 M131 125 L125 131" stroke="currentColor" strokeWidth="1.25" />
              <path d="M110 40 L114 44 M114 40 L110 44" stroke="currentColor" strokeWidth="1.25" />
              <path d="M40 115 L44 119 M44 115 L40 119" stroke="currentColor" strokeWidth="1.25" />
            </svg>
          </div>

          {/* Text content */}
          <div className="flex-grow text-left">
            <span className="font-sans text-[12px] font-bold tracking-[0.2em] text-[#9B747A] uppercase">
              The Problem
            </span>
            <h3 className="font-serif-heading text-[42px] md:text-[54px] font-medium text-[#F5F1ED] mt-2.5 mb-6">
              Most AI gives answers.
            </h3>
            
            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#451F2D] border border-[#9B747A]/50 flex items-center justify-center text-[#9B747A] shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#E9DFDC]/85 leading-relaxed">
                  Generates recommendations without understanding
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#451F2D] border border-[#9B747A]/50 flex items-center justify-center text-[#9B747A] shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#E9DFDC]/85 leading-relaxed">
                  Doesn't challenge assumptions
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#451F2D] border border-[#9B747A]/50 flex items-center justify-center text-[#9B747A] shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#E9DFDC]/85 leading-relaxed">
                  Hides risks and uncertainty
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#451F2D] border border-[#9B747A]/50 flex items-center justify-center text-[#9B747A] shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#E9DFDC]/85 leading-relaxed">
                  Hard to trust, hard to justify
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Our Solution */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row lg:flex-col xl:flex-row items-center gap-8 lg:gap-10 bg-[#3E1B28]">
          {/* Text content */}
          <div className="flex-grow text-left order-1 md:order-1 lg:order-1 xl:order-1">
            <span className="font-sans text-[12px] font-bold tracking-[0.2em] text-[#C7A05A] uppercase">
              Our Solution
            </span>
            <h3 className="font-serif-heading text-[42px] md:text-[54px] font-medium text-[#F5F1ED] mt-2.5 mb-6">
              Veritas AI earns them.
            </h3>
            
            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#C7A05A] border border-[#DFC080] flex items-center justify-center text-[#451F2D] shrink-0 mt-0.5 shadow-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#F5F1ED] font-medium leading-relaxed">
                  Deep diagnosis of your business context
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#C7A05A] border border-[#DFC080] flex items-center justify-center text-[#451F2D] shrink-0 mt-0.5 shadow-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#F5F1ED] font-medium leading-relaxed">
                  Two AI experts debate every proposal
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#C7A05A] border border-[#DFC080] flex items-center justify-center text-[#451F2D] shrink-0 mt-0.5 shadow-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#F5F1ED] font-medium leading-relaxed">
                  Objections resolved with evidence
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#C7A05A] border border-[#DFC080] flex items-center justify-center text-[#451F2D] shrink-0 mt-0.5 shadow-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="font-sans text-[16px] text-[#F5F1ED] font-medium leading-relaxed">
                  Transparent, trustworthy recommendations
                </span>
              </li>
            </ul>
          </div>

          {/* Concentric Circles Illustration */}
          <div className="w-full max-w-[200px] flex items-center justify-center shrink-0 order-2 md:order-2 lg:order-2 xl:order-2">
            <svg 
              width="180" 
              height="180" 
              viewBox="0 0 180 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#C7A05A]"
            >
              {/* Concentric rings representing structured alignment */}
              <circle cx="90" cy="90" r="75" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
              <circle cx="90" cy="90" r="60" stroke="currentColor" strokeWidth="1" />
              <circle cx="90" cy="90" r="45" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 2" />
              <circle cx="90" cy="90" r="30" stroke="currentColor" strokeWidth="1.5" />
              
              {/* Center checked badge in signature gold */}
              <circle cx="90" cy="90" r="16" fill="#C7A05A" />
              <path 
                d="M85 90L88.5 93.5L95 86.5" 
                stroke="#451F2D" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
};

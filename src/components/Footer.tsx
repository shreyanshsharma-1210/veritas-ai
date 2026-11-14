import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#30272A] border-t border-[#4A3A40] py-8 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Logo & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Veritas AI Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-serif-heading text-[18px] tracking-wider font-bold text-[#F5F1ED]">
              VERITAS AI
            </span>
          </div>
          <span className="hidden sm:inline-block text-[#4A3A40]">|</span>
          <span className="font-serif-heading text-[15px] italic text-[#C7A05A]">
            Diagnose. Debate. Decide.
          </span>
        </div>

        {/* Right: Copyright & Attribution */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-1 sm:gap-4 font-sans text-[13px] text-[#E9DFDC]/70">
          <span>
            © 2026 Veritas AI
          </span>
          <span className="hidden sm:inline-block text-[#4A3A40]">·</span>
          <span className="flex items-center gap-1">
            Made with <span className="text-[#C7A05A]">♥</span> for builders.
          </span>
        </div>

      </div>
    </footer>
  );
};

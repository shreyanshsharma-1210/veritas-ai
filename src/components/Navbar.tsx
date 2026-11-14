import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="h-[76px] border-b border-[#E2D9D4] bg-[#F5F1ED] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Veritas AI Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif-heading text-[20px] tracking-wider font-bold text-[#451F2D]">
              VERITAS AI
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-9">
          <a 
            href="#problem-solution" 
            className="font-sans text-[15px] font-semibold text-[#451F2D]/80 hover:text-[#C7A05A] transition-colors"
          >
            Product
          </a>
          <a 
            href="#technology" 
            className="font-sans text-[15px] font-semibold text-[#451F2D]/80 hover:text-[#C7A05A] transition-colors"
          >
            Technology
          </a>
          <a 
            href="#working" 
            className="font-sans text-[15px] font-semibold text-[#451F2D]/80 hover:text-[#C7A05A] transition-colors"
          >
            Working
          </a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-sans text-[15px] font-semibold text-[#451F2D]/80 hover:text-[#C7A05A] transition-colors inline-flex items-center gap-1.5"
          >
            GitHub
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-[#9B747A]"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </a>
        </div>

        {/* Right Action Button */}
        <div>
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2.5 bg-[#451F2D] text-[#F5F1ED] border border-[#C7A05A]/40 px-6 py-2.5 rounded-[12px] font-sans text-[14px] font-semibold hover:bg-[#371723] hover:border-[#C7A05A] hover:shadow-md transition-all group"
          >
            Launch Veritas AI
            <svg 
              width="14" 
              height="14" 
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
        </div>
      </div>
    </nav>
  );
};

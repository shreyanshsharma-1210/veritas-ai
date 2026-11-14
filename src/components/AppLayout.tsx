import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { 
  Compass, 
  PlusCircle, 
  History, 
  Settings, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col selection:bg-[#451F2D] selection:text-[#F5F1ED]">
      {/* Top Header */}
      <header className="h-[72px] border-b border-[#E2D9D4] bg-[#F5F1ED] sticky top-0 z-50 shadow-xs">
        <div className="max-w-[1440px] mx-auto h-full px-6 md:px-10 flex items-center justify-between">
          {/* Left: Brand & Return */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Veritas AI Logo"
                className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-serif-heading text-[19px] tracking-wider font-bold text-[#451F2D] block leading-none">
                  VERITAS AI
                </span>
                <span className="font-sans text-[10px] tracking-widest text-[#94858A] uppercase font-semibold">
                  Decision Intelligence
                </span>
              </div>
            </Link>

            <div className="hidden sm:block h-6 w-[1px] bg-[#E2D9D4]"></div>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-[#6B5B60] hover:text-[#C7A05A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Overview
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 md:gap-3">
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] font-sans text-[14px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#451F2D] text-[#F5F1ED] border border-[#C7A05A]/30 shadow-xs'
                    : 'text-[#6B5B60] hover:text-[#451F2D] hover:bg-[#E9DFDC]/50'
                }`
              }
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>

            <NavLink
              to="/app/new"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] font-sans text-[14px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#451F2D] text-[#F5F1ED] border border-[#C7A05A]/30 shadow-xs'
                    : 'text-[#6B5B60] hover:text-[#451F2D] hover:bg-[#E9DFDC]/50'
                }`
              }
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Diagnosis</span>
            </NavLink>

            <NavLink
              to="/app/history"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] font-sans text-[14px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#451F2D] text-[#F5F1ED] border border-[#C7A05A]/30 shadow-xs'
                    : 'text-[#6B5B60] hover:text-[#451F2D] hover:bg-[#E9DFDC]/50'
                }`
              }
            >
              <History className="w-4 h-4" />
              <span className="hidden md:inline">History</span>
            </NavLink>

            <NavLink
              to="/app/settings"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3 py-2 rounded-[10px] font-sans text-[14px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#451F2D] text-[#F5F1ED] border border-[#C7A05A]/30 shadow-xs'
                    : 'text-[#6B5B60] hover:text-[#451F2D] hover:bg-[#E9DFDC]/50'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </NavLink>
          </nav>

          {/* Right Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 bg-[#FAF8F5] border border-[#C7A05A]/40 px-3 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#C7A05A] animate-pulse"></span>
            <span className="font-sans text-[11px] font-bold text-[#C7A05A] tracking-wider uppercase">
              Agent Engine Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-grow max-w-[1440px] w-full mx-auto px-6 md:px-10 py-8">
        <Outlet />
      </main>

      {/* Sub-Footer */}
      <footer className="border-t border-[#E2D9D4] py-4 px-6 md:px-10 bg-[#F5F1ED] text-center">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#94858A] font-sans gap-2">
          <span>Veritas AI &mdash; Diagnose &rarr; Debate &rarr; Decide</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C7A05A]" />
            Deterministic Reasoning Engine &bull; Max 3-Round Enforced Loop
          </span>
        </div>
      </footer>
    </div>
  );
};


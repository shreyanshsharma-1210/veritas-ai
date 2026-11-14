import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { StatsBar } from '../components/StatsBar';
import { ProblemSolution } from '../components/ProblemSolution';
import { Methodology } from '../components/Methodology';
import { FeatureGrid } from '../components/FeatureGrid';
import { Technology } from '../components/Technology';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

const ScrollReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  );
};

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col selection:bg-[#451F2D] selection:text-[#F5F1ED]">
      {/* 1. NAVIGATION */}
      <Navbar />

      <main className="flex-grow">
        {/* 2. HERO (including DashboardPreview) */}
        <Hero />

        {/* 3. STATS BAR */}
        <ScrollReveal>
          <StatsBar />
        </ScrollReveal>

        {/* 4. PROBLEM VS SOLUTION */}
        <ScrollReveal>
          <ProblemSolution />
        </ScrollReveal>

        {/* 5. HOW VERITAS AI WORKS (Methodology) */}
        <ScrollReveal>
          <Methodology />
        </ScrollReveal>

        {/* 6. FEATURE ROW (FeatureGrid) */}
        <ScrollReveal>
          <FeatureGrid />
        </ScrollReveal>

        {/* 7. TECHNOLOGY & SYSTEM ARCHITECTURE */}
        <ScrollReveal>
          <Technology />
        </ScrollReveal>

        {/* 8. FINAL CTA */}
        <ScrollReveal>
          <CTA />
        </ScrollReveal>
      </main>

      {/* 9. FOOTER */}
      <Footer />
    </div>
  );
};


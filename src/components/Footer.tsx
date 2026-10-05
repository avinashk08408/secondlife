import React from 'react';
import { Sparkles, Leaf } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'inventory' | 'projects' | 'sustainability') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-[#E2DDD4] bg-[#FAF8F2] py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#EAE4D7]">
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#1F211F] flex items-center justify-center text-[#FAF8F2]">
                <Sparkles className="w-3.5 h-3.5 text-[#8D5A44]" />
              </div>
              <span className="text-xl font-normal font-display text-[#1F211F] tracking-tight">
                SECONDLIFE
              </span>
            </div>
            <p className="text-xs text-[#535550] leading-relaxed">
              Smart e-waste repurposing platform connecting discarded microcontrollers and maker
              sensors with actionable DIY hardware blueprints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#535550]">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#8D5A44] transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="hover:text-[#8D5A44] transition-colors"
            >
              Component Inventory
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="hover:text-[#8D5A44] transition-colors"
            >
              Smart Matching
            </button>
            <button
              onClick={() => onNavigate('sustainability')}
              className="hover:text-[#8D5A44] transition-colors"
            >
              Impact Dashboard
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#73756F]">
          <p>© {new Date().getFullYear()} SECONDLIFE Platform. Circular electronics engineering for maker communities.</p>
          <div className="flex items-center gap-2 text-[#535550]">
            <Leaf className="w-3.5 h-3.5 text-[#2E5E4E]" />
            <span>Empowering zero-waste hardware prototyping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

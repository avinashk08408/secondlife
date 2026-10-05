import React, { useState } from 'react';
import { Menu, X, Plus, Sparkles, Box, Compass, Activity, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'inventory' | 'projects' | 'sustainability';
  setActiveTab: (tab: 'home' | 'inventory' | 'projects' | 'sustainability') => void;
  inventoryCount: number;
  readyProjectsCount: number;
  onOpenAddComponent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  inventoryCount,
  readyProjectsCount,
  onOpenAddComponent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home' as const, label: 'Overview', icon: Compass },
    { id: 'inventory' as const, label: 'Component Inventory', icon: Box, badge: inventoryCount },
    { id: 'projects' as const, label: 'Smart Matching', icon: Layers, badge: readyProjectsCount > 0 ? `${readyProjectsCount} Ready` : undefined },
    { id: 'sustainability' as const, label: 'Impact Dashboard', icon: Activity },
  ];

  const handleNavClick = (tab: 'home' | 'inventory' | 'projects' | 'sustainability') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E2DDD4] shadow-[0_1px_4px_rgba(31,33,31,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D5A44] rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1F211F] group-hover:bg-[#8D5A44] flex items-center justify-center text-[#FAF8F2] shadow-xs transition-colors">
            <Sparkles className="w-4 h-4 text-[#FAF8F2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-display tracking-tight text-[#1F211F]">
              SECONDLIFE
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#8D5A44] -mt-1 font-semibold">
              Deep-Tech Upcycling
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D5A44] ${
                  isActive
                    ? 'text-[#1F211F] bg-[#F2EDE2] border border-[#D8D2C5] font-semibold shadow-xs'
                    : 'text-[#535550] hover:text-[#1F211F] hover:bg-[#F5F0E6]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      isActive
                        ? 'bg-[#8D5A44]/15 text-[#8D5A44] border border-[#8D5A44]/30 font-semibold'
                        : 'bg-[#EAE4D7] text-[#62635D] border border-[#DDD6C8]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Font Switcher & Primary CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddComponent}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D5A44] whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Component</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#535550] hover:text-[#1F211F] rounded-lg hover:bg-[#F2EDE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D5A44]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#FAF8F2] border-b border-[#E2DDD4] shadow-lg space-y-2 animate-in fade-in">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#1F211F] bg-[#F2EDE2] border border-[#D8D2C5]'
                    : 'text-[#535550] hover:bg-[#F2EDE2] hover:text-[#1F211F]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[#EAE4D7] text-[#1F211F] font-mono tabular-nums border border-[#DDD6C8]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

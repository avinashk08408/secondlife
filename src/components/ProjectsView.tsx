import React, { useState } from 'react';
import {
  ProjectFeasibilityResult,
  ProjectCategory,
  ProjectDifficulty,
} from '../types';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Zap,
  Layers,
} from 'lucide-react';

interface ProjectsViewProps {
  feasibilityResults: ProjectFeasibilityResult[];
  onSelectProject: (projectId: string) => void;
  onQuickAddMissing: (projectId: string) => void;
}

type FeasibilityFilter = 'All' | '100% Ready' | 'Nearly Ready (>50%)';
type DifficultyFilter = 'All' | ProjectDifficulty;
type CategoryFilter = 'All' | ProjectCategory;

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  feasibilityResults,
  onSelectProject,
  onQuickAddMissing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feasibilityFilter, setFeasibilityFilter] = useState<FeasibilityFilter>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  const filteredResults = feasibilityResults.filter((item) => {
    const { project, feasibilityPercent } = item;

    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.subtitle.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.requiredComponents.some((c) => c.name.toLowerCase().includes(query));

    // Feasibility filter
    let matchesFeasibility = true;
    if (feasibilityFilter === '100% Ready') {
      matchesFeasibility = feasibilityPercent === 100;
    } else if (feasibilityFilter === 'Nearly Ready (>50%)') {
      matchesFeasibility = feasibilityPercent >= 50 && feasibilityPercent < 100;
    }

    // Difficulty filter
    const matchesDifficulty =
      difficultyFilter === 'All' || project.difficulty === difficultyFilter;

    // Category filter
    const matchesCategory =
      categoryFilter === 'All' || project.category === categoryFilter;

    return matchesSearch && matchesFeasibility && matchesDifficulty && matchesCategory;
  });

  const readyCount = feasibilityResults.filter((r) => r.feasibilityPercent === 100).length;
  const partialCount = feasibilityResults.filter(
    (r) => r.feasibilityPercent >= 50 && r.feasibilityPercent < 100
  ).length;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8D5A44] bg-[#FAF8F2] border border-[#DCD6C9] px-3 py-1 rounded-full shadow-xs mb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#8D5A44]" />
            <span className="uppercase tracking-wider font-mono text-[11px] font-bold">
              Smart Matching Engine & Project Schematics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal font-display text-[#1F211F] tracking-tight">
            Smart Matching & Project Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#535550] mt-1">
            Real-time hardware feasibility computed by matching your active component drawer against DIY blueprints.
          </p>
        </div>

        {/* Quick status summary */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-xs font-mono text-[#2E5E4E] font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2E5E4E] animate-pulse" />
            <span>{readyCount} Ready to Build</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-xs font-mono text-[#8D5A44] font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#8D5A44]" />
            <span>{partialCount} Nearly Ready</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#8A8B84] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, sensor, or microcontroller..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] placeholder-[#8A8B84] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#8D5A44] focus:ring-1 focus:ring-[#8D5A44] transition-colors"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-3">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#8D5A44] transition-colors"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#8D5A44] transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="Robotics">Robotics</option>
              <option value="Green Tech">Green Tech</option>
              <option value="Instruments & Clocks">Instruments & Clocks</option>
              <option value="Lighting">Lighting</option>
              <option value="Home Automation">Home Automation</option>
            </select>
          </div>
        </div>

        {/* Feasibility Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#EAE4D7]">
          <span className="text-xs text-[#62635D] flex items-center gap-1.5 mr-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#8D5A44]" />
            <span>Feasibility:</span>
          </span>

          {(['All', '100% Ready', 'Nearly Ready (>50%)'] as FeasibilityFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFeasibilityFilter(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                feasibilityFilter === tab
                  ? 'bg-[#1F211F] text-[#FAF8F2] font-semibold shadow-xs'
                  : 'bg-[#F2EDE2] hover:bg-[#EAE4D7] text-[#535550] hover:text-[#1F211F] border border-[#DCD6C9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      {filteredResults.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs space-y-3">
          <Filter className="w-10 h-10 text-[#8A8B84] mx-auto" />
          <h3 className="text-base font-normal font-display text-[#1F211F]">No matching blueprints</h3>
          <p className="text-xs text-[#62635D] max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see more projects.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFeasibilityFilter('All');
              setDifficultyFilter('All');
              setCategoryFilter('All');
            }}
            className="px-4 py-2 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResults.map((item) => {
            const { project, feasibilityPercent, isFullyReady, totalRequired, satisfiedCount, matchStatuses } = item;
            const missingCount = totalRequired - satisfiedCount;

            return (
              <div
                key={project.id}
                className="group flex flex-col rounded-xl overflow-hidden bg-[#FFFFFF] border border-[#E2DDD4] hover:border-[#8D5A44]/50 transition-all hover:shadow-md"
              >
                {/* Image & Header */}
                <div className="aspect-[16/9] relative overflow-hidden bg-[#F2EDE2]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F211F]/70 via-transparent to-transparent" />

                  {/* Feasibility score indicator */}
                  <div className="absolute top-3.5 right-3.5">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-md shadow-sm font-mono tabular-nums ${
                        isFullyReady
                          ? 'bg-[#2E5E4E] text-[#FAF8F2] font-bold'
                          : feasibilityPercent >= 50
                          ? 'bg-[#8D5A44] text-[#FAF8F2] font-bold'
                          : 'bg-[#FAF8F2]/95 text-[#1F211F] border border-[#E2DDD4]'
                      }`}
                    >
                      {feasibilityPercent}% Feasibility
                    </span>
                  </div>

                  {/* Badges on bottom of thumbnail */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#FAF8F2]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.difficulty}</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[11px] bg-[#1F211F]/80 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-[#E0D9CC]" />
                      <span>{project.estimatedBuildTimeMinutes}m build</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-normal font-display text-[#1F211F] group-hover:text-[#8D5A44] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#535550] mt-1.5 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Component Requirements Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-[#EAE4D7]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#62635D] font-medium">Required Components</span>
                      <span className="font-mono font-semibold text-[#1F211F]">
                        {satisfiedCount}/{totalRequired} in stock
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-[#EAE4D7] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isFullyReady
                            ? 'bg-[#2E5E4E]'
                            : feasibilityPercent >= 50
                            ? 'bg-[#8D5A44]'
                            : 'bg-[#A8A49C]'
                        }`}
                        style={{ width: `${feasibilityPercent}%` }}
                      />
                    </div>

                    {/* Component Chips List */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {matchStatuses.map((status, idx) => (
                        <div
                          key={idx}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono ${
                            status.isSatisfied
                              ? 'bg-[#2E5E4E]/10 text-[#2E5E4E] border border-[#2E5E4E]/25'
                              : 'bg-[#8D5A44]/10 text-[#8D5A44] border border-[#8D5A44]/25'
                          }`}
                        >
                          {status.isSatisfied ? (
                            <CheckCircle2 className="w-3 h-3 text-[#2E5E4E] shrink-0" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[#8D5A44] shrink-0" />
                          )}
                          <span>{status.required.name}</span>
                          <span className="text-[10px] opacity-75">
                            ({status.ownedQuantity}/{status.required.requiredQuantity})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#EAE4D7]">
                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-[#1F211F] hover:text-[#FAF8F2] bg-[#FAF8F2] hover:bg-[#1F211F] rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-[#DCD6C9]"
                    >
                      <span>Inspect Feasibility & Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8D5A44]" />
                    </button>

                    {!isFullyReady && (
                      <button
                        onClick={() => onQuickAddMissing(project.id)}
                        title="Simulate acquiring all missing components to test 100% build"
                        className="py-2 px-3 text-xs font-medium text-[#8D5A44] hover:text-[#FAF8F2] bg-[#8D5A44]/10 hover:bg-[#8D5A44] border border-[#8D5A44]/25 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#8D5A44]" />
                        <span>Quick-Stock ({missingCount})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

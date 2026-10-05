import React, { useState } from 'react';
import {
  ProjectFeasibilityResult,
  RequiredComponent,
} from '../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  Leaf,
  Plus,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface ProjectDetailModalProps {
  feasibilityResult: ProjectFeasibilityResult | null;
  onClose: () => void;
  onAddMissingComponent: (required: RequiredComponent) => void;
  onMarkAsBuilt: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  feasibilityResult,
  onClose,
  onAddMissingComponent,
  onMarkAsBuilt,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'assembly' | 'impact'>('checklist');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!feasibilityResult) return null;

  const { project, feasibilityPercent, isFullyReady, satisfiedCount, totalRequired, matchStatuses } =
    feasibilityResult;

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F211F]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F2] border border-[#DCD6C9] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="relative p-6 bg-[#F2EDE2] border-b border-[#E2DDD4] flex items-start justify-between gap-4">
          <div className="space-y-1.5 pr-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#62635D]">
              <span className="text-[#8D5A44] font-semibold">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.difficulty} Level</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#8D5A44]" />
                {project.estimatedBuildTimeMinutes} mins
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-normal font-display text-[#1F211F] tracking-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#535550] leading-relaxed max-w-2xl">
              {project.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 p-2 text-[#73756F] hover:text-[#1F211F] hover:bg-[#EAE4D7] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Feasibility Engine Bar */}
        <div className="p-4 bg-[#FAF8F2] border-b border-[#E2DDD4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <div
                className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-extrabold border ${
                  isFullyReady
                    ? 'bg-[#2E5E4E]/10 border-[#2E5E4E]/30 text-[#2E5E4E]'
                    : feasibilityPercent >= 50
                    ? 'bg-[#8D5A44]/10 border-[#8D5A44]/30 text-[#8D5A44]'
                    : 'bg-[#C47D3B]/10 border-[#C47D3B]/30 text-[#C47D3B]'
                }`}
              >
                <span className="text-lg leading-none">{feasibilityPercent}%</span>
                <span className="text-[9px] uppercase tracking-wider mt-0.5 font-sans font-semibold">Match</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#1F211F] tracking-wide uppercase">
                  {isFullyReady
                    ? '100% Ready to Build'
                    : feasibilityPercent >= 50
                    ? 'Nearly Ready (Few Parts Needed)'
                    : 'Parts Acquisition Required'}
                </h3>
                {isFullyReady && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2E5E4E]/10 text-[#2E5E4E] border border-[#2E5E4E]/25">
                    All Components In Stock
                  </span>
                )}
              </div>
              <p className="text-xs text-[#535550] mt-0.5">
                You own{' '}
                <strong className="text-[#1F211F] font-mono">{satisfiedCount}</strong> of{' '}
                <strong className="text-[#1F211F] font-mono">{totalRequired}</strong> required components in
                adequate quantities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[#73756F] block text-[11px]">E-Waste Diverted</span>
              <span className="text-[#2E5E4E] font-bold">{project.environmentalImpact.divertedGrams}g</span>
            </div>
            <div className="text-right">
              <span className="text-[#73756F] block text-[11px]">CO₂ Prevented</span>
              <span className="text-[#8D5A44] font-bold">
                {project.environmentalImpact.preventedCo2Kg}kg
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-[#F2EDE2]/70 border-b border-[#E2DDD4]">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'checklist'
                ? 'border-[#1F211F] text-[#1F211F]'
                : 'border-transparent text-[#62635D] hover:text-[#1F211F]'
            }`}
          >
            Component Checklist & Salvage Tips
          </button>
          <button
            onClick={() => setActiveTab('assembly')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'assembly'
                ? 'border-[#1F211F] text-[#1F211F]'
                : 'border-transparent text-[#62635D] hover:text-[#1F211F]'
            }`}
          >
            Step-by-Step Assembly Guide
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'impact'
                ? 'border-[#1F211F] text-[#1F211F]'
                : 'border-transparent text-[#62635D] hover:text-[#1F211F]'
            }`}
          >
            Tools & Eco-Impact
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Component Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#62635D]">
                  Color-coded live status based on your inventory drawer:
                </span>
                <span className="text-xs font-mono text-[#2E5E4E] font-semibold">
                  {satisfiedCount}/{totalRequired} Components Verified
                </span>
              </div>

              <div className="space-y-3">
                {matchStatuses.map((match, idx) => {
                  const req = match.required;
                  const isOwned = match.isSatisfied;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isOwned
                          ? 'bg-[#FFFFFF] border-[#2E5E4E]/30'
                          : 'bg-[#FFFFFF] border-[#E2DDD4]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">
                            {isOwned ? (
                              <CheckCircle2 className="w-5 h-5 text-[#2E5E4E]" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-[#8D5A44]" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-[#1F211F]">{req.name}</h4>
                              <span className="text-xs text-[#73756F]">({req.category})</span>
                            </div>

                            <div className="text-xs text-[#535550] mt-1 flex items-center gap-2 font-mono">
                              <span>Required: {req.requiredQuantity}x</span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={
                                  isOwned ? 'text-[#2E5E4E] font-bold' : 'text-[#8D5A44] font-bold'
                                }
                              >
                                In Stock: {match.ownedQuantity}x
                              </span>
                              {match.matchedComponent && (
                                <span className="text-[#73756F] text-[11px] truncate max-w-xs font-sans">
                                  (Matched from: "{match.matchedComponent.name}")
                                </span>
                              )}
                            </div>

                            {/* Salvage guidance */}
                            {req.salvageTip && (
                              <div className="mt-2 text-xs text-[#535550] bg-[#FAF8F2] p-2.5 rounded-lg border border-[#E2DDD4]">
                                <span className="font-semibold text-[#8D5A44] mr-1">
                                  Salvage Guide:
                                </span>
                                <span>{req.salvageTip}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action for missing components */}
                        {!isOwned && (
                          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                            {req.buyEstimatedCost && (
                              <span className="text-[11px] text-[#73756F] font-mono">
                                Est. Market: ~{req.buyEstimatedCost}
                              </span>
                            )}
                            <button
                              onClick={() => onAddMissingComponent(req)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#1F211F] hover:text-[#8D5A44] bg-[#FAF8F2] hover:bg-[#F2EDE2] border border-[#DCD6C9] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#8D5A44]" />
                              <span>Add to My Inventory</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Assembly Guide */}
          {activeTab === 'assembly' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E2DDD4] text-xs text-[#535550] space-y-1">
                <span className="font-semibold text-[#1F211F]">Maker Instructions & Checklist:</span>
                <p>
                  Check off each phase as you complete breadboarding, wire connections, and firmware
                  flashing.
                </p>
              </div>

              <div className="space-y-4">
                {project.steps.map((step) => {
                  const isChecked = completedSteps.includes(step.stepNumber);

                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#FAF8F2] border-[#2E5E4E]/40 text-[#535550]'
                          : 'bg-[#FFFFFF] border-[#E2DDD4] hover:border-[#8D5A44]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-[#2E5E4E] text-[#FAF8F2]'
                              : 'bg-[#F2EDE2] text-[#62635D] border border-[#DCD6C9]'
                          }`}
                        >
                          {isChecked ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                        </div>

                        <div className="flex-1 space-y-1">
                          <h4
                            className={`text-sm font-semibold transition-colors ${
                              isChecked ? 'line-through text-[#8A8B84]' : 'text-[#1F211F]'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-xs text-[#535550] leading-relaxed">
                            {step.description}
                          </p>

                          {step.pinWiringTip && (
                            <div className="mt-2 text-xs font-mono bg-[#FAF8F2] p-2 rounded border border-[#E2DDD4] text-[#1F211F]">
                              <span className="text-[#8D5A44]">Pinout: </span>
                              {step.pinWiringTip}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Eco-Impact & Tools */}
          {activeTab === 'impact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5E4E]">
                    <Leaf className="w-4 h-4 text-[#2E5E4E]" />
                    <span>Environmental Savings</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#535550] leading-relaxed">
                    <p>
                      Completing this project keeps{' '}
                      <strong className="text-[#1F211F] font-mono">
                        {project.environmentalImpact.divertedGrams}g
                      </strong>{' '}
                      of mixed electronic metals, solder, and PCB substrates out of domestic
                      landfills.
                    </p>
                    <p>
                      Prevents an estimated{' '}
                      <strong className="text-[#1F211F] font-mono">
                        {project.environmentalImpact.preventedCo2Kg}kg CO₂
                      </strong>{' '}
                      associated with manufacturing new replacement electronics.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1F211F]">
                    <Wrench className="w-4 h-4 text-[#8D5A44]" />
                    <span>Recommended Maker Tools</span>
                  </div>
                  <ul className="text-xs text-[#535550] space-y-1 list-disc list-inside">
                    {project.toolsNeeded.map((tool, idx) => (
                      <li key={idx}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E2DDD4] text-xs text-[#535550] leading-relaxed shadow-xs">
                <h4 className="font-semibold text-[#1F211F] mb-1">E-Waste Upcycling Note:</h4>
                Discarded electronics leak lead, cadmium, and brominated flame retardants into
                groundwater when buried in dumps. By recovering microcontrollers and passives for DIY
                prototyping, you directly extend component lifecycles.
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-[#F2EDE2] border-t border-[#E2DDD4] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#535550] text-center sm:text-left">
            {project.isCompleted ? (
              <span className="text-[#2E5E4E] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E5E4E]" />
                This project has already been marked as built!
              </span>
            ) : isFullyReady ? (
              <span className="text-[#2E5E4E] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2E5E4E]" />
                All components ready! Click below to complete build.
              </span>
            ) : (
              <span>
                Missing parts? You can still mark as built to simulate completing the prototype.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs text-[#1F211F] hover:text-[#8D5A44] bg-[#FAF8F2] hover:bg-[#FFFFFF] border border-[#DCD6C9] rounded-lg shadow-xs transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => onMarkAsBuilt(project.id)}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FAF8F2]" />
              <span>{project.isCompleted ? 'Re-Log Build' : 'Mark as Built'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ComponentItem,
  CompletedProjectLog,
  CommunityBadge,
  ProjectFeasibilityResult,
} from '../types';
import {
  Leaf,
  Scale,
  Award,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface SustainabilityViewProps {
  inventory: ComponentItem[];
  completedLogs: CompletedProjectLog[];
  feasibilityResults: ProjectFeasibilityResult[];
  badges: CommunityBadge[];
  onNavigateToProjects: () => void;
}

export const SustainabilityView: React.FC<SustainabilityViewProps> = ({
  inventory,
  completedLogs,
  feasibilityResults,
  badges,
  onNavigateToProjects,
}) => {
  // Calculations
  const inventoryWeightGrams = inventory.reduce(
    (acc, item) => acc + item.estimatedWeightGrams * item.quantity,
    0
  );
  const completedBuildsWeightGrams = completedLogs.reduce(
    (acc, log) => acc + log.divertedGrams,
    0
  );

  const totalDivertedGrams = inventoryWeightGrams + completedBuildsWeightGrams;
  const totalDivertedKg = (totalDivertedGrams / 1000).toFixed(2);
  const totalCo2PreventedKg = ((totalDivertedGrams / 1000) * 14).toFixed(2);

  const averageFeasibility =
    feasibilityResults.length > 0
      ? Math.round(
          feasibilityResults.reduce((acc, r) => acc + r.feasibilityPercent, 0) /
            feasibilityResults.length
        )
      : 0;

  // Monthly target: 2500g (2.5 kg)
  const monthlyTargetGrams = 2500;
  const progressPercent = Math.min(100, Math.round((totalDivertedGrams / monthlyTargetGrams) * 100));
  const remainingGrams = Math.max(0, monthlyTargetGrams - totalDivertedGrams);

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#8D5A44]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#C47D3B]" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-[#2E5E4E]" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-[#535550]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#C47D3B]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#2E5E4E]" />;
      default:
        return <Award className="w-5 h-5 text-[#8D5A44]" />;
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8D5A44] bg-[#FAF8F2] border border-[#DCD6C9] px-3 py-1 rounded-full shadow-xs mb-1.5">
          <Leaf className="w-3.5 h-3.5 text-[#2E5E4E]" />
          <span className="uppercase tracking-wider font-mono text-[11px] font-bold">
            Ecological Metrics & Carbon Offset Ledger
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-normal font-display text-[#1F211F] tracking-tight">
          Sustainability & Impact Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#535550] mt-1">
          Measurable ecological metrics reflecting your salvaged electronic components, circuit
          repurposing, and prevented greenhouse gases.
        </p>
      </div>

      {/* Gamified Impact Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors space-y-3">
          <div className="flex items-center justify-between text-xs text-[#62635D] font-medium">
            <span>Total E-Waste Diverted</span>
            <div className="w-7 h-7 rounded-md bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#2E5E4E]">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#2E5E4E] font-mono tabular-nums">
              {totalDivertedKg} <span className="text-base text-[#535550] font-sans">kg</span>
            </div>
            <p className="text-xs text-[#73756F] mt-1 font-mono">
              ({totalDivertedGrams}g components salvaged & built)
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors space-y-3">
          <div className="flex items-center justify-between text-xs text-[#62635D] font-medium">
            <span>CO₂ Lifecycle Prevented</span>
            <div className="w-7 h-7 rounded-md bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#8D5A44]">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#8D5A44] font-mono tabular-nums">
              {totalCo2PreventedKg} <span className="text-base text-[#535550] font-sans">kg</span>
            </div>
            <p className="text-xs text-[#73756F] mt-1">
              1 kg e-waste diverted ≈ 14 kg CO₂ lifecycle offset
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors space-y-3">
          <div className="flex items-center justify-between text-xs text-[#62635D] font-medium">
            <span>Project Feasibility Index</span>
            <div className="w-7 h-7 rounded-md bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#C47D3B]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#1F211F] font-mono tabular-nums">
              {averageFeasibility}%
            </div>
            <p className="text-xs text-[#73756F] mt-1">
              Average readiness score across all blueprints
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors space-y-3">
          <div className="flex items-center justify-between text-xs text-[#62635D] font-medium">
            <span>Repurposed Builds</span>
            <div className="w-7 h-7 rounded-md bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#1F211F]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#1F211F] font-mono tabular-nums">
              {completedLogs.length}
            </div>
            <p className="text-xs text-[#73756F] mt-1">
              Fully completed DIY hardware prototypes
            </p>
          </div>
        </div>
      </div>

      {/* Monthly E-Waste Target Progress Bar */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-normal font-display text-[#1F211F] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8D5A44] animate-pulse" />
              <span>Monthly Community E-Waste Target: 2.50 kg</span>
            </h3>
            <p className="text-xs text-[#535550] mt-0.5">
              Goal to catalog and divert 2,500 grams of electronic hardware from disposal this cycle.
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold font-mono text-[#2E5E4E] tabular-nums">
              {totalDivertedGrams} / {monthlyTargetGrams} g ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 rounded-full bg-[#EAE4D7] p-0.5 border border-[#DCD6C9] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2E5E4E] transition-all duration-700 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#73756F]">
          <span>{remainingGrams > 0 ? `${remainingGrams}g remaining to unlock monthly milestone` : 'Monthly target reached!'}</span>
          <span>Target resets at end of month</span>
        </div>
      </div>

      {/* Community Badges Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-normal font-display text-[#1F211F]">Community Badges & Achievements</h2>
          <p className="text-xs text-[#535550] mt-0.5">
            Milestones unlocked as you salvage parts, boost feasibility, and complete physical builds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-xl border transition-all ${
                badge.unlocked
                  ? 'bg-[#FFFFFF] border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50'
                  : 'bg-[#F4EFE6] border-[#E2DDD4] opacity-70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-[#FAF8F2] border border-[#E2DDD4]'
                      : 'bg-[#EAE4D7] border border-[#DDD6C8]'
                  }`}
                >
                  {renderBadgeIcon(badge.iconName)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-normal font-display text-[#1F211F]">{badge.name}</h4>
                    {badge.unlocked ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#2E5E4E]/10 text-[#2E5E4E] border border-[#2E5E4E]/25 font-mono uppercase">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAE4D7] text-[#73756F] border border-[#DCD6C9] font-mono uppercase">
                        In Progress
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#535550] leading-relaxed">{badge.description}</p>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] text-[#73756F] mb-1">
                      <span>Requirement</span>
                      <span className="font-mono text-[#1F211F]">{badge.requirementText}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#EAE4D7] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          badge.unlocked ? 'bg-[#8D5A44]' : 'bg-[#C2BCB0]'
                        }`}
                        style={{ width: `${badge.unlockProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Builds History Log */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-normal font-display text-[#1F211F]">Completed Repurposing Builds Log</h2>
          <p className="text-xs text-[#535550] mt-0.5">
            Audit trail of hardware projects verified and constructed with salvaged components.
          </p>
        </div>

        {completedLogs.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs space-y-3">
            <Wrench className="w-8 h-8 text-[#8A8B84] mx-auto" />
            <h4 className="text-base font-normal font-display text-[#1F211F]">No builds completed yet</h4>
            <p className="text-xs text-[#62635D] max-w-sm mx-auto">
              Select any project blueprint with high feasibility and click "Mark as Built" to log your
              first construction.
            </p>
            <button
              onClick={onNavigateToProjects}
              className="mt-2 px-4 py-2 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-xs transition-colors"
            >
              Explore Available Blueprints
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#E2DDD4] bg-[#FFFFFF] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2EDE2] text-[#1F211F] font-semibold border-b border-[#E2DDD4] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Project Blueprint</th>
                    <th className="py-3 px-3">Date Completed</th>
                    <th className="py-3 px-3 text-right">E-Waste Diverted</th>
                    <th className="py-3 px-3 text-right">CO₂ Prevented</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D7] font-mono">
                  {completedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF8F2] transition-colors">
                      <td className="py-3 px-4 font-sans font-semibold text-[#1F211F]">
                        {log.projectTitle}
                      </td>
                      <td className="py-3 px-3 text-[#535550]">{log.completedAt}</td>
                      <td className="py-3 px-3 text-right text-[#2E5E4E] font-bold">
                        {log.divertedGrams}g
                      </td>
                      <td className="py-3 px-3 text-right text-[#8D5A44] font-bold">
                        {log.preventedCo2Kg}kg
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#2E5E4E] bg-[#2E5E4E]/10 border border-[#2E5E4E]/25 px-2 py-0.5 rounded font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-[#2E5E4E]" />
                          Built & Diverted
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

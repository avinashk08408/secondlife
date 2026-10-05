import React from 'react';
import {
  ComponentItem,
  ProjectFeasibilityResult,
  CompletedProjectLog,
} from '../types';
import { HERO_IMAGE } from '../data/initialData';
import {
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Leaf,
  Cpu,
  Radio,
  Activity,
  Check,
  Zap,
} from 'lucide-react';

interface HomeViewProps {
  inventory: ComponentItem[];
  feasibilityResults: ProjectFeasibilityResult[];
  completedLogs: CompletedProjectLog[];
  onNavigate: (tab: 'inventory' | 'projects' | 'sustainability') => void;
  onSelectProject: (projectId: string) => void;
  onOpenAddComponent: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  inventory,
  feasibilityResults,
  completedLogs,
  onNavigate,
  onSelectProject,
}) => {
  const totalComponentsCount = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeightGrams = inventory.reduce(
    (acc, item) => acc + item.estimatedWeightGrams * item.quantity,
    0
  );
  const totalCo2Kg = ((totalWeightGrams / 1000) * 14).toFixed(2);
  const fullyReadyCount = feasibilityResults.filter((f) => f.feasibilityPercent === 100).length;

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300">
      {/* ========================================================
          HERO SECTION – Morphedo Structure with Avinashk-Web Parchment Palette:
          1. Eyebrow Tag / Pill (Product Engineering & Upcycling)
          2. High-Impact Headline with Lobster Two / Little Days / DaunPenh Styling
          3. Subtitle / Value Proposition in warm slate-ink
          4. Dual CTAs (Ink Black / Sienna Accent + Parchment Outline)
          5. Core Value Highlights (Zero-Waste, Verified Pinouts, Carbon Ledger)
          6. Hero Right Showcase: Hardware Prototype Workbench Card
          7. Trust & Metrics Strip below
      ======================================================== */}
      <section className="relative pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Avinashk Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F211F] bg-[#FAF8F2] border border-[#DCD6C9] px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#8D5A44] animate-pulse" />
              <span className="uppercase tracking-wide font-mono text-[11px] text-[#8D5A44] font-bold">
                Product Engineering & Hardware Upcycling
              </span>
            </div>

            {/* Main Headline with Stylized Heading Font */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-body text-[#1F211F] tracking-tight leading-[1.18] text-balance">
              We Accelerate Hardware Upcycling{' '}
              <span className="text-[#8D5A44]">
                from Concept to Working Device
              </span>
              .
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-[#535550] leading-relaxed max-w-xl font-normal">
              Don't discard broken electronics or idle maker boards. SECONDLIFE transforms salvaged
              microcontrollers, sensors, and power stages into verified DIY hardware blueprints—complete
              with pinout logic, bill of materials, and direct lifecycle CO₂ offset verification.
            </p>

            {/* Dual CTAs (Avinashk-Web Button System) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('projects')}
                className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-sm hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D5A44]"
              >
                <span>Explore Projects & Feasibility</span>
                <ArrowRight className="w-4 h-4 text-[#FAF8F2] stroke-[2.5]" />
              </button>

              <button
                onClick={() => onNavigate('inventory')}
                className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold font-display text-[#1F211F] hover:text-[#1F211F] bg-[#FAF8F2] hover:bg-[#F2ECE1] border border-[#DCD6C9] rounded-lg shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D5A44]"
              >
                <Box className="w-4 h-4 text-[#8D5A44]" />
                <span>Inventory My Components</span>
              </button>
            </div>

            {/* Key Value Checklist */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-[#535550]">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2E5E4E] stroke-[2.5]" />
                <span>Zero-Waste Hardware Prototyping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2E5E4E] stroke-[2.5]" />
                <span>Automated Pinout & Voltage Logic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2E5E4E] stroke-[2.5]" />
                <span>Direct Carbon Credit Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Hardware Workbench Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#E2DDD4] bg-[#FFFFFF] shadow-xl">
              {/* Card Image Banner */}
              <div className="aspect-[16/11] w-full relative bg-[#F2EDE2]">
                <img
                  src={HERO_IMAGE}
                  alt="Maker electronics workbench with salvaged circuits and microcontroller"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F211F]/80 via-[#1F211F]/25 to-transparent" />
                
                {/* Floating Top Pill */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-[#FAF8F2]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2DDD4] shadow-sm text-xs font-semibold text-[#1F211F]">
                    <ShieldCheck className="w-4 h-4 text-[#2E5E4E]" />
                    <span>Hardware Engineering Station</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#1F211F] text-[#FAF8F2] shadow-xs">
                    Live Engine Active
                  </span>
                </div>

                {/* Floating Project Preview Inside Image */}
                <div className="absolute bottom-3 left-4 right-4 p-3 bg-[#FAF8F2]/95 backdrop-blur-md rounded-xl border border-[#E2DDD4] shadow-md">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1F211F]">Ultrasonic Distance Radar</span>
                    <span className="font-mono font-bold text-[#2E5E4E] bg-[#2E5E4E]/10 px-2 py-0.5 rounded border border-[#2E5E4E]/25">
                      100% Ready to Build
                    </span>
                  </div>
                  <p className="text-[11px] text-[#535550]">
                    5 of 5 required components in active stock • Arduino Uno + HC-SR04 + Servo
                  </p>
                </div>
              </div>

              {/* Technical Capability Specs Bar */}
              <div className="p-5 bg-[#FAF8F2] border-t border-[#E2DDD4] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#62635D]">
                  <span className="font-semibold text-[#1F211F]">Pinout Compatibility Engine</span>
                  <span className="font-mono text-[#8D5A44] font-bold">
                    {feasibilityResults.length} Verified Blueprints
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2DDD4]">
                    <span className="text-[10px] text-[#73756F] uppercase tracking-wide font-mono block">Logic Level</span>
                    <span className="font-bold text-[#1F211F]">5.0V / 3.3V Safe</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2DDD4]">
                    <span className="text-[10px] text-[#73756F] uppercase tracking-wide font-mono block">BOM Cost</span>
                    <span className="font-bold text-[#2E5E4E]">$0 (100% Salvaged)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats Row – Trust Strip */}
        <div className="mt-12 pt-8 border-t border-[#E2DDD4]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8D5A44] font-mono mb-4 text-center sm:text-left">
            Accelerating circular hardware engineering across makers, labs & universities
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
              <p className="text-xs text-[#62635D] font-medium">Total Parts Logged</p>
              <p className="text-2xl font-bold font-display text-[#1F211F] font-mono tabular-nums mt-1">
                {totalComponentsCount}
              </p>
              <span className="text-[11px] text-[#73756F]">in active inventory drawer</span>
            </div>

            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
              <p className="text-xs text-[#62635D] font-medium">E-Waste Diverted</p>
              <p className="text-2xl font-bold font-display text-[#2E5E4E] font-mono tabular-nums mt-1">
                {totalWeightGrams}g
              </p>
              <span className="text-[11px] text-[#73756F]">landfill toxic scrap prevented</span>
            </div>

            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
              <p className="text-xs text-[#62635D] font-medium">Ready Builds</p>
              <p className="text-2xl font-bold font-display text-[#8D5A44] font-mono tabular-nums mt-1">
                {fullyReadyCount}
              </p>
              <span className="text-[11px] text-[#2E5E4E] font-semibold">100% stock verified</span>
            </div>

            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
              <p className="text-xs text-[#62635D] font-medium">CO₂ Emissions Prevented</p>
              <p className="text-2xl font-bold font-display text-[#1F211F] font-mono tabular-nums mt-1">
                {totalCo2Kg}kg
              </p>
              <span className="text-[11px] text-[#73756F]">certified lifecycle offset</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DOMAIN VERTICALS – Engineering Capabilities
      ======================================================== */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-[#8D5A44] uppercase tracking-wider font-mono">
            Domains of Expertise & Blueprints
          </p>
          <h2 className="text-xl sm:text-2xl font-normal font-body text-[#1F211F] mt-1">
            Engineered Hardware Upcycling Verticals
          </h2>
          <p className="text-xs sm:text-sm text-[#535550] mt-1">
            Standardized blueprints engineered to reclaim consumer electronic waste into functional devices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:shadow-md hover:border-[#8D5A44]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#8D5A44] mb-3.5">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">Robotics & Obstacle Detection</h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              Ultrasonic radars, sweep micro-servos, PWM controllers, and autonomous rangefinder systems.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:shadow-md hover:border-[#8D5A44]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#2E5E4E] mb-3.5">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">Agro-IoT & Green Technology</h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              Soil conductivity probes, automated solenoid irrigation, and precision water conservation monitors.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:shadow-md hover:border-[#8D5A44]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#8D5A44] mb-3.5">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">Smart Instrumentation & RTC</h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              Backlit liquid crystal displays, DHT sensors, environmental desk clocks, and telemetry logs.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:shadow-md hover:border-[#8D5A44]/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F2] border border-[#E2DDD4] flex items-center justify-center text-[#C47D3B] mb-3.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">Ambient Motion & Power Harvesting</h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              PIR infrared detectors, reclaimed 18650 lithium cells, and energy-efficient LED night luminaires.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          PROCESS SECTION – 4-Step Engineering Flow
      ======================================================== */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[#8D5A44] uppercase tracking-wider font-mono">
            Product Development Lifecycle
          </p>
          <h2 className="text-xl sm:text-2xl font-normal font-body text-[#1F211F] mt-1">
            Systematic Stages from E-Waste Scrap to Working Device
          </h2>
          <p className="text-xs sm:text-sm text-[#535550] mt-1">
            Systematic hardware flow engineered for zero-waste prototyping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#1F211F] text-[#FAF8F2] flex items-center justify-center font-mono text-xs font-bold mb-3">
              01
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">
              Inventory & Logic Audit
            </h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              Catalog discrete transistors, Arduino boards, salvaged relays, and batteries. Note working
              condition, unit weight, and pinout notes.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#1F211F] text-[#FAF8F2] flex items-center justify-center font-mono text-xs font-bold mb-3">
              02
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">
              Pinout Feasibility Engine
            </h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              Matching algorithm checks your components against schematics, calculating real-time feasibility
              scores and substitution recommendations.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#1F211F] text-[#FAF8F2] flex items-center justify-center font-mono text-xs font-bold mb-3">
              03
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">
              Schematics & Assembly
            </h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              Follow step-by-step assembly guides, verify 5V/3.3V logic rails, and wire breadboards with
              pre-tested pinout diagrams.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#1F211F] text-[#FAF8F2] flex items-center justify-center font-mono text-xs font-bold mb-3">
              04
            </div>
            <h3 className="text-base font-normal font-display text-[#1F211F]">
              Carbon Offset Ledger
            </h3>
            <p className="text-xs text-[#535550] mt-1.5 leading-relaxed">
              Mark projects as built to log diverted grams of hazardous e-waste and record verified CO₂
              emissions prevented into your ledger.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED PROJECTS SHOWCASE
      ======================================================== */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-[#8D5A44] uppercase tracking-wider font-mono">
              Production-Ready Schematics
            </p>
            <h2 className="text-xl sm:text-2xl font-normal font-body text-[#1F211F] mt-1">
              Featured Upcycling Blueprints
            </h2>
            <p className="text-xs sm:text-sm text-[#535550] mt-1">
              Readiness index dynamically computed against your active hardware inventory.
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#1F211F] hover:text-[#8D5A44] transition-colors"
          >
            <span>View All Blueprints</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8D5A44]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feasibilityResults.slice(0, 3).map((item) => {
            const { project, feasibilityPercent, isFullyReady, totalRequired, satisfiedCount } = item;
            return (
              <div
                key={project.id}
                className="group flex flex-col rounded-xl overflow-hidden bg-[#FFFFFF] border border-[#E2DDD4] hover:border-[#8D5A44]/50 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-[#F2EDE2]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F211F]/60 via-transparent to-transparent" />
                  
                  {/* Feasibility Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-sm font-mono tabular-nums ${
                        isFullyReady
                          ? 'bg-[#2E5E4E] text-[#FAF8F2] font-bold'
                          : feasibilityPercent >= 50
                          ? 'bg-[#8D5A44] text-[#FAF8F2] font-bold'
                          : 'bg-[#FAF8F2]/95 text-[#1F211F] border border-[#E2DDD4]'
                      }`}
                    >
                      {feasibilityPercent}% Ready
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 text-xs text-[#FAF8F2] font-medium flex items-center gap-2">
                    <span>{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.difficulty}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-normal font-display text-[#1F211F] group-hover:text-[#8D5A44] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#535550] mt-1 line-clamp-2 leading-relaxed">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#EAE4D7]">
                    <div className="flex items-center justify-between text-xs text-[#535550]">
                      <span>Inventory Match:</span>
                      <span className="font-mono font-semibold text-[#1F211F]">
                        {satisfiedCount} of {totalRequired} in stock
                      </span>
                    </div>

                    {/* Progress Bar */}
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

                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="w-full mt-2 py-2 px-3 text-xs font-semibold text-[#1F211F] hover:text-[#FAF8F2] bg-[#FAF8F2] hover:bg-[#1F211F] rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-[#DCD6C9]"
                    >
                      <span>Inspect Schematic & Build</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8D5A44]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sm:hidden text-center pt-2">
          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F211F] hover:text-[#8D5A44]"
          >
            <span>View All Blueprints</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8D5A44]" />
          </button>
        </div>
      </section>

      {/* ========================================================
          SUSTAINABILITY & CARBON OFFSET LEDGER CALLOUT
      ======================================================== */}
      <section className="rounded-2xl p-6 sm:p-8 bg-[#F4EFE6] border border-[#DDD6C8] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E5E4E] bg-[#FAF8F2] border border-[#2E5E4E]/30 px-2.5 py-1 rounded-md">
              <Leaf className="w-3.5 h-3.5 text-[#2E5E4E]" />
              <span>Certified Carbon & E-Waste Verification</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-normal font-display text-[#1F211F]">
              Transforming Silicon Scraps into Quantifiable Carbon Credits
            </h3>
            <p className="text-xs sm:text-sm text-[#535550] leading-relaxed">
              Every salvaged resistor, relay, and microcontroller prevents primary mining and PCB
              fabrication emissions. Track your personal carbon offset ledger with real-time audit logs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('sustainability')}
            className="shrink-0 px-5 py-2.5 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg transition-colors shadow-sm"
          >
            Inspect Carbon Ledger
          </button>
        </div>
      </section>
    </div>
  );
};

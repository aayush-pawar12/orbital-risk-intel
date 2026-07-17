import React, { useState } from "react";
import { Bolt, HardDrive, ShieldCheck, Zap } from "lucide-react";

interface OperationalProcedureProps {
  onLaunchMissionControl: () => void;
}

export default function OperationalProcedure({ onLaunchMissionControl }: OperationalProcedureProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: "01",
      title: "Telemetry Analysis",
      desc: "Ingesting live high-frequency sensor feeds and ephemeris vectors via the encrypted ORIS core link.",
      badge: "Ingress",
      colorClass: "border-red-600 dark:border-rose-500",
      icon: <Zap className="w-4 h-4 text-rose-500" />
    },
    {
      num: "02",
      title: "Conjunction Assessment",
      desc: "Cross-verifying target vectors against international catalog indices and secondary debris clusters.",
      badge: "Analysis",
      colorClass: "border-blue-500 dark:border-blue-400",
      icon: <HardDrive className="w-4 h-4 text-blue-400" />
    },
    {
      num: "03",
      title: "Maneuver Execution",
      desc: "Deploying autonomous station-keeping delta-V evasion bursts with real-time telemetry verification.",
      badge: "Execution",
      colorClass: "border-emerald-500 dark:border-emerald-400",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
    }
  ];

  return (
    <section
      id="operational"
      className="relative min-h-screen w-full flex items-center py-24 px-6 md:px-16 bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Intersecting vertical step nodes */}
          <div className="flex flex-col items-center justify-center gap-4 order-2 lg:order-1">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                {/* Step Card */}
                <div
                  onClick={() => setActiveStep(idx)}
                  className={`w-full max-w-md p-6 bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-2xl flex items-start gap-6 border-l-4 transition-all duration-300 cursor-pointer shadow-lg hover:translate-x-2 ${
                    step.colorClass
                  } ${
                    activeStep === idx
                      ? "border border-neutral-300 dark:border-white/20 bg-neutral-200/50 dark:bg-white/5 shadow-2xl"
                      : "border border-neutral-300/20 dark:border-white/5 opacity-80"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-white/5 flex items-center justify-center font-bold text-neutral-800 dark:text-neutral-200">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                        {step.title}
                      </span>
                      {step.icon}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Vertical Connector Path */}
                {idx < steps.length - 1 && (
                  <div className="w-px h-10 bg-gradient-to-b from-neutral-400/50 dark:from-white/10 to-transparent"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right Column: Title, paragraph, and CTA */}
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <div className="text-rose-500 dark:text-rose-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <Bolt className="w-4 h-4 text-rose-500 animate-pulse" />
              Protocol Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 uppercase tracking-tight leading-tight">
              Operational<br />Procedure
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
              ORIS operates on a highly secure, closed-loop autonomous cycle. From the microsecond anomaly triggers are detected in real-time sensor streams, our neural engines execute a series of high-fidelity conjunction calculations. The system packages optimized, ready-to-run maneuver profiles, sealing them into the immutable audit network and delivering options to aerospace operators in milliseconds.
            </p>
            
            <button
              onClick={onLaunchMissionControl}
              id="view-workflow-btn"
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/35 text-rose-200 backdrop-blur-md px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-3 w-fit transition-all duration-300 shadow-lg shadow-rose-950/20 hover:scale-[1.03] cursor-pointer"
            >
              Launch Mission Control
              <Bolt className="w-4 h-4 text-rose-300 animate-bounce" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

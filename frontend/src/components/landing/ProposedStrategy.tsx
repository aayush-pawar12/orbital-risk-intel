import React from "react";
import { BrainCircuit, Cpu, Globe, Sparkles } from "lucide-react";

export default function ProposedStrategy() {
  return (
    <section
      id="strategy"
      className="relative min-h-screen w-full flex items-center py-24 px-6 md:px-16 bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full z-10">
        
        {/* Title */}
        <div className="text-center mb-20">
          <div className="text-rose-500 dark:text-rose-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500 animate-spin" />
            The ORIS Solution
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 uppercase tracking-tight">
            Proposed Strategy
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Predictive AI model integration and real-time active response vectors engineered for autonomous aerospace asset resilience and mission preservation.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 - Neural Synthesis */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-2xl p-8 border border-neutral-300/30 dark:border-white/10 hover:border-rose-500/30 transition-all duration-300 group flex flex-col justify-between h-full shadow-lg">
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-red-600/10 dark:bg-rose-500/15 text-red-600 dark:text-rose-400 px-3 py-1 rounded-full border border-red-600/20 dark:border-rose-500/20">
                  Neural Synthesis
                </span>
                <BrainCircuit className="w-5 h-5 text-red-500 dark:text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Predictive AI
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Utilizing deep learning ensembles to forecast spacecraft conjunction events 72 hours before the Time of Closest Approach (TCA) with surgical telemetry precision.
              </p>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                <span>MODEL ACCURACY</span>
                <span>85% CONFIDENCE</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-white/5 rounded-full overflow-hidden border border-neutral-300/20 dark:border-white/5">
                <div className="h-full bg-gradient-to-r from-red-600 to-rose-400 w-[85%] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Card 2 - Mitigation */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-2xl p-8 border border-neutral-300/30 dark:border-white/10 hover:border-rose-500/30 transition-all duration-300 group flex flex-col justify-between h-full shadow-lg">
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-red-600/10 dark:bg-rose-500/15 text-red-600 dark:text-rose-400 px-3 py-1 rounded-full border border-red-600/20 dark:border-rose-500/20">
                  Active Response
                </span>
                <Cpu className="w-5 h-5 text-red-500 dark:text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Mitigation
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Dynamic automated maneuver generation that computes optimal fuel-efficient delta-V burns to completely negate debris collision probabilities.
              </p>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                <span>MANEUVER READINESS</span>
                <span>45% ACTIVE RANGE</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-white/5 rounded-full overflow-hidden border border-neutral-300/20 dark:border-white/5">
                <div className="h-full bg-gradient-to-r from-red-600 to-rose-400 w-[45%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Card 3 - Unified Intel */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-2xl p-8 border border-neutral-300/30 dark:border-white/10 hover:border-rose-500/30 transition-all duration-300 group flex flex-col justify-between h-full shadow-lg">
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-neutral-200/50 dark:bg-white/10 text-neutral-800 dark:text-neutral-300 px-3 py-1 rounded-full border border-neutral-300/40 dark:border-white/5">
                  Global Mesh
                </span>
                <Globe className="w-5 h-5 text-neutral-500 dark:text-neutral-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Unified Intel
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Federated sensor fusion engine combining radar arrays, optical scopes, and high-frequency satellite telemetry for a verified world-state database.
              </p>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                <span>TELEMETRY SYNC</span>
                <span>15% LATENT COHESION</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-white/5 rounded-full overflow-hidden border border-neutral-300/20 dark:border-white/5">
                <div className="h-full bg-neutral-400 dark:bg-white/30 w-[15%] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

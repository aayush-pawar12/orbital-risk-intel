import React from "react";
import { ShieldAlert, Zap, Layers } from "lucide-react";
import { motion } from "motion/react";

export default function IssueDescription() {
  return (
    <section
      id="issue"
      className="relative min-h-screen w-full flex items-center py-24 px-6 md:px-16 bg-transparent"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full">
        
        {/* Left Side: Technical Text Brief & floating stats */}
        <div className="flex flex-col justify-center">
          <div className="text-rose-500 dark:text-rose-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Congestion Crisis
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-neutral-900 dark:text-white mb-6 tracking-tight uppercase">
            Issue Description:<br />Orbital Gridlock
          </h2>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
            Low Earth Orbit (LEO) is facing an unprecedented surge in congestion. With thousands of new commercial satellites launching annually, the safe margins for error in avoiding orbital collisions are rapidly vanishing. Fragmented telemetry feeds, outdated tracking catalogs, and sluggish manual intervention systems are no longer sufficient to secure multi-billion dollar payloads from high-velocity debris impacts.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Stat Box 1 */}
            <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-6 rounded-2xl border border-neutral-300/30 dark:border-white/10 hover:border-rose-500/30 transition-all duration-300">
              <div className="text-red-600 dark:text-rose-400 text-3xl font-extrabold mb-1">
                27k+
              </div>
              <div className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                Tracked Debris Elements
              </div>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-6 rounded-2xl border border-neutral-300/30 dark:border-white/10 hover:border-rose-500/30 transition-all duration-300">
              <div className="text-red-600 dark:text-rose-400 text-3xl font-extrabold mb-1">
                7.8 km/s
              </div>
              <div className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                Average Orbital Velocity
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Map Frame with floating overlays */}
        <div className="relative flex items-center justify-center">
          <div className="w-full aspect-square bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl border border-neutral-300/30 dark:border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-6 group shadow-2xl">
            <img
              alt="Orbital Congestion Mapping"
              className="w-full h-full object-contain mix-blend-normal dark:mix-blend-screen scale-105 transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            src="/second-section.gif"
            />
          </div>

          {/* Floating warning badge */}
          <div className="absolute top-6 right-6 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-red-600/20">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            HIGH CONGESTION ZONE
          </div>
        </div>

      </div>
    </section>
  );
}

import React from "react";
import { Layers, Crosshair, Gauge, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function IssueDescription() {
  return (
    <section
      id="issue"
      className="relative min-h-screen w-full flex items-center py-24 px-6 md:px-16 bg-transparent"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full">
        
        {/* Left Side: Technical Text Brief & floating stats */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <div className="text-neutral-500 dark:text-neutral-400 text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-400" />
            OPERATIONAL CONTEXT
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-neutral-900 dark:text-white mb-6 tracking-tight uppercase">
            LEO Congestion &<br />Collision Risk
          </h2>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
            The proliferation of commercial constellations and orbital debris has degraded operational safety margins in Low Earth Orbit (LEO). High-velocity conjunction events require continuous Conjunction Assessment (CA), accurate orbit determination, and timely avoidance maneuver planning to maintain asset survivability and mission continuity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stat Box 1 */}
            <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-6 rounded-xl border border-neutral-300/40 dark:border-white/10 hover:border-neutral-400/60 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
              <div className="flex items-center gap-2 mb-3">
                <Crosshair className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-widest">
                  Cataloged RSOs
                </div>
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 text-3xl font-extrabold font-mono mb-2">
                27,000+
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Objects ≥10 cm tracked by the Space Surveillance Network (SSN)
              </p>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-6 rounded-xl border border-neutral-300/40 dark:border-white/10 hover:border-neutral-400/60 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-widest">
                  Mean Relative Velocity
                </div>
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 text-3xl font-extrabold font-mono mb-2">
                7.8 km/s
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Average closing velocity during LEO conjunctions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Visual Map Frame with floating overlays */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center h-full"
        >
          <div className="w-full aspect-square bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl border border-neutral-300/30 dark:border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-6 group shadow-2xl relative">
            
            {/* Subtle technical grid lines / orbital overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30 flex items-center justify-center">
               <div className="w-[150%] h-[150%] rounded-full border-[0.5px] border-neutral-400/50 dark:border-white/30 absolute"></div>
               <div className="w-[120%] h-[120%] rounded-full border-[0.5px] border-neutral-400/50 dark:border-white/30 absolute"></div>
               <div className="w-[90%] h-[90%] rounded-full border-[0.5px] border-neutral-400/50 dark:border-white/30 absolute"></div>
               {/* Crosshair grid */}
               <div className="w-full h-px bg-neutral-400/30 dark:bg-white/20 absolute top-1/2 -translate-y-1/2"></div>
               <div className="w-px h-full bg-neutral-400/30 dark:bg-white/20 absolute left-1/2 -translate-x-1/2"></div>
            </div>

            <img
              alt="Orbital Congestion Mapping"
              className="w-full h-full object-contain mix-blend-normal dark:mix-blend-screen scale-105 transition-transform duration-[2000ms] ease-out group-hover:scale-[1.12]"
              referrerPolicy="no-referrer"
              src="/second-section.gif"
            />
          </div>

          {/* Floating Top Badge */}
          <div className="absolute top-6 right-6 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md text-[9px] font-mono tracking-widest uppercase shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            LEO Regime
          </div>

          {/* Floating Data Overlay */}
          <div className="absolute bottom-6 left-6 p-4 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-300/50 dark:border-white/10 rounded-lg shadow-lg flex flex-col gap-3 min-w-[180px]">
             <div className="flex justify-between items-center text-[10px] font-mono border-b border-neutral-300/50 dark:border-white/10 pb-2">
                <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Active Payloads</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">8,420+</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-mono border-b border-neutral-300/50 dark:border-white/10 pb-2">
                <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Tracked Debris</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">27,000+</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                   <Activity className="w-3 h-3 text-rose-500" />
                   Recent Events
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">142</span>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

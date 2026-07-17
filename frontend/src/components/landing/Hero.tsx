import React from "react";
import { Satellite, ShieldAlert, Rocket, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onLaunchMissionControl: () => void;
  satelliteCount: number;
}

export default function Hero({ onLaunchMissionControl, satelliteCount }: HeroProps) {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-36 pb-16 px-6 md:px-16 overflow-hidden bg-transparent">
      {/* Absolute Centered Earth GIF with Glass backdrop */}
      <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
        <div className="w-full max-w-4xl flex items-center justify-center p-4 opacity-90">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 0.95 }}
            transition={{ duration: 2, ease: "easeOut" }}
            alt="Orbital Earth View"
            className="w-full h-auto max-h-[85vh] object-contain mix-blend-screen select-none"
            referrerPolicy="no-referrer"
            src="/hero-section.gif"
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto flex flex-col justify-between h-full gap-8">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-8">

          {/* Left Wing - Huge Typography */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-xl flex flex-col items-start gap-12 mt-4 lg:mt-12"
          >
            <h1 className="text-[60px] md:text-[86px] text-neutral-900 dark:text-white leading-[0.9] font-black tracking-tighter select-none font-sans uppercase">
              ORBIT<br />RISK<br />SYSTEM
            </h1>

            {/* Notification Bar */}
            <div className="flex items-center gap-4 bg-neutral-200/80 dark:bg-neutral-950/40 backdrop-blur-xl p-4 rounded-2xl border border-neutral-300/40 dark:border-white/10 shadow-2xl">
              <div className="bg-rose-500/15 p-3 rounded-xl flex items-center justify-center border border-rose-500/30">
                <Satellite className="w-5 h-5 text-red-500 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-neutral-900 dark:text-neutral-100 text-sm font-bold leading-tight">
                  Conjunction Data Message (CDM) Processing
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                  Continuous ingestion of tracking data for updated collision probability evaluation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Wing - Status & Mission Intro */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:flex flex-col items-end gap-6 max-w-xs text-left lg:text-right ml-0 lg:ml-auto mt-8 lg:mt-24"
          >

            {/* Active chip */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-200/50 dark:bg-neutral-950/40 backdrop-blur-xl border border-neutral-300/40 dark:border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-red-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-rose-500 animate-pulse"></span>
              SYSTEM NOMINAL
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-medium">
              Monitor spacecraft, evaluate conjunction risk, compute Time of Closest Approach (TCA), and verify mitigation strategies via the operational audit trail.
            </p>

            <button
              onClick={onLaunchMissionControl}
              id="access-intel-btn"
              className="bg-white/5 hover:bg-white/15 border border-white/10 text-white backdrop-blur-md px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all hover:translate-x-1 duration-300 shadow-md cursor-pointer"
            >
              View Architecture <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          </motion.div>

        </div>

        {/* Stats Cards Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 md:mt-8"
        >
          {/* Stat 1 */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-8 rounded-2xl border border-neutral-300/30 dark:border-white/10 flex flex-col justify-center relative group hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all duration-300">
            <span className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-4">
              TRACKING REGIMES
            </span>
            <span className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white leading-none tracking-tighter mb-4">
              LEO &middot; MEO &middot; GEO
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs">
              Low Earth Orbit &middot; Medium Earth Orbit &middot; Geostationary Orbit
            </p>
          </div>

          {/* Stat 2 */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-8 rounded-2xl border border-neutral-300/30 dark:border-white/10 flex flex-col items-center justify-center text-center group hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all duration-300">
            <span className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-4">
              RSO CATALOG
            </span>
            <span className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white leading-none tracking-tighter mb-6">
              27,000+ <span className="text-base md:text-lg text-neutral-500">RSOs</span>
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="bg-neutral-200/50 dark:bg-neutral-900/50 px-3 py-1 rounded-full border border-neutral-300/50 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Payload</span>
              </div>
              <div className="bg-neutral-200/50 dark:bg-neutral-900/50 px-3 py-1 rounded-full border border-neutral-300/50 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Debris</span>
              </div>
              <div className="bg-neutral-200/50 dark:bg-neutral-900/50 px-3 py-1 rounded-full border border-neutral-300/50 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Rocket Body</span>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-8 rounded-2xl border border-neutral-300/30 dark:border-white/10 flex flex-col justify-center relative group hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all duration-300">
            <span className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-4">
              SYSTEM STATUS
            </span>
            <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none tracking-tighter mb-4">
              OPERATIONAL
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed pr-6 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Data ingestion nominal. No critical alerts.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

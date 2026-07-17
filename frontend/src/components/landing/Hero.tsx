import React from "react";
import { Satellite, ShieldAlert, Rocket, ChevronRight, AlertCircle } from "lucide-react";
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
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto flex flex-col justify-between h-full gap-16">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-8">
          
          {/* Left Wing - Huge Typography */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-xl flex flex-col items-start gap-8"
          >
            <h1 className="text-6xl md:text-8xl text-neutral-900 dark:text-white leading-[0.9] font-black tracking-tighter select-none font-sans uppercase">
              Orbital<br />Risk<br />System
            </h1>

            {/* Notification Bar */}
            <div className="flex items-center gap-4 bg-neutral-200/80 dark:bg-neutral-950/40 backdrop-blur-xl p-4 rounded-2xl border border-neutral-300/40 dark:border-white/10 shadow-2xl">
              <div className="bg-rose-500/15 p-3 rounded-xl flex items-center justify-center border border-rose-500/30">
                <Satellite className="w-5 h-5 text-red-500 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-neutral-900 dark:text-neutral-100 text-sm font-bold leading-tight">
                  Real-Time Collision Prediction.
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                  Autonomous Risk Mitigation vectors active.
                </p>
              </div>
            </div>

            {/* CTA Initiate button */}
            <button
              onClick={onLaunchMissionControl}
              id="initiate-telemetry-btn"
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/35 text-rose-200 backdrop-blur-md px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center gap-3 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-rose-400 animate-bounce" />
              Initiate Telemetry Link
            </button>
          </motion.div>

          {/* Right Wing - Status & Mission Intro */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:flex flex-col items-end gap-6 max-w-xs text-left lg:text-right ml-0 lg:ml-auto mt-8 lg:mt-24"
          >
            {/* Hexagonal O logo */}
            <div className="w-14 h-14 bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-center items-center text-white font-extrabold text-2xl shadow-xl select-none">
              O
            </div>

            {/* Active chip */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-200/50 dark:bg-neutral-950/40 backdrop-blur-xl border border-neutral-300/40 dark:border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-red-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-rose-500 animate-pulse"></span>
              ORIS_CORE_ACTIVE
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-medium">
              Enterprise mission intelligence that instantly engages, builds trust, and drives protective maneuver actions in the orbital domain.
            </p>

            <button
              onClick={onLaunchMissionControl}
              id="access-intel-btn"
              className="bg-white/5 hover:bg-white/15 border border-white/10 text-white backdrop-blur-md px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all hover:translate-x-1 duration-300 shadow-md cursor-pointer"
            >
              Access Intel <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          </motion.div>

        </div>

        {/* Stats Cards Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {/* Stat 1 */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-8 rounded-2xl border border-neutral-300/30 dark:border-white/10 flex flex-col justify-between relative group hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all duration-300">
            <span className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-widest">
              Prediction Accuracy
            </span>
            <span className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white leading-none mt-4 tracking-tighter">
              99.9%
            </span>
            <ShieldAlert className="absolute bottom-8 right-8 text-3xl text-neutral-300 dark:text-white/10 group-hover:text-rose-500/40 transition-colors duration-300" />
          </div>

          {/* Stat 2 */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-8 rounded-2xl border border-neutral-300/30 dark:border-white/10 flex flex-col items-center justify-center text-center group hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all duration-300">
            <span className="text-neutral-900 dark:text-neutral-100 text-lg font-bold mb-4">
              {satelliteCount}+ Active Objects
            </span>
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center border-2 border-neutral-300 dark:border-neutral-950 text-neutral-600 dark:text-rose-400">
                <Satellite className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-500/10 dark:bg-rose-950/80 flex items-center justify-center border-2 border-neutral-300 dark:border-neutral-950 text-red-500 dark:text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center border-2 border-neutral-300 dark:border-neutral-950 text-neutral-600 dark:text-neutral-300">
                <Rocket className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-full bg-neutral-300/50 dark:bg-neutral-800/80 flex items-center justify-center text-xs font-bold border-2 border-neutral-300 dark:border-neutral-950 text-neutral-800 dark:text-neutral-300">
                +4k
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl p-8 rounded-2xl border border-neutral-300/30 dark:border-white/10 flex flex-col justify-center relative group hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-all duration-300">
            <span className="text-neutral-900 dark:text-neutral-100 font-bold text-lg mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Critical Alerts Handled
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed pr-6">
              Sophisticated automated telemetry ingestion and maneuver validation. AI-driven systems resolve anomalies instantaneously.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

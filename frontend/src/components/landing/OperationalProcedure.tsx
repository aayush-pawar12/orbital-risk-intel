import React, { useState } from "react";
import { Database, Activity, Crosshair, Play, Circle } from "lucide-react";
import { motion } from "motion/react";

interface OperationalProcedureProps {
  onLaunchMissionControl: () => void;
}

export default function OperationalProcedure({ onLaunchMissionControl }: OperationalProcedureProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: "01",
      title: "Data Ingestion",
      desc: "Import TLEs, CDMs, ephemerides, and sensor observations from integrated tracking providers.",
      chip: "INPUT",
      metric: "12ms latency",
      timestamp: "T-0:00:00",
      icon: <Database className="w-4 h-4 text-neutral-400" />
    },
    {
      num: "02",
      title: "Risk Assessment",
      desc: "Propagate orbital trajectories, detect close approaches, and calculate probability of collision using validated orbital mechanics models.",
      chip: "PROCESSING",
      metric: "145ms compute",
      timestamp: "T+0:00:12",
      icon: <Activity className="w-4 h-4 text-neutral-400" />
    },
    {
      num: "03",
      title: "Mitigation Planning",
      desc: "Generate fuel-efficient maneuver candidates, compare projected outcomes, and present the recommended avoidance strategy for operator approval.",
      chip: "OUTPUT",
      metric: "98.7% confidence",
      timestamp: "T+0:01:45",
      icon: <Crosshair className="w-4 h-4 text-neutral-400" />
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
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start justify-center gap-0 order-2 lg:order-1 relative"
          >
            {/* Pipeline Status Indicator */}
            <div className="flex items-center gap-2 mb-8 ml-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                Pipeline Status: Online
              </span>
            </div>

            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                {/* Step Card */}
                <div
                  onClick={() => setActiveStep(idx)}
                  className={`w-full max-w-md p-5 bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-xl flex items-start gap-4 border transition-all duration-300 cursor-pointer ${
                    activeStep === idx
                      ? "border-neutral-400/50 dark:border-white/20 bg-neutral-200/50 dark:bg-white/10 shadow-lg ml-2"
                      : "border-neutral-300/20 dark:border-white/5 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full border border-neutral-400/30 flex items-center justify-center font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                      {step.num}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {step.icon}
                        <h3 className="text-sm font-bold tracking-wide uppercase text-neutral-800 dark:text-neutral-200">
                          {step.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                        {step.chip}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
                      {step.desc}
                    </p>

                    <div className="flex items-center justify-between border-t border-neutral-300/30 dark:border-white/5 pt-2">
                      <span className="text-[9px] font-mono text-neutral-500">{step.timestamp}</span>
                      <span className="text-[9px] font-mono text-neutral-500">{step.metric}</span>
                    </div>
                  </div>
                </div>

                {/* Vertical Connector Path */}
                {idx < steps.length - 1 && (
                  <div className="w-px h-6 bg-neutral-400/30 dark:bg-white/10 ml-8 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Right Column: Title, paragraph, and CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center order-1 lg:order-2"
          >
            <div className="text-neutral-500 dark:text-neutral-400 text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
              <Circle className="w-3 h-3 text-neutral-400" />
              SYSTEM WORKFLOW
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 uppercase tracking-tight leading-tight">
              Collision Assessment<br />Pipeline
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
              ORIS continuously processes orbital state vectors, conjunction messages, and tracking observations to evaluate collision probability. When predefined risk thresholds are exceeded, the system generates maneuver recommendations and records every decision for operator review.
            </p>
            
            <button
              onClick={onLaunchMissionControl}
              id="view-workflow-btn"
              className="bg-neutral-200/50 hover:bg-neutral-300/50 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-300/50 dark:border-white/10 text-neutral-800 dark:text-neutral-200 backdrop-blur-md px-6 py-3 rounded-md text-xs font-mono uppercase tracking-widest flex items-center gap-3 w-fit transition-all duration-300 shadow-lg cursor-pointer"
            >
              <Play className="w-3 h-3" />
              View Simulation
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

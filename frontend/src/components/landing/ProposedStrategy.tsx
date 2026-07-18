import React from "react";
import { Activity, Compass, Database, Grid } from "lucide-react";
import { motion } from "motion/react";

export default function ProposedStrategy() {
  const assessmentServices = [
    {
      badge: "Conjunction Assessment",
      title: "Collision Risk Analysis",
      description: "Propagates state vectors using SGP4/SDP4 models to determine Time of Closest Approach (TCA) and calculate Probability of Collision (Pc).",
      metadataLabel: "Propagation Window",
      metadataValue: "72 Hours",
      status: "Operational",
      indicatorClass: "bg-emerald-500/80",
      statusClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: <Activity className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
    },
    {
      badge: "Maneuver Planning",
      title: "Delta-V Optimization",
      description: "Computes optimal delta-V requirements to minimize collision probability while respecting spacecraft operational constraints and fuel budgets.",
      metadataLabel: "Recommended ΔV",
      metadataValue: "0.42 m/s",
      status: "Solution Ready",
      indicatorClass: "bg-rose-500/80",
      statusClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      icon: <Compass className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
    },
    {
      badge: "Telemetry Processing",
      title: "Data Ingestion",
      description: "Ingests Two-Line Elements (TLEs), Conjunction Data Messages (CDMs), and high-fidelity ephemerides from the Space Surveillance Network (SSN).",
      metadataLabel: "Synchronization Interval",
      metadataValue: "Every 6 Hours",
      status: "Synchronized",
      indicatorClass: "bg-emerald-500/80",
      statusClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: <Database className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
    }
  ];

  const now = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";

  return (
    <section
      id="strategy"
      className="relative min-h-screen w-full flex items-center py-24 px-6 md:px-16 bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full z-10">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="text-neutral-500 dark:text-neutral-400 text-xs font-mono tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
            <Grid className="w-4 h-4 text-neutral-400" />
            CORE SUBSYSTEMS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 uppercase tracking-tight">
            Conjunction Assessment Services
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            The platform integrates orbit propagation, precise ephemeris generation, maneuver optimization, and telemetry ingestion to support operators in executing collision avoidance.
          </p>
        </motion.div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {assessmentServices.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
              className="bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-xl p-6 border border-neutral-300/40 dark:border-white/10 hover:border-neutral-400/60 dark:hover:border-white/20 transition-all duration-500 group flex flex-col justify-between h-full shadow-lg hover:-translate-y-1 relative"
            >
              {/* Subtle top-right status indicator */}
              <div className="absolute top-6 right-6 flex items-center justify-center">
                 <span className={`w-1.5 h-1.5 rounded-full ${service.indicatorClass} animate-pulse`}></span>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  {service.icon}
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border ${service.statusClass}`}>
                    {service.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>
              
              <div className="mt-4">
                <div className="w-full h-px bg-neutral-300/50 dark:bg-white/10 mb-5"></div>
                
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">
                      {service.metadataLabel}
                    </div>
                    <div className="text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {service.metadataValue}
                    </div>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase border ${service.statusClass}`}>
                    {service.status}
                  </span>
                </div>

                {/* Footer */}
                <div className="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-right mt-2 opacity-50">
                  Last Updated: {now}
                </div>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

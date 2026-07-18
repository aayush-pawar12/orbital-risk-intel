import React, { useState } from "react";
import { List, FileText, X, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { LedgerBlock } from "@/lib/landing-types";

interface LedgerSectionProps {
  blocks: LedgerBlock[];
}

interface AuditEvent {
  id: string;
  title: string;
  primaryDetail: string;
  status: string;
  timestamp: string;
  eventType: string;
  riskLevel: string;
  source: string;
  operator: string;
}

const auditEvents: AuditEvent[] = [
  {
    id: "EVENT_10482",
    title: "Conjunction Assessment (CA) Computed",
    primaryDetail: "2026-07-14 14:26 UTC",
    status: "Verified",
    timestamp: "2026-07-14T14:26:00Z",
    eventType: "Orbit Propagation",
    riskLevel: "Low",
    source: "Space Surveillance Network",
    operator: "Auto-System"
  },
  {
    id: "EVENT_10483",
    title: "Probability of Collision (Pc) Updated",
    primaryDetail: "Probability: 0.0037",
    status: "Recorded",
    timestamp: "2026-07-14T14:26:02Z",
    eventType: "Risk Assessment",
    riskLevel: "Elevated",
    source: "Orbital Assessment Engine",
    operator: "Auto-System"
  },
  {
    id: "EVENT_10484",
    title: "Avoidance Maneuver Computed",
    primaryDetail: "ΔV Solution Generated",
    status: "Pending Review",
    timestamp: "2026-07-14T14:26:05Z",
    eventType: "Maneuver Planning",
    riskLevel: "High",
    source: "Maneuver Optimization Module",
    operator: "Awaiting Input"
  }
];

export default function LedgerSection({ blocks }: LedgerSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  return (
    <section
      id="ledger"
      className="relative min-h-screen w-full flex items-center py-24 px-6 md:px-16 bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Chronological event timeline */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start justify-center gap-0 order-2 lg:order-1 relative"
          >
            {/* Audit Integrity Indicator */}
            <div className="flex items-center gap-2 mb-8 ml-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                Log Integrity: Verified
              </span>
            </div>

            {auditEvents.map((evt, idx) => (
              <React.Fragment key={evt.id}>
                <div
                  onClick={() => setSelectedEvent(evt)}
                  className={`w-full max-w-md p-5 bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-xl flex items-start gap-4 border transition-all duration-300 cursor-pointer ${
                    idx === 0 ? "opacity-100 border-neutral-300/50 dark:border-white/20 hover:border-neutral-400 dark:hover:border-white/40 shadow-lg" : 
                    idx === 1 ? "opacity-90 border-neutral-300/30 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30" : 
                    "opacity-75 border-neutral-300/20 dark:border-white/5 hover:border-neutral-400 dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full border border-neutral-400/30 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 font-bold tracking-widest">
                        {evt.id}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase ${
                        evt.status === "Verified" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                      {evt.title}
                    </div>
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                      {evt.primaryDetail}
                    </div>
                  </div>
                </div>

                {/* Vertical Connector Path */}
                {idx < auditEvents.length - 1 && (
                  <div className="w-px h-6 bg-neutral-300 dark:bg-white/10 ml-8 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Right Column: Title and details */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center order-1 lg:order-2"
          >
            <div className="text-neutral-500 dark:text-neutral-400 text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
              <List className="w-4 h-4 text-neutral-400" />
              MISSION LOGS
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 uppercase tracking-tight leading-tight">
              Immutable Operations<br />Log
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
              All Conjunction Assessments (CA), Probability of Collision (Pc) evaluations, maneuver recommendations, and telemetry updates are cryptographically logged to ensure traceability for mission oversight and regulatory compliance.
            </p>
            
            <button
              onClick={() => setSelectedEvent(auditEvents[0])}
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 backdrop-blur-md px-6 py-3 rounded-md text-xs font-mono uppercase tracking-widest flex items-center gap-3 w-fit transition-all duration-300 cursor-pointer shadow-lg"
            >
              Open Operations Log
              <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </button>
          </motion.div>

        </div>
      </div>

      {/* Interactive Metadata Modal Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                  Event Metadata
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl font-mono text-xs text-neutral-800 dark:text-neutral-300 overflow-x-auto border border-neutral-300/40 dark:border-white/5 space-y-3">
              <div className="grid grid-cols-3 gap-2 border-b border-neutral-300/30 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Event ID:</span>
                <span className="col-span-2 font-bold">{selectedEvent.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-neutral-300/30 dark:border-white/5 pb-2">
                <span className="text-neutral-500">UTC Time:</span>
                <span className="col-span-2">{selectedEvent.timestamp}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-neutral-300/30 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Event Type:</span>
                <span className="col-span-2">{selectedEvent.eventType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-neutral-300/30 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Risk Level:</span>
                <span className="col-span-2">{selectedEvent.riskLevel}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-neutral-300/30 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Source:</span>
                <span className="col-span-2">{selectedEvent.source}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-neutral-300/30 dark:border-white/5 pb-2">
                <span className="text-neutral-500">Operator:</span>
                <span className="col-span-2">{selectedEvent.operator}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <span className="text-neutral-500">Status:</span>
                <span className="col-span-2">{selectedEvent.status}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 backdrop-blur-md px-6 py-2 rounded-md text-xs font-bold transition-all cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

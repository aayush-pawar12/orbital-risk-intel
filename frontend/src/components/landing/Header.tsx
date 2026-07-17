import React from "react";
import { Shield, Terminal } from "lucide-react";

interface HeaderProps {
  onLaunchMissionControl: () => void;
  isMissionControlOpen: boolean;
}

export default function Header({
  onLaunchMissionControl,
  isMissionControlOpen
}: HeaderProps) {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl rounded-full border border-white/10 shadow-2xl z-50 bg-neutral-950/40 backdrop-blur-3xl transition-all duration-300">
      <div className="flex justify-between items-center px-6 md:px-8 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer font-sans" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Shield className="w-5 h-5 text-rose-400 animate-pulse" />
          <span className="text-xl tracking-tighter text-white font-bold font-sans">
            ORIS
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            className="text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-rose-400 transition-colors"
            href="#issue"
          >
            Issue
          </a>
          <a
            className="text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-rose-400 transition-colors"
            href="#strategy"
          >
            Strategy
          </a>
          <a
            className="text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-rose-400 transition-colors"
            href="#operational"
          >
            Operational
          </a>
          <a
            className="text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-rose-400 transition-colors"
            href="#ledger"
          >
            Ledger
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Launch Control CTA */}
          <button
            onClick={onLaunchMissionControl}
            id="launch-mission-control-btn"
            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-200 backdrop-blur-md px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 animate-pulse" />
            {isMissionControlOpen ? "Exit Workspace" : "Launch Mission Control"}
          </button>
        </div>
      </div>
    </nav>
  );
}

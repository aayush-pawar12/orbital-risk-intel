'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Starfield from "@/components/landing/Starfield";
import Hero from "@/components/landing/Hero";
import IssueDescription from "@/components/landing/IssueDescription";
import ProposedStrategy from "@/components/landing/ProposedStrategy";
import OperationalProcedure from "@/components/landing/OperationalProcedure";
import LedgerSection from "@/components/landing/LedgerSection";
import { LedgerBlock } from "@/lib/landing-types";

export default function App() {
  const router = useRouter();
  const [satelliteCount, setSatelliteCount] = useState(4500);

  // Seed default chronological ledger blocks mirroring the screenshots
  const [blocks, setBlocks] = useState<LedgerBlock[]>([
    {
      id: "BLK_9934",
      blockNumber: 9934,
      timestamp: "23:14:02 UTC // 2026-07-16",
      actionTaken: "Conjunction Assessment (CA) completed for AEGIS-7. Delta-V maneuver vector computed and logged.",
      targetSatellite: "AEGIS-7",
      hash: "SHA256: a7f909bc3113ea4fe921bc1c27dfd89ef41b3e2c",
      prevHash: "SHA256: c4e1160a9f0ac2ea9bc15d48d0a273b4009933fc",
      validatorNode: "ORIS-NEURAL-NODE-88"
    },
    {
      id: "BLK_9933",
      blockNumber: 9933,
      timestamp: "21:42:15 UTC // 2026-07-16",
      actionTaken: "State vector telemetry ingestion verified for STARLINK-3211.",
      targetSatellite: "STARLINK-3211",
      hash: "SHA256: c4e1160a9f0ac2ea9bc15d48d0a273b4009933fc",
      prevHash: "SHA256: e8d21a5bc4e1160a9f0ac2ea9bc15d48da932cf0",
      validatorNode: "ORIS-NEURAL-NODE-12"
    },
    {
      id: "BLK_9932",
      blockNumber: 9932,
      timestamp: "18:05:59 UTC // 2026-07-16",
      actionTaken: "Space Surveillance Network (SSN) catalog synchronization completed.",
      targetSatellite: "SSN_CATALOG_SYNC",
      hash: "SHA256: e8d21a5bc4e1160a9f0ac2ea9bc15d48da932cf0",
      prevHash: "SHA256: f193da4c2e1160a9f0ac2ea9bc15d48da2a4fc019",
      validatorNode: "ORIS-GATEWAY-04"
    }
  ]);

  // Set dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const launchDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden dark bg-neutral-950 text-white">
      {/* High-fidelity Canvas/Vector Animated Background */}
      <Starfield />

      {/* Persistent Navigation Header */}
      <Header
        onLaunchMissionControl={launchDashboard}
        isMissionControlOpen={false}
      />

      {/* Main Single Page Sections */}
      <main className="relative z-10">
        <Hero
          onLaunchMissionControl={launchDashboard}
          satelliteCount={satelliteCount}
        />
        <IssueDescription />
        <ProposedStrategy />
        <OperationalProcedure onLaunchMissionControl={launchDashboard} />
        <LedgerSection blocks={blocks} />
      </main>

      {/* Humble Aerospace Footer */}
      <footer className="relative z-10 border-t border-neutral-200/20 dark:border-white/5 py-10 bg-neutral-100/30 dark:bg-neutral-950/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
          <span>
            © {new Date().getFullYear()} ORIS All Rights Reserved.
          </span>

        </div>
      </footer>
    </div>
  );
}

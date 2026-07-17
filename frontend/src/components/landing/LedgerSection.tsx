import React, { useState } from "react";
import { Database, Link as LinkIcon, CheckCircle2, FileJson, X } from "lucide-react";
import { LedgerBlock } from "@/lib/landing-types";

interface LedgerSectionProps {
  blocks: LedgerBlock[];
}

export default function LedgerSection({ blocks }: LedgerSectionProps) {
  const [selectedBlock, setSelectedBlock] = useState<LedgerBlock | null>(null);

  return (
    <section
      id="ledger"
      className="relative min-h-screen w-full flex items-center py-24 px-6 md:px-16 bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Interactive cryptographic block logs */}
          <div className="flex flex-col items-center justify-center gap-4 order-2 lg:order-1">
            {blocks.slice(0, 4).map((block, idx) => (
              <React.Fragment key={block.id}>
                <div
                  onClick={() => setSelectedBlock(block)}
                  className={`w-full max-w-md p-6 bg-neutral-100/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-2xl flex items-center justify-between border border-neutral-300/30 dark:border-white/10 hover:border-rose-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1 group ${
                    idx === 0 ? "opacity-100" : idx === 1 ? "opacity-75" : idx === 2 ? "opacity-50" : "opacity-30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Database className="w-5 h-5 text-rose-500 group-hover:animate-bounce" />
                    <div>
                      <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest">
                        {block.id}
                      </div>
                      <div className="text-xs text-neutral-800 dark:text-neutral-200 truncate max-w-[200px] font-mono mt-1">
                        {block.hash}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    SEALED
                  </div>
                </div>

                {/* Ledger chain links */}
                {idx < Math.min(blocks.length, 4) - 1 && (
                  <div className="w-px h-8 bg-gradient-to-b from-rose-500/40 to-transparent"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right Column: Title and details */}
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <div className="text-rose-500 dark:text-rose-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-rose-500" />
              Immutable Infrastructure
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 uppercase tracking-tight leading-tight">
              Orbital<br />Audit Ledger
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
              Every micro-maneuver command, trajectory telemetry snapshot, and sensor correlation vector is cryptographically signed and committed to a decentralized distributed ledger. This provides an unquestionable, fully auditable insurance and compliance timeline for sovereign governments and commercial aerospace underwriters.
            </p>
            
            <button
              onClick={() => setSelectedBlock(blocks[0])}
              className="bg-white/5 hover:bg-white/15 border border-white/10 text-white backdrop-blur-md px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-3 w-fit transition-all duration-300 cursor-pointer"
            >
              Verify Ledger Status
              <CheckCircle2 className="w-4 h-4 text-rose-400 animate-pulse" />
            </button>
          </div>

        </div>
      </div>

      {/* Interactive Blockchain Metadata Modal Overlay */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                  {selectedBlock.id} Metadata
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl font-mono text-xs text-neutral-800 dark:text-neutral-300 overflow-x-auto border border-neutral-300/40 dark:border-white/5 space-y-2">
              <p><span className="text-rose-500">"block_id":</span> "{selectedBlock.id}"</p>
              <p><span className="text-rose-500">"sequence_index":</span> {selectedBlock.blockNumber}</p>
              <p><span className="text-rose-500">"sealed_timestamp":</span> "{selectedBlock.timestamp}"</p>
              <p><span className="text-rose-500">"action_taken":</span> "{selectedBlock.actionTaken}"</p>
              <p><span className="text-rose-500">"target_body":</span> "{selectedBlock.targetSatellite}"</p>
              <p><span className="text-rose-500">"cryptographic_hash":</span> "{selectedBlock.hash}"</p>
              <p><span className="text-rose-500">"parent_block_hash":</span> "{selectedBlock.prevHash}"</p>
              <p><span className="text-rose-500">"verification_signature":</span> "{selectedBlock.validatorNode}"</p>
              <p><span className="text-rose-500">"status":</span> "SECURE_NOMINAL"</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedBlock(null)}
                className="bg-white/5 hover:bg-white/15 border border-white/10 text-white backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

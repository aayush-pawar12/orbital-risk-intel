export interface Satellite {
  id: string;
  name: string;
  type: "payload" | "debris" | "rocket_body";
  altitude: number; // km
  velocity: number; // km/s
  inclination: number; // degrees
  riskFactor: number; // %
  lastUpdated: string;
  status: "nominal" | "warning" | "critical";
}

export interface LedgerBlock {
  id: string;
  blockNumber: number;
  timestamp: string;
  actionTaken: string;
  targetSatellite: string;
  hash: string;
  prevHash: string;
  validatorNode: string;
}

export interface SystemTest {
  id: string;
  name: string;
  category: "Trajectory Math" | "Cryptography" | "Network Ingress" | "State Synchronization";
  assertion: string;
  status: "idle" | "running" | "passed" | "failed";
  message?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import { AssessResponse } from '@/lib/api';
import { Globe2 } from 'lucide-react';
import * as THREE from 'three';

interface Props {
    assessment: AssessResponse | null;
}

const SCALE = 1 / 6371; // Normalize to unit sphere

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group>
            {/* Earth sphere */}
            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <meshStandardMaterial
                    color="#171717"
                    roughness={0.8}
                    metalness={0.1}
                />
            </Sphere>
            {/* Wireframe overlay */}
            <Sphere args={[1.002, 32, 32]}>
                <meshBasicMaterial
                    color="#404040"
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </Sphere>
        </group>
    );
}

function SatelliteMarker({ position, color }: {
    position: [number, number, number];
    color: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta;
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <octahedronGeometry args={[0.04, 0]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
            </mesh>
        </group>
    );
}

function ConnectionLine({ start, end, color }: {
    start: [number, number, number];
    end: [number, number, number];
    color: string;
}) {
    return (
        <Line
            points={[start, end]}
            color={color}
            lineWidth={1}
            dashed
            dashSize={0.05}
            gapSize={0.03}
        />
    );
}

function Scene({ assessment }: { assessment: AssessResponse | null }) {
    const satPos = useMemo<[number, number, number]>(() => {
        if (!assessment) return [1.5, 0.3, 0.5];
        const { x_km, y_km, z_km } = assessment.satellite_position;
        return [x_km * SCALE, y_km * SCALE, z_km * SCALE];
    }, [assessment]);

    const debPos = useMemo<[number, number, number]>(() => {
        if (!assessment) return [1.3, -0.4, 0.8];
        const { x_km, y_km, z_km } = assessment.debris_position;
        return [x_km * SCALE, y_km * SCALE, z_km * SCALE];
    }, [assessment]);

    const lineColor = assessment
        ? assessment.risk.risk_level === 'CRITICAL' ? '#ef4444'
            : assessment.risk.risk_level === 'WARNING' ? '#f59e0b' : '#10b981'
        : '#525252';

    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={0.8} color="#a3a3a3" />
            <pointLight position={[-5, -3, -5]} intensity={0.3} color="#a3a3a3" />

            <Earth />
            <SatelliteMarker position={satPos} color="#3b82f6" />
            <SatelliteMarker position={debPos} color="#f59e0b" />
            <ConnectionLine start={satPos} end={debPos} color={lineColor} />

            <OrbitControls
                enableZoom
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.3}
                minDistance={2}
                maxDistance={8}
            />
        </>
    );
}

export default function GlobePanel({ assessment }: Props) {
    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-0 relative overflow-hidden flex flex-col h-[600px] group">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <Globe2 size={16} className="text-neutral-500" />
                <h3 className="m-0 text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                    Live 3D Trajectory
                </h3>
            </div>

            <div className="flex-1 w-full h-full bg-neutral-950/40 backdrop-blur-xl">
                <Canvas
                    camera={{ position: [0, 0, 3.5], fov: 45 }}
                    style={{ background: 'transparent' }}
                >
                    <Scene assessment={assessment} />
                </Canvas>
            </div>

            {/* Legend */}
            <div className="flex gap-6 p-4 justify-center border-t border-white/10 bg-neutral-950/40 backdrop-blur-xl">
                <LegendItem color="#3b82f6" label="Satellite" />
                <LegendItem color="#f59e0b" label="Debris" />
                <LegendItem color="#737373" label="Separation" dashed />
            </div>
        </div>
    );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-[2px] ${dashed ? 'border-b border-dashed' : ''}`} style={{ borderColor: color, background: dashed ? 'transparent' : color }} />
            <span className="text-xs text-neutral-400 font-medium">{label}</span>
        </div>
    );
}

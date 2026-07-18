/* eslint-disable react-hooks/purity */
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Sphere, Line, Stars, useTexture } from '@react-three/drei';
import { AssessResponse } from '@/lib/api';
import { Globe2 } from 'lucide-react';
import * as THREE from 'three';

interface Props {
    assessment: AssessResponse | null;
}

const SCALE = 1 / 6371; // Normalize to unit sphere

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null);
    const colorMap = useTexture('https://unpkg.com/three-globe/example/img/earth-dark.jpg');

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.015;
            meshRef.current.rotation.x += delta * 0.005;
        }
    });

    return (
        <group>
            {/* Earth sphere with texture */}
            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <meshStandardMaterial
                    map={colorMap}
                    roughness={0.6}
                    metalness={0.2}
                />
            </Sphere>
            {/* Atmospheric glow */}
            <Sphere args={[1.02, 32, 32]}>
                <meshBasicMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                />
            </Sphere>
            <Sphere args={[1.01, 32, 32]}>
                <meshBasicMaterial
                    color="#1e3a8a"
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
        </group>
    );
}

function BackgroundDebris() {
    const [positions, colors] = useMemo(() => {
        const pts = [];
        const cols = [];
        const colorPalette = [
            new THREE.Color('#10b981'), // emerald
            new THREE.Color('#3b82f6'), // blue
            new THREE.Color('#f59e0b'), // amber
            new THREE.Color('#ec4899'), // pink
            new THREE.Color('#a855f7')  // purple
        ];
        for (let i = 0; i < 4000; i++) {
            const r = 1.05 + Math.random() * 1.5;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos((Math.random() * 2) - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pts.push(x, y, z);
            
            const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            cols.push(c.r, c.g, c.b);
        }
        return [new Float32Array(pts), new Float32Array(cols)];
    }, []);

    const meshRef = useRef<THREE.Points>(null);
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.015; 
            meshRef.current.rotation.x += delta * 0.005;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.012} vertexColors transparent opacity={0.65} />
        </points>
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

            <Stars radius={10} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
            <BackgroundDebris />

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
                    <Suspense fallback={null}>
                        <Scene assessment={assessment} />
                    </Suspense>
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

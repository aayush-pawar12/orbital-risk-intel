'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import { AssessResponse } from '@/lib/api';
import { Globe } from 'lucide-react';
import * as THREE from 'three';

interface Props {
    assessment: AssessResponse | null;
}

const EARTH_RADIUS_KM = 6371;
const SCALE = 1 / EARTH_RADIUS_KM; // Normalize to unit sphere

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
                    color="#1a3a5c"
                    wireframe={false}
                    roughness={0.8}
                    metalness={0.1}
                />
            </Sphere>
            {/* Wireframe overlay */}
            <Sphere args={[1.002, 32, 32]}>
                <meshBasicMaterial
                    color="#00d4ff"
                    wireframe
                    transparent
                    opacity={0.08}
                />
            </Sphere>
            {/* Atmosphere glow */}
            <Sphere args={[1.05, 32, 32]}>
                <meshBasicMaterial
                    color="#00d4ff"
                    transparent
                    opacity={0.04}
                    side={THREE.BackSide}
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
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
            {/* Glow ring */}
            <mesh>
                <ringGeometry args={[0.05, 0.07, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
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
        ? assessment.risk.risk_level === 'CRITICAL' ? '#ff2d55'
            : assessment.risk.risk_level === 'WARNING' ? '#ff9500' : '#30d158'
        : '#ffffff';

    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={0.8} />
            <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4a7dff" />

            <Earth />
            <SatelliteMarker position={satPos} color="#00d4ff" />
            <SatelliteMarker position={debPos} color="#ff9500" />
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
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-primary)',
                position: 'relative',
                zIndex: 2,
            }}>
                <Globe size={14} color="var(--accent-cyan)" />
                <h2 style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    margin: 0,
                    color: 'var(--text-secondary)',
                }}>
                    3D ORBIT VISUALIZATION
                </h2>
                {assessment && (
                    <span className="mono" style={{
                        marginLeft: 'auto',
                        fontSize: '0.6rem',
                        color: 'var(--text-muted)',
                    }}>
                        GCRS · REAL-TIME
                    </span>
                )}
            </div>

            <div style={{
                height: '320px',
                marginTop: '0.5rem',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'radial-gradient(ellipse at center, #0c1220 0%, #060a13 100%)',
            }}>
                <Canvas
                    camera={{ position: [0, 0, 3.5], fov: 45 }}
                    style={{ background: 'transparent' }}
                >
                    <Scene assessment={assessment} />
                </Canvas>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '0.5rem',
                justifyContent: 'center',
            }}>
                <LegendItem color="#00d4ff" label="SATELLITE" />
                <LegendItem color="#ff9500" label="DEBRIS" />
                <LegendItem color="var(--text-muted)" label="SEPARATION" dashed />
            </div>
        </div>
    );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
                width: 12, height: 3,
                background: color,
                borderRadius: '1px',
                borderBottom: dashed ? '1px dashed ' + color : undefined,
            }} />
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {label}
            </span>
        </div>
    );
}

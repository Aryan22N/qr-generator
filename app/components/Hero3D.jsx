"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";

function GeometricShape({ position, color, geometryType = "icosahedron" }) {
    const meshRef = useRef(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.1;
    });

    return (
        <Float
            speed={2} // Animation speed
            rotationIntensity={1.5} // XYZ rotation intensity
            floatIntensity={2} // Up/down float intensity
            floatingRange={[-0.5, 0.5]} // Range of y-axis values the object will float within
        >
            <mesh ref={meshRef} position={position}>
                {geometryType === "icosahedron" && (
                    <icosahedronGeometry args={[1.5, 0]} />
                )}
                {geometryType === "torus" && (
                    <torusGeometry args={[1.2, 0.4, 16, 32]} />
                )}
                {geometryType === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
                <meshStandardMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.5}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                {/* Floating Shapes */}
                <GeometricShape
                    position={[-4, 1, -2]}
                    color="#3b82f6" // blue-500
                    geometryType="icosahedron"
                />
                <GeometricShape
                    position={[4, -1, -3]}
                    color="#8b5cf6" // violet-500
                    geometryType="torus"
                />
                <GeometricShape
                    position={[-2, -3, -5]}
                    color="#6366f1" // indigo-500
                    geometryType="sphere"
                />

                {/* Additional background elements for depth */}
                <GeometricShape
                    position={[5, 3, -8]}
                    color="#a855f7" // purple-500
                    geometryType="icosahedron"
                />
                <GeometricShape
                    position={[-5, 4, -10]}
                    color="#0ea5e9" // sky-500
                    geometryType="sphere"
                />


                <Environment preset="city" />
                <ContactShadows
                    position={[0, -4.5, 0]}
                    opacity={0.4}
                    scale={20}
                    blur={2.5}
                    far={4.5}
                />
            </Canvas>
        </div>
    );
}

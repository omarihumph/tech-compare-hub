import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, RoundedBox, useTexture } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";

// Realistic Laptop Model
const Laptop = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + rotation[1];
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Base - Aluminum MacBook style */}
      <RoundedBox args={[2.4, 0.08, 1.6]} radius={0.04} position={[0, 0, 0]}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
      </RoundedBox>
      {/* Base top plate */}
      <RoundedBox args={[2.35, 0.02, 1.55]} radius={0.02} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
      </RoundedBox>
      {/* Keyboard keys simulation */}
      <mesh position={[0, 0.065, 0.15]}>
        <planeGeometry args={[1.8, 0.7]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Trackpad */}
      <RoundedBox args={[0.7, 0.01, 0.45]} radius={0.02} position={[0, 0.06, 0.65]}>
        <meshStandardMaterial color="#b8b8b8" metalness={0.8} roughness={0.15} />
      </RoundedBox>
      
      {/* Screen - Lid */}
      <group position={[0, 0.75, -0.75]} rotation={[-0.25, 0, 0]}>
        {/* Outer aluminum frame */}
        <RoundedBox args={[2.35, 1.55, 0.04]} radius={0.02}>
          <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
        </RoundedBox>
        {/* Inner bezel */}
        <RoundedBox args={[2.2, 1.4, 0.01]} radius={0.01} position={[0, -0.03, 0.025]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.9} />
        </RoundedBox>
        {/* Screen Display - IPS Panel look */}
        <mesh position={[0, -0.03, 0.035]}>
          <planeGeometry args={[2.0, 1.25]} />
          <meshStandardMaterial 
            color="#1e40af" 
            emissive="#3b82f6" 
            emissiveIntensity={0.5}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
        {/* Screen content glow */}
        <mesh position={[0, 0.2, 0.036]}>
          <planeGeometry args={[1.2, 0.4]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            emissive="#93c5fd" 
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Webcam */}
        <mesh position={[0, 0.68, 0.025]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Camera indicator light */}
        <mesh position={[0.03, 0.68, 0.025]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
        </mesh>
      </group>
      
      {/* Apple logo on back */}
      <mesh position={[0, 0.75, -0.77]} rotation={[-0.25, Math.PI, 0]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#e5e5e5" emissive="#ffffff" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Realistic iPhone-style Smartphone
const Smartphone = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + 1) * 0.3 + rotation[1];
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={meshRef as any} position={position} rotation={rotation}>
      {/* Phone body - Titanium frame */}
      <RoundedBox args={[0.55, 1.15, 0.06]} radius={0.04}>
        <meshStandardMaterial color="#3d3d3d" metalness={0.95} roughness={0.15} />
      </RoundedBox>
      {/* Glass back */}
      <RoundedBox args={[0.52, 1.12, 0.01]} radius={0.03} position={[0, 0, -0.03]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.1} />
      </RoundedBox>
      {/* Screen glass */}
      <RoundedBox args={[0.52, 1.12, 0.005]} radius={0.03} position={[0, 0, 0.033]}>
        <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.05} />
      </RoundedBox>
      {/* OLED Display */}
      <mesh position={[0, 0, 0.036]}>
        <planeGeometry args={[0.48, 1.02]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#8b5cf6" 
          emissiveIntensity={0.4}
          metalness={0}
          roughness={0.1}
        />
      </mesh>
      {/* Dynamic Island */}
      <RoundedBox args={[0.15, 0.045, 0.003]} radius={0.02} position={[0, 0.45, 0.038]}>
        <meshStandardMaterial color="#000000" metalness={0.2} roughness={0.1} />
      </RoundedBox>
      {/* Camera island */}
      <RoundedBox args={[0.2, 0.2, 0.025]} radius={0.03} position={[-0.12, 0.38, -0.045]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Main camera */}
      <mesh position={[-0.17, 0.43, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.015, 24]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[-0.17, 0.43, -0.068]}>
        <circleGeometry args={[0.035, 24]} />
        <meshStandardMaterial color="#0c1445" metalness={0.2} roughness={0.1} />
      </mesh>
      {/* Ultra wide camera */}
      <mesh position={[-0.07, 0.43, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.012, 24]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Telephoto camera */}
      <mesh position={[-0.12, 0.33, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.01, 24]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Flash */}
      <mesh position={[-0.07, 0.33, -0.058]}>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.3} />
      </mesh>
      {/* Side button */}
      <RoundedBox args={[0.008, 0.08, 0.02]} radius={0.003} position={[0.28, 0.2, 0]}>
        <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.2} />
      </RoundedBox>
    </group>
  );
};

// Realistic iMac-style Monitor
const Monitor = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + 2) * 0.15 + rotation[1];
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Main display housing */}
      <RoundedBox args={[2.8, 1.8, 0.06]} radius={0.05}>
        <meshStandardMaterial color="#e8e8e8" metalness={0.4} roughness={0.3} />
      </RoundedBox>
      {/* Black bezel */}
      <RoundedBox args={[2.7, 1.7, 0.02]} radius={0.03} position={[0, 0, 0.04]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.1} roughness={0.9} />
      </RoundedBox>
      {/* 5K Retina Display */}
      <mesh position={[0, 0.02, 0.055]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial 
          color="#1e3a5f" 
          emissive="#22d3ee" 
          emissiveIntensity={0.35}
          metalness={0}
          roughness={0.05}
        />
      </mesh>
      {/* Screen content simulation */}
      <mesh position={[-0.6, 0.3, 0.056]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#34d399" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[0.5, -0.2, 0.056]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#fbbf24" 
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Camera */}
      <mesh position={[0, 0.82, 0.04]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Chin with Apple logo */}
      <RoundedBox args={[2.8, 0.25, 0.06]} radius={0.02} position={[0, -0.92, 0]}>
        <meshStandardMaterial color="#d4d4d4" metalness={0.5} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, -0.92, 0.035]}>
        <circleGeometry args={[0.06, 32]} />
        <meshStandardMaterial color="#a3a3a3" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Stand - curved aluminum */}
      <group position={[0, -1.4, -0.3]}>
        {/* Stand arm */}
        <mesh rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.25, 0.7, 0.04]} />
          <meshStandardMaterial color="#d4d4d4" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Stand base */}
        <mesh position={[0, -0.35, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.9, 0.25, 0.015]} />
          <meshStandardMaterial color="#d4d4d4" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// Realistic AirPods Max-style Headphones
const Headphones = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + 1) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Steel mesh headband */}
      <mesh>
        <torusGeometry args={[0.55, 0.025, 16, 48, Math.PI]} />
        <meshStandardMaterial color="#d4d4d4" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Headband cushion */}
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.52, 0.04, 8, 48, Math.PI]} />
        <meshStandardMaterial color="#a3a3a3" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Left ear cup - aluminum */}
      <group position={[-0.55, -0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.12, 48]} />
          <meshStandardMaterial color="#e11d48" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Ear cushion */}
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.06, 48]} />
          <meshStandardMaterial color="#737373" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Digital Crown */}
        <mesh position={[-0.08, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 24]} />
          <meshStandardMaterial color="#c4c4c4" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Connector arm */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.03, 0.15, 0.02]} />
          <meshStandardMaterial color="#d4d4d4" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Right ear cup - aluminum */}
      <group position={[0.55, -0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.12, 48]} />
          <meshStandardMaterial color="#e11d48" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Ear cushion */}
        <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.06, 48]} />
          <meshStandardMaterial color="#737373" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Noise control button */}
        <mesh position={[0.08, 0.2, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#c4c4c4" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Connector arm */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.03, 0.15, 0.02]} />
          <meshStandardMaterial color="#d4d4d4" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// Floating orbs for atmosphere
const FloatingOrb = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <MeshDistortMaterial color={color} speed={2} distort={0.3} radius={1} />
    </mesh>
  );
};

// Main rotating showcase
const RotatingShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const targetRotation = -activeIndex * (Math.PI / 2);
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Laptop position={[0, 0, 2.5]} rotation={[0, 0, 0]} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <Smartphone position={[2.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      </Float>
      <Float speed={2.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <Monitor position={[0, 0, -2.5]} rotation={[0, Math.PI, 0]} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.5}>
        <Headphones position={[-2.5, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} />
      </Float>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, -5, -5]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[0, 5, 3]} intensity={0.6} color="#f472b6" />
      <pointLight position={[-5, 0, 0]} intensity={0.3} color="#22d3ee" />
      <spotLight position={[5, 8, 5]} angle={0.3} penumbra={0.5} intensity={0.8} color="#ffffff" />
      
      <RotatingShowcase />
      
      {/* Atmospheric orbs */}
      <FloatingOrb position={[3, 2, 1]} color="#6366f1" scale={0.8} />
      <FloatingOrb position={[-3, -1, 2]} color="#ec4899" scale={0.6} />
      <FloatingOrb position={[2, -2, -1]} color="#22c55e" scale={0.7} />
      <FloatingOrb position={[-2, 1.5, -2]} color="#f97316" scale={0.5} />
      
      <Environment preset="studio" />
    </>
  );
};

const TechShowcase3D = () => {
  const [activeLabel, setActiveLabel] = useState(0);
  const labels = ["MacBook Pro", "iPhone 15 Pro", "iMac 24\"", "AirPods Max"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLabel((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[500px] relative">
      {/* Glow effects behind the 3D scene */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-2xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: "1.5s" }} />
      
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="relative z-10"
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Dynamic label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="px-6 py-3 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-lg">
          <span className="text-base font-semibold text-foreground">
            {labels[activeLabel]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechShowcase3D;

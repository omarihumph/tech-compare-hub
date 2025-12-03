import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";

// Laptop Model
const Laptop = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + rotation[1];
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Base */}
      <RoundedBox args={[2, 0.1, 1.4]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Screen */}
      <group position={[0, 0.7, -0.6]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[1.9, 1.3, 0.05]} radius={0.02}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Screen Display */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.7, 1.1]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.3} />
        </mesh>
      </group>
      {/* Keyboard area */}
      <mesh position={[0, 0.06, 0.1]}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Smartphone Model
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
      <RoundedBox args={[0.5, 1, 0.05]} radius={0.05}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.45, 0.9]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.4} />
      </mesh>
      {/* Camera bump */}
      <mesh position={[0.15, 0.35, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
};

// Desktop Monitor Model
const Monitor = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + 2) * 0.15 + rotation[1];
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Screen Frame */}
      <RoundedBox args={[2.2, 1.4, 0.08]} radius={0.03}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Display */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
      </mesh>
      {/* Stand neck */}
      <RoundedBox args={[0.15, 0.5, 0.08]} radius={0.02} position={[0, -0.9, 0]}>
        <meshStandardMaterial color="#2a2a3e" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      {/* Stand base */}
      <RoundedBox args={[0.8, 0.05, 0.4]} radius={0.02} position={[0, -1.1, 0.1]}>
        <meshStandardMaterial color="#2a2a3e" metalness={0.7} roughness={0.3} />
      </RoundedBox>
    </group>
  );
};

// Headphones Model
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
      {/* Headband */}
      <mesh>
        <torusGeometry args={[0.5, 0.05, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left ear cup */}
      <mesh position={[-0.5, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Right ear cup */}
      <mesh position={[0.5, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.5, -0.1, 0.08]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#2a2a3e" />
      </mesh>
      <mesh position={[0.5, -0.1, 0.08]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#2a2a3e" />
      </mesh>
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
      // Smooth rotation to show each device
      const targetRotation = -activeIndex * (Math.PI / 2);
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Position devices around a circle */}
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#6366f1" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ec4899" />
      
      <RotatingShowcase />
      
      {/* Atmospheric orbs */}
      <FloatingOrb position={[3, 2, 1]} color="#6366f1" scale={0.8} />
      <FloatingOrb position={[-3, -1, 2]} color="#ec4899" scale={0.6} />
      <FloatingOrb position={[2, -2, -1]} color="#22c55e" scale={0.7} />
      <FloatingOrb position={[-2, 1.5, -2]} color="#f97316" scale={0.5} />
      
      <Environment preset="city" />
    </>
  );
};

const TechShowcase3D = () => {
  return (
    <div className="w-full h-[500px] relative">
      {/* Glow effects behind the 3D scene */}
      <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-glow-pulse" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-secondary rounded-full blur-2xl opacity-30 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-accent rounded-full blur-2xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
      
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="relative z-10"
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Labels that cycle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            Rotating showcase • Laptops • Phones • Monitors • Audio
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechShowcase3D;

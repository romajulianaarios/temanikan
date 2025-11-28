import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Komponen Ikan 3D
function Fish({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animasi rotasi dan gerakan
  useFrame((state) => {
    if (meshRef.current) {
      // Gerakan naik turun seperti berenang
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      // Rotasi halus
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Badan Ikan (Ellipsoid) */}
      <mesh scale={hovered ? 1.1 : 1} transition={{ duration: 0.2 }}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          metalness={0.3}
          roughness={0.4}
          emissive="#2E5C8A"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ekor Ikan */}
      <mesh position={[-1.2, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <meshStandardMaterial 
          color="#5BA3F5" 
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>

      {/* Sirip Atas */}
      <mesh position={[0.3, 0.8, 0]} rotation={[-0.3, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial 
          color="#6BB6FF" 
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Sirip Bawah */}
      <mesh position={[0.3, -0.8, 0]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial 
          color="#6BB6FF" 
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Sirip Samping */}
      <mesh position={[0.5, 0, 0.6]} rotation={[0, -0.5, 0]}>
        <coneGeometry args={[0.25, 0.6, 6]} />
        <meshStandardMaterial 
          color="#6BB6FF" 
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Mata */}
      <mesh position={[0.5, 0.3, 0.7]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.55, 0.3, 0.75]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Pola di badan (opsional) */}
      <mesh position={[0.2, 0, 0.95]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFA500"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Komponen Scene 3D
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4A90E2" />

      {/* Ikan */}
      <Fish position={[0, 0, 0]} />

      {/* Orbit Controls untuk interaksi */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Komponen utama Fish3D
interface Fish3DProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Fish3D({ className = '', style }: Fish3DProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}


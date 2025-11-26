import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Path ke model GLB
const ikanKokiModelPath = '/ikan-koki.glb';

// Komponen Ikan 3D yang bergerak
function AnimatedFish3D({ 
  startX, 
  startY, 
  speed = 1, 
  direction = 0,
  scale = 0.3,
  delay = 0,
  isVertical = false
}: { 
  startX: number; 
  startY: number; 
  speed?: number; 
  direction?: number;
  scale?: number;
  delay?: number;
  isVertical?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  const { scene } = useGLTF(ikanKokiModelPath);
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone();
  }, [scene]);
  
  if (!clonedScene) return null;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime + delay;
    const viewportWidth = 10;
    const aspect = typeof window !== 'undefined' ? window.innerHeight / window.innerWidth : 0.6;
    const viewportHeight = viewportWidth * aspect;
    
    // Gerakan horizontal lebih dominan, dengan sedikit variasi alami
    const baseSpeed = speed * 0.8; // Kecepatan yang seimbang
    const moveX = Math.cos(direction * Math.PI / 180) * baseSpeed * delta * 2;
    let moveY = Math.sin(direction * Math.PI / 180) * baseSpeed * delta * 2;

    // Tidak ada gerakan vertikal murni - ikan bergerak horizontal/diagonal
    
    let currentX = meshRef.current.position.x + moveX;
    let currentY = meshRef.current.position.y + moveY;
    
    // Wrapping logic
    if (currentX > viewportWidth / 2 + 2) {
      currentX = -viewportWidth / 2 - 2;
      currentY = (Math.random() - 0.5) * viewportHeight * 0.8;
    } else if (currentX < -viewportWidth / 2 - 2) {
      currentX = viewportWidth / 2 + 2;
      currentY = (Math.random() - 0.5) * viewportHeight * 0.8;
    }
    
    if (currentY > viewportHeight / 2 + 2) {
      currentY = -viewportHeight / 2 - 2;
      currentX = (Math.random() - 0.5) * viewportWidth * 0.8;
    } else if (currentY < -viewportHeight / 2 - 2) {
      currentY = viewportHeight / 2 + 2;
      currentX = (Math.random() - 0.5) * viewportWidth * 0.8;
    }
    
    meshRef.current.position.x = currentX;
    meshRef.current.position.y = currentY;
    
    // Rotasi mengikuti arah gerakan
    const angle = Math.atan2(moveY, moveX);
    meshRef.current.rotation.y = angle + Math.PI / 2;
    
    // Gerakan naik-turun halus seperti berenang (untuk semua ikan)
    meshRef.current.position.z = Math.sin(time * 0.8) * 0.1;
    // Rotasi roll halus untuk efek berenang
    meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      position={[startX, startY, 0]}
      scale={scale}
    />
  );
}

// Komponen Ikan Sederhana (Fallback)
function SimpleFish({ 
  startX, 
  startY, 
  speed = 1, 
  direction = 0,
  delay = 0,
  scale = 1,
  isVertical = false
}: { 
  startX: number; 
  startY: number; 
  speed?: number; 
  direction?: number;
  delay?: number;
  scale?: number;
  isVertical?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime + delay;
    const viewportWidth = 10;
    const aspect = typeof window !== 'undefined' ? window.innerHeight / window.innerWidth : 0.6;
    const viewportHeight = viewportWidth * aspect;
    
    // Gerakan horizontal lebih dominan, dengan sedikit variasi alami
    const baseSpeed = speed * 0.8; // Kecepatan yang seimbang
    const moveX = Math.cos(direction * Math.PI / 180) * baseSpeed * delta * 2;
    let moveY = Math.sin(direction * Math.PI / 180) * baseSpeed * delta * 2;

    // Tidak ada gerakan vertikal murni - ikan bergerak horizontal/diagonal
    
    let currentX = meshRef.current.position.x + moveX;
    let currentY = meshRef.current.position.y + moveY;
    
    // Wrapping logic
    if (currentX > viewportWidth / 2 + 2) {
      currentX = -viewportWidth / 2 - 2;
      currentY = (Math.random() - 0.5) * viewportHeight * 0.8;
    } else if (currentX < -viewportWidth / 2 - 2) {
      currentX = viewportWidth / 2 + 2;
      currentY = (Math.random() - 0.5) * viewportHeight * 0.8;
    }
    
    if (currentY > viewportHeight / 2 + 2) {
      currentY = -viewportHeight / 2 - 2;
      currentX = (Math.random() - 0.5) * viewportWidth * 0.8;
    } else if (currentY < -viewportHeight / 2 - 2) {
      currentY = viewportHeight / 2 + 2;
      currentX = (Math.random() - 0.5) * viewportWidth * 0.8;
    }
    
    meshRef.current.position.x = currentX;
    meshRef.current.position.y = currentY;
    
    // Rotasi mengikuti arah gerakan
    const angle = Math.atan2(moveY, moveX);
    meshRef.current.rotation.y = angle + Math.PI / 2;
    
    // Gerakan naik-turun halus seperti berenang (untuk semua ikan)
    meshRef.current.position.z = Math.sin(time * 0.8) * 0.1;
    // Rotasi roll halus untuk efek berenang
    meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <group ref={meshRef} position={[startX, startY, 0]} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.2}
          roughness={0.3}
          emissive="#FFA500"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[-1, 0, 0]}>
        <coneGeometry args={[0.6, 1.2, 8]} />
        <meshStandardMaterial 
          color="#FFA500" 
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0.2, 0.6, 0]} rotation={[-0.3, 0, 0]}>
        <coneGeometry args={[0.2, 0.6, 6]} />
        <meshStandardMaterial color="#FFA500" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.2, -0.6, 0]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.2, 0.6, 6]} />
        <meshStandardMaterial color="#FFA500" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.5, 0.3, 0.7]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.55, 0.3, 0.75]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Scene dengan banyak ikan
function FishScene() {
  const fishes = useMemo(() => {
    const fishArray = [];
    
    const viewportWidth = 10;
    const aspect = typeof window !== 'undefined' ? window.innerHeight / window.innerWidth : 0.6;
    const viewportHeight = viewportWidth * aspect;
    
    const random = (min: number, max: number) => Math.random() * (max - min) + min;
    
    for (let i = 0; i < 4; i++) {
      fishArray.push({
        startX: random(-viewportWidth / 2 - 2, viewportWidth / 2 + 2),
        startY: random(-viewportHeight * 0.4, viewportHeight * 0.4),
        speed: random(0.4, 0.8),
        direction: random(0, 1) > 0.5 ? random(0, 15) : random(165, 180),
        scale: random(0.65, 0.9),
        delay: random(0, 5),
        useModel: true,
        isVertical: false
      });
    }
    
    // Hapus ikan dengan gerakan vertikal murni (atas-bawah)
    
    // Ikan diagonal landai (tidak vertikal murni)
    for (let i = 0; i < 4; i++) {
      fishArray.push({
        startX: random(-viewportWidth / 2 - 2, viewportWidth / 2 + 2),
        startY: random(-viewportHeight / 2 - 2, viewportHeight / 2 + 2),
        speed: random(0.5, 0.9),
        direction: random(15, 45), // Diagonal landai ke kanan-atas (tidak vertikal)
        scale: random(0.65, 0.9),
        delay: random(0, 6),
        useModel: true,
        isVertical: false
      });
    }
    
    for (let i = 0; i < 3; i++) {
      fishArray.push({
        startX: random(-viewportWidth / 2 - 2, viewportWidth / 2 + 2),
        startY: random(-viewportHeight / 2 - 2, viewportHeight / 2 + 2),
        speed: random(0.5, 0.9),
        direction: random(210, 240), // Diagonal landai ke kiri-bawah (tidak vertikal)
        scale: random(0.65, 0.9),
        delay: random(0, 6),
        useModel: true,
        isVertical: false
      });
    }

    for (let i = 0; i < 3; i++) {
      fishArray.push({
        startX: random(-viewportWidth / 2 - 2, viewportWidth / 2 + 2),
        startY: random(-viewportHeight / 2 - 2, viewportHeight / 2 + 2),
        speed: random(0.5, 0.9),
        direction: random(135, 165), // Diagonal landai (tidak vertikal)
        scale: random(0.65, 0.9),
        delay: random(0, 6),
        useModel: true,
        isVertical: false
      });
    }
    
    // Tambahan ikan dengan arah diagonal lainnya
    for (let i = 0; i < 2; i++) {
      fishArray.push({
        startX: random(-viewportWidth / 2 - 2, viewportWidth / 2 + 2),
        startY: random(-viewportHeight / 2 - 2, viewportHeight / 2 + 2),
        speed: random(0.5, 0.9),
        direction: random(315, 345), // Diagonal landai ke kanan-bawah (tidak vertikal)
        scale: random(0.65, 0.9),
        delay: random(0, 6),
        useModel: true,
        isVertical: false
      });
    }
    
    for (let i = fishArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fishArray[i], fishArray[j]] = [fishArray[j], fishArray[i]];
    }
    
    return fishArray;
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#4A90E2" />

      {fishes.map((fish, index) => (
        <Suspense 
          key={`fish-${index}`} 
          fallback={
            <SimpleFish
              startX={fish.startX}
              startY={fish.startY}
              speed={fish.speed}
              direction={fish.direction}
              delay={fish.delay}
              scale={fish.scale}
              isVertical={fish.isVertical}
            />
          }
        >
          {fish.useModel ? (
            <AnimatedFish3D
              startX={fish.startX}
              startY={fish.startY}
              speed={fish.speed}
              direction={fish.direction}
              scale={fish.scale}
              delay={fish.delay}
              isVertical={fish.isVertical}
            />
          ) : (
            <SimpleFish
              startX={fish.startX}
              startY={fish.startY}
              speed={fish.speed}
              direction={fish.direction}
              delay={fish.delay}
              scale={fish.scale}
              isVertical={fish.isVertical}
            />
          )}
        </Suspense>
      ))}
    </>
  );
}

export default function Fish3DBackground() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <FishScene />
        </Suspense>
      </Canvas>
    </div>
  );
}


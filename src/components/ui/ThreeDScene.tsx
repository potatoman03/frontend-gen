'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import type { Group } from 'three';

type ModelProps = {
  modelPath: string;
  autoRotate: boolean;
  scrollLinked: boolean;
};

function Model({ modelPath, autoRotate, scrollLinked }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<Group>(null);
  const { scrollYProgress } = useScroll();
  const progressRef = useRef(0);

  useEffect(() => {
    if (!scrollLinked) return;
    const unsubscribe = scrollYProgress.on('change', (v) => {
      progressRef.current = v;
    });
    return unsubscribe;
  }, [scrollLinked, scrollYProgress]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (scrollLinked) {
      groupRef.current.rotation.y = progressRef.current * Math.PI * 2;
    } else if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

type ThreeDSceneProps = {
  modelPath: string;
  fallbackImage: string;
  autoRotate: boolean;
  scrollLinked: boolean;
};

export default function ThreeDScene({
  modelPath,
  fallbackImage,
  autoRotate,
  scrollLinked
}: ThreeDSceneProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="relative h-full w-full">
        <Image src={fallbackImage} alt="" fill unoptimized className="object-contain" />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      onError={() => setError(true)}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Model modelPath={modelPath} autoRotate={autoRotate} scrollLinked={scrollLinked} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <Environment preset="city" />
    </Canvas>
  );
}

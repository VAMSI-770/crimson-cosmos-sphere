import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Orb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  const edges = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.8, 1);
    return new THREE.EdgesGeometry(geo);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.25;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x += delta * 0.15;
      wireRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group>
      <lineSegments ref={wireRef} geometry={edges}>
        <lineBasicMaterial color="#E50914" transparent opacity={0.35} />
      </lineSegments>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#0a0a0a"
          transparent
          opacity={0.15}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};

const FloatingCube = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} color="#E50914" intensity={1.5} />
        <pointLight position={[-4, -3, 3]} color="#7C3AED" intensity={0.8} />
        <pointLight position={[0, 3, 4]} color="#22D3EE" intensity={0.3} />
        <Orb />
      </Canvas>
    </div>
  );
};

export default FloatingCube;

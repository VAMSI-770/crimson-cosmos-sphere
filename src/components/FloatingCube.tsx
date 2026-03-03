import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RotatingCube = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const edges = useMemo(() => {
    const geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    return new THREE.EdgesGeometry(geometry);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.3;
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#e60000" transparent opacity={0.7} />
      </lineSegments>
      <mesh>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial
          color="#1a0000"
          transparent
          opacity={0.15}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};

const FloatingCube = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} color="#ff1e1e" intensity={1.5} />
        <pointLight position={[-5, -5, 3]} color="#8b0000" intensity={0.8} />
        <RotatingCube />
      </Canvas>
    </div>
  );
};

export default FloatingCube;

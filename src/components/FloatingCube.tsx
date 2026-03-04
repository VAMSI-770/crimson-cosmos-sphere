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
      groupRef.current.rotation.x += delta * 0.25;
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#cc0000" transparent opacity={0.6} />
      </lineSegments>
      <mesh>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial
          color="#1a0000"
          transparent
          opacity={0.12}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};

const FloatingCube = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} color="#cc0000" intensity={1.5} />
        <pointLight position={[-5, -5, 3]} color="#B8860B" intensity={0.6} />
        <pointLight position={[0, -3, 4]} color="#8b0000" intensity={0.4} />
        <RotatingCube />
      </Canvas>
    </div>
  );
};

export default FloatingCube;

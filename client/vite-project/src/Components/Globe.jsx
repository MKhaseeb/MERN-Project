import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function Earth() {
  const earthRef = useRef();

  const [colorMap, bumpMap, specularMap] = useLoader(THREE.TextureLoader, [
    "/textures/Earth.jpg",
  ]);

  useFrame(() => {
    earthRef.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.05}
        specularMap={specularMap}
        specular={new THREE.Color("grey")}
      />
    </mesh>
  );
}

export default function Globe() {
  return (
    <Canvas   style={{ width: "100%", height: "100%" }}
    camera={{ position: [3, 0, 3], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={1.2} />
      <Earth />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
    </Canvas>
  );
}

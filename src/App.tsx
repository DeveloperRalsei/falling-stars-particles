import { OrbitControls, Stats, Trail } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { Mesh, MeshStandardMaterial, Vector3 } from "three";

const randomPos = () => (Math.random() - 0.5) * 25;

const Particle = ({ moving }: { moving: boolean }) => {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);
  const [trailKey, setTrailKey] = useState(Math.random());

  const showTrail = Math.random() < 0.1;
  const isGlinting = Math.random() < 0.05;

  useFrame((state) => {
    const ctx = ref.current;
    if (!ctx) return;
    if (moving) {
      ctx.position.y -= 0.008;

      if (ctx.position.y < -10) {
        ctx.position.y = 10;
        ctx.position.x = randomPos();
        ctx.position.z = randomPos();

        setTrailKey(Math.random());
      }
    }

    if (isGlinting && matRef.current) {
      const time = state.clock.getElapsedTime();
      matRef.current.emissiveIntensity = 5 + Math.sin(time * 10) * 2;
    }
  });

  return (
    <>
      <mesh
        ref={ref}
        position={new Vector3(randomPos(), randomPos(), randomPos())}
      >
        <sphereGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial
          ref={matRef}
          color="#00ccff"
          emissive="#00ccff"
          emissiveIntensity={2}
        />
      </mesh>
      {showTrail && (
        <Trail
          key={trailKey}
          width={0.6}
          length={10}
          color={"#00ccff"}
          attenuation={(t) => t * t}
          target={ref}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0f0f0f",
      }}
    >
      <EffectComposer>
        <Bloom />
      </EffectComposer>
      <ambientLight intensity={1} />
      <Stats />
      <OrbitControls />
      {Array(128)
        .fill(0)
        .map((_, i) => (
          <Particle key={i} moving={false} />
        ))}
      {Array(512)
        .fill(0)
        .map((_, i) => (
          <Particle key={i} moving />
        ))}
    </Canvas>
  );
}

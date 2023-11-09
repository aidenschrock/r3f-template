import { OrbitControls, Bounds, Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { Physics, usePlane, useSphere, Debug } from "@react-three/cannon";
import * as THREE from "three";
import { useMemo } from "react";
import { OrderedDither } from "./ordered dither/OrderedDither";

function App() {
  function InstancedSpheres({ count = 18 }) {
    const colors = [
      "#DDC900",
      "#FFA304",
      "#FFD3AD",
      "#DDC900",
      "#FFA304",
      "#FFD3AD",
      "#DDC900",
      "#FFA304",
      "#FFD3AD",
      "#DDC900",
      "#FFA304",
      "#FFD3AD",
      "#DDC900",
      "#FFA304",
      "#FFD3AD",
      "#DDC900",
      "#FFA304",
      "#FFD3AD",
    ];
    const tempColor = new THREE.Color();

    const colorArray = useMemo(
      () =>
        Float32Array.from(
          new Array(count * 3)
            .fill()
            .flatMap((_, i) => tempColor.set(colors[i]).toArray())
        ),
      []
    );

    const { viewport } = useThree();

    const [ref] = useSphere((index) => ({
      mass: 100,
      position: [5 - Math.random() * 10, viewport.height + index * 0.1, 0, 0],
      args: [2],
    }));
    return (
      <instancedMesh ref={ref} args={[null, null, count]}>
        <sphereGeometry args={[2, 32, 32]}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colorArray, 3]}
          />
        </sphereGeometry>
        <meshStandardMaterial vertexColors />
      </instancedMesh>
    );
  }

  function Borders() {
    const { viewport } = useThree();
    return (
      <>
        <Plane
          position={[0, -viewport.height / 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <Plane position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Plane position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <Plane position={[0, 0, -2]} rotation={[0, 0, 0]} />
        <Plane position={[0, 0, 2]} rotation={[0, -Math.PI, 0]} />
      </>
    );
  }

  function Plane({ color, ...props }) {
    usePlane(() => ({ ...props }));
    return null;
  }

  function Mouse() {
    const { viewport } = useThree();
    const [, api] = useSphere(() => ({ type: "Kinematic", args: [7] }));
    return useFrame((state) =>
      api.position.set(
        (state.mouse.x * viewport.width) / 2,
        (state.mouse.y * viewport.height) / 2,
        7
      )
    );
  }

  return (
    <>
      <Canvas shadows
        gl={{ stencil: false, antialias: false }}
        camera={{ position: [0, 0, 15], fov: 50, near: 17, far: 40 }}>
        <Physics
          gravity={[0, -25, 0]}
          defaultContactMaterial={{ restitution: 0.1, friction: 0 }}
        >
          <group position={[0, 0, -10]}>
            <Mouse />
            {/* <Debug> */}
            <Borders />
            {/* </Debug> */}

            <InstancedSpheres />
          </group>
        </Physics>
        <Environment preset="warehouse" background blur={0.5} />
        <EffectComposer>
          <OrderedDither invertDither={true} darkThreshold={25} />
          <SSAO
            radius={0.4}
            intensity={50}
            luminanceInfluence={0.4}
            color="#F8147F"
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;

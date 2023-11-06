import { OrbitControls, Bounds } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function App() {
  function Mesh() {
    return (
      <mesh>
        <boxGeometry />
        <meshLambertMaterial />
      </mesh>
    );
  }

  return (
    <>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={2} color="#0a3be7" />
        <directionalLight intensity={2} position={[0, 10, 20]} />
        <Bounds fit observe margin={3}>
          <Mesh />
        </Bounds>
      </Canvas>
    </>
  );
}

export default App;

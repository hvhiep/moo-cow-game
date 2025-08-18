import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

// Hook để load GLTF một lần và chia sẻ cho tất cả components
function useAnimalsGLTF() {
  const { scene, nodes } = useGLTF("./low_poly_animals/scene.gltf");
  return { scene, nodes };
}

// Component cho từng con vật riêng biệt với props tùy chỉnh
export function Pig({
  position = [0, 0, 0],
  scale = [0.3, 0.3, 0.3],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useAnimalsGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {nodes["Cube"] && <primitive object={nodes["Cube"].clone()} />}
    </group>
  );
}

export function Sheep({
  position = [0, 0, 0],
  scale = [0.3, 0.3, 0.3],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useAnimalsGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {nodes["Cube.001"] && <primitive object={nodes["Cube.001"].clone()} />}
    </group>
  );
}

export function Cow({
  position = [0, 0, 0],
  scale = [0.3, 0.3, 0.3],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useAnimalsGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {nodes["cow"] && <primitive object={nodes["cow"].clone()} />}
    </group>
  );
}

export function Dog({
  position = [0, 0, 0],
  scale = [0.3, 0.3, 0.3],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useAnimalsGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {nodes["dog"] && <primitive object={nodes["dog"].clone()} />}
    </group>
  );
}

export function Chicken({
  position = [0, 0, 0],
  scale = [0.3, 0.3, 0.3],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useAnimalsGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {nodes["Cube.002"] && <primitive object={nodes["Cube.002"].clone()} />}
    </group>
  );
}

// Component để hiển thị tất cả con vật
export function AllAnimals({ spacing = 2 }) {
  return (
    <>
      <Cow position={[-spacing * 2, -1, 0]} />
      <Sheep position={[-spacing, -1, 0]} />
      <Dog position={[0, -1, 0]} />
      <Pig position={[spacing, -1, 0]} />
      <Chicken position={[spacing * 2, -1, 0]} />
    </>
  );
}

// Component để tạo farm với nhiều con vật
export function Farm() {
  return (
    <>
      {/* Hàng đầu */}
      <Cow position={[-3, -1, -2]} />
      <Cow position={[-1, -1, -2]} rotation={[0, Math.PI / 4, 0]} />
      <Sheep position={[1, -1, -2]} />
      <Sheep position={[3, -1, -2]} rotation={[0, -Math.PI / 4, 0]} />

      {/* Hàng giữa */}
      <Dog position={[-2, -1, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Pig position={[0, -1, 0]} />
      <Chicken position={[2, -1, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Hàng cuối */}
      <Pig position={[-1, -1, 2]} rotation={[0, Math.PI, 0]} />
      <Dog position={[1, -1, 2]} />
    </>
  );
}

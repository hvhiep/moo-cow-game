import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

// Hook để load GLTF nature kit
function useNatureKitGLTF() {
  const { scene, nodes } = useGLTF("/low_poly_nature_kit/scene.gltf");
  return { scene, nodes };
}

// Hook để load GLTF finish line
function useFinishLineGLTF() {
  const { scene, nodes } = useGLTF("/finish_line/scene.gltf");
  return { scene, nodes };
}

// Hook để load GLTF fence
function useFenceGLTF() {
  const { scene, nodes } = useGLTF("/low_poly_fence/scene.gltf");
  return { scene, nodes };
}

// Component Landscape với mô hình Solo_Gramado
export function Landscape({
  position = [0, -2, 0],
  scale = [0.01, 0.01, 0.01],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useNatureKitGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {nodes["Solo_Gramado"] && (
        <primitive object={nodes["Solo_Gramado"].clone()} />
      )}
    </group>
  );
}

// Component FinishLine để đánh dấu điểm bắt đầu và kết thúc
export function FinishLine({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
}) {
  const { scene } = useFinishLineGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Component LowFence để tạo hàng rào
export function LowFence({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
}) {
  const { scene } = useFenceGLTF();
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      <primitive object={scene.clone()} />
    </group>
  );
}

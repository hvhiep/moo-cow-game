import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text, Center } from "@react-three/drei";
import React, { useState, useRef } from "react";
import "./App.css";
import {
  Farm,
  AllAnimals,
  Cow,
  Sheep,
  Dog,
  Pig,
  Chicken,
} from "./AnimalComponents";
import { Landscape, FinishLine, LowFence } from "./LandscapeComponents";

// Component để hiển thị trục tọa độ Oxyz
function AxesHelper({ size = 5 }) {
  return (
    <group>
      {/* Trục X - màu đỏ */}
      <Line
        points={[
          [0, 0, 0],
          [size, 0, 0],
        ]}
        color="red"
        lineWidth={3}
      />
      <Text
        position={[size + 0.5, 0, 0]}
        fontSize={1}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>

      {/* Trục Y - màu xanh lá */}
      <Line
        points={[
          [0, 0, 0],
          [0, size, 0],
        ]}
        color="green"
        lineWidth={3}
      />
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={1}
        color="green"
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>

      {/* Trục Z - màu xanh dương */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0, size],
        ]}
        color="blue"
        lineWidth={3}
      />
      <Text
        position={[0, 0, size + 0.5]}
        fontSize={1}
        color="blue"
        anchorX="center"
        anchorY="middle"
      >
        Z
      </Text>

      {/* Điểm gốc O */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <Text
        position={[-0.3, -0.3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        O
      </Text>
    </group>
  );
}

// Component để quản lý animation của race track
function RaceTrack({ isRacing, speed = 10, shouldReset, onResetComplete }) {
  const landscapeRef = useRef();
  const startLineRef = useRef();
  const finishLineRef = useRef();
  const fenceGroupsRef = useRef([]);

  // Vị trí ban đầu cho 5 cụm fence (mỗi cụm có 2 fence đối xứng)
  const initialFencePositions = useRef([
    { left: [3, 0, 70], right: [-17, 0, 70] }, // Cụm 1
    { left: [3, 0, 140], right: [-17, 0, 140] }, // Cụm 1
    { left: [3, 0, 210], right: [-17, 0, 210] }, // Cụm 1
    { left: [3, 0, 280], right: [-17, 0, 280] }, // Cụm 1
    { left: [3, 0, 350], right: [-17, 0, 350] }, // Cụm 1
  ]);

  // Vị trí ban đầu
  const initialPositions = useRef({
    landscape: [0, -2, 520],
    startLine: [0, 0, 20],
    finishLine: [0, 0, 950],
  });

  // Xử lý reset
  React.useEffect(() => {
    if (shouldReset) {
      // Reset vị trí về ban đầu
      if (landscapeRef.current) {
        landscapeRef.current.position.set(0, 0, 0);
      }
      if (startLineRef.current) {
        startLineRef.current.position.set(
          ...initialPositions.current.startLine
        );
      }
      if (finishLineRef.current) {
        finishLineRef.current.position.set(
          ...initialPositions.current.finishLine
        );
      }

      // Reset tất cả fence groups
      fenceGroupsRef.current.forEach((group) => {
        if (group) {
          group.position.set(0, 0, 0); // Reset group position
        }
      });

      // Thông báo hoàn thành reset
      onResetComplete && onResetComplete();
    }
  }, [shouldReset, onResetComplete]);

  useFrame((state, delta) => {
    if (isRacing) {
      const movement = -speed * delta; // Di chuyển về phía âm Z

      // Di chuyển Landscape
      if (landscapeRef.current) {
        landscapeRef.current.position.z += movement;
      }

      // Di chuyển Start Line
      if (startLineRef.current) {
        startLineRef.current.position.z += movement;
      }

      // Di chuyển Finish Line
      if (finishLineRef.current) {
        finishLineRef.current.position.z += movement;
      }

      // Di chuyển tất cả Fence groups
      fenceGroupsRef.current.forEach((group) => {
        if (group) {
          group.position.z += movement;
        }
      });
    }
  });

  return (
    <>
      {/* Landscape */}
      <group ref={landscapeRef}>
        <Center position={[0, -2, 520]}>
          <Landscape
            position={[0, 0, 0]}
            scale={[0.03, 0.04, 0.9]}
            rotation={[0, 0, 0]}
          />
        </Center>
      </group>

      {/* Start Line */}
      <group ref={startLineRef}>
        <FinishLine
          position={[0, 0, 20]}
          scale={[6, 3, 2]}
          rotation={[0, 0, 0]}
        />
      </group>

      {/* Finish Line */}
      <group ref={finishLineRef}>
        <FinishLine
          position={[0, 0, 950]}
          scale={[6, 3, 2]}
          rotation={[0, 0, 0]}
        />
      </group>

      {/* 5 cụm Fence - mỗi cụm có 2 fence đối xứng */}
      {initialFencePositions.current.map((fenceGroup, index) => (
        <group key={index} ref={(el) => (fenceGroupsRef.current[index] = el)}>
          {/* Fence bên trái */}
          <LowFence
            position={fenceGroup.left}
            scale={[0.02, 0.02, 0.02]}
            rotation={[0, 0, 0]}
          />
          {/* Fence bên phải */}
          <LowFence
            position={fenceGroup.right}
            scale={[0.02, 0.02, 0.02]}
            rotation={[0, 0, 0]}
          />
        </group>
      ))}
    </>
  );
}

function Scene({ isRacing, raceSpeed, shouldReset, onResetComplete }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Trục tọa độ Oxyz */}
      <AxesHelper size={1000} />

      {/* Cow được center tự động tại gốc tọa độ - KHÔNG di chuyển */}
      <Center position={[0, 3, 0]}>
        <Cow
          position={[0, 0, 0]}
          scale={[0.04, 0.04, 0.04]}
          rotation={[0, 0, 0]}
        />
      </Center>

      {/* Race Track với animation */}
      <RaceTrack
        isRacing={isRacing}
        speed={raceSpeed}
        shouldReset={shouldReset}
        onResetComplete={onResetComplete}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={1000}
        minDistance={0.5}
        panSpeed={2}
        zoomSpeed={1.5}
      />
    </>
  );
}

function App() {
  const [isRacing, setIsRacing] = useState(false);
  const [raceSpeed, setRaceSpeed] = useState(50);
  const [shouldReset, setShouldReset] = useState(false);

  // Hàm startRace
  const startRace = (speed = 20) => {
    setRaceSpeed(speed);
    setIsRacing(true);
  };

  // Hàm resetRace
  const resetRace = () => {
    setIsRacing(false);
    setShouldReset(true);
  };

  // Callback khi reset hoàn thành
  const handleResetComplete = () => {
    setShouldReset(false);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Container cho các nút */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        {/* Nút Start */}
        <button
          onClick={() => startRace(20)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start
        </button>

        {/* Nút Reset */}
        <button
          onClick={resetRace}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <Canvas
        camera={{
          position: [0, 5, 10],
          fov: 60,
          near: 0.1,
          far: 10000,
        }}
        gl={{
          logarithmicDepthBuffer: true,
          antialias: true,
        }}
      >
        <Scene
          isRacing={isRacing}
          raceSpeed={raceSpeed}
          shouldReset={shouldReset}
          onResetComplete={handleResetComplete}
        />
      </Canvas>
    </div>
  );
}

export default App;

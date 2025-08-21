import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text, Center } from "@react-three/drei";
import * as THREE from "three";
import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import {
  Farm,
  AllAnimals,
  Cow,
  Sheep,
  Dog,
  Elephant,
  Chicken,
} from "./AnimalComponents";
import {
  Landscape,
  FinishLine,
  LowFence,
  HighFence,
} from "./LandscapeComponents";

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

// Component để quản lý Cow với button controls
function CowWithControls({
  position = [0, 0, 0],
  scaleUp,
  scaleDown,
  shouldResetScale,
}) {
  const groupRef = useRef();
  const cowRef = useRef();
  const isScalingUp = useRef(false);
  const isScalingDown = useRef(false);

  // Store initial values và bounding box
  const initialPosition = useRef([...position]);
  const initialScale = useRef([0.15, 0.15, 0.15]);
  // const initialScale = useRef([0.18, 0.18, 0.18]);
  const cowBounds = useRef(null);

  // Calculate bounding box khi component mount
  useEffect(() => {
    if (cowRef.current) {
      // Tính bounding box của cow model
      const box = new THREE.Box3().setFromObject(cowRef.current);
      cowBounds.current = {
        height: box.max.y - box.min.y,
        center: box.getCenter(new THREE.Vector3()),
      };
    }
  }, []);

  // Update scaling state when props change
  useEffect(() => {
    isScalingUp.current = scaleUp;
  }, [scaleUp]);

  useEffect(() => {
    isScalingDown.current = scaleDown;
  }, [scaleDown]);

  // Reset scale when shouldResetScale is true
  useEffect(() => {
    if (shouldResetScale && groupRef.current) {
      // Reset scale về giá trị ban đầu
      groupRef.current.scale.set(
        initialScale.current[0],
        initialScale.current[1],
        initialScale.current[2]
      );
      // Reset position về vị trí ban đầu
      groupRef.current.position.set(
        initialPosition.current[0],
        initialPosition.current[1],
        initialPosition.current[2]
      );
    }
  }, [shouldResetScale]);

  // Smooth animation với useFrame
  useFrame((state, delta) => {
    if (!groupRef.current || !cowBounds.current) return;

    const speed = 0.2; // Tốc độ thay đổi scale (units per second)
    const change = speed * delta;

    let newScale = {
      x: groupRef.current.scale.x,
      y: groupRef.current.scale.y,
      z: groupRef.current.scale.z,
    };
    let hasScaleChanged = false;

    if (isScalingUp.current) {
      // Button Up: tăng Y, giảm X
      const newY = Math.min(newScale.y + change, 0.3);
      const newX = Math.max(newScale.x - change, 0.03);
      if (newY !== newScale.y || newX !== newScale.x) {
        newScale.y = newY;
        newScale.x = newX;
        hasScaleChanged = true;
      }
    }

    if (isScalingDown.current) {
      // Button Down: giảm Y, tăng X
      const newY = Math.max(newScale.y - change, 0.03);
      const newX = Math.min(newScale.x + change, 0.3);

      if (newY !== newScale.y || newX !== newScale.x) {
        newScale.y = newY;
        newScale.x = newX;
        hasScaleChanged = true;
      }
    }

    // Chỉ update khi có thay đổi
    if (hasScaleChanged) {
      // Tính toán position compensation để Cow không chìm xuống đất
      // Khi scale thay đổi từ initialScale lên newScale, phần dưới sẽ di chuyển xuống
      // Ta cần đẩy toàn bộ object lên để giữ chân ở mặt đất

      const scaleRatio = newScale.y / initialScale.current[1]; // Tỷ lệ scale so với ban đầu
      const originalHeight = cowBounds.current.height * initialScale.current[1];
      const newHeight = originalHeight * scaleRatio;
      const heightDifference = newHeight - originalHeight;

      // Compensation = một nửa sự thay đổi chiều cao để giữ chân ở mặt đất
      const positionCompensation = heightDifference / 2;

      // Update scale Y
      groupRef.current.scale.set(newScale.x, newScale.y, newScale.z);

      // Update position Y để compensation
      groupRef.current.position.y =
        initialPosition.current[1] + positionCompensation;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={initialScale.current}>
      <Center>
        <Cow ref={cowRef} position={[0, 0, 0]} rotation={[0, 0, 0]} />
        {/* <Elephant ref={cowRef} position={[0, 0, 0]} rotation={[0, 0, 0]} /> */}
      </Center>
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
    { type: "high", pos: [0.2, -2, 70] },
    { left: [3, 0, 140], right: [-17, 0, 140] },
    {
      type: "high",
      pos: [0.2, -2, 210],
    },
    {
      type: "high",
      pos: [0.2, -2, 250],
    },
    { left: [3, 0, 300], right: [-17, 0, 300] },
    {
      type: "high",
      pos: [0.2, -2, 370],
    },
    { left: [3, 0, 440], right: [-17, 0, 440] },
    { left: [3, 0, 460], right: [-17, 0, 460] },
    {
      type: "high",
      pos: [0.2, -2, 530],
    },
    {
      type: "high",
      pos: [0.2, -2, 600],
    },
  ]);

  // Xử lý reset
  React.useEffect(() => {
    if (shouldReset) {
      // Reset vị trí về ban đầu
      if (landscapeRef.current) {
        landscapeRef.current.position.set(0, -2, 520);
      }
      if (startLineRef.current) {
        startLineRef.current.position.set(0, 0, 20);
      }
      if (finishLineRef.current) {
        finishLineRef.current.position.set(0, 0, 950);
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
      <group ref={landscapeRef} position={[0, -2, 520]}>
        <Center position={[0, 0, 0]}>
          <Landscape
            position={[0, 0, 0]}
            scale={[0.03, 0.04, 0.9]}
            rotation={[0, 0, 0]}
          />
        </Center>
      </group>

      {/* Start Line */}
      <group ref={startLineRef} position={[0, 0, 20]}>
        <FinishLine
          position={[0, 0, 0]}
          scale={[6, 3, 2]}
          rotation={[0, 0, 0]}
        />
      </group>

      {/* Finish Line */}
      <group ref={finishLineRef} position={[0, 0, 950]}>
        <FinishLine
          position={[0, 0, 0]}
          scale={[6, 3, 2]}
          rotation={[0, 0, 0]}
        />
      </group>

      {/* 5 cụm Fence - mỗi cụm có 2 fence đối xứng */}
      {initialFencePositions.current.map((fenceGroup, index) => {
        if (fenceGroup.type === "high") {
          return (
            <group
              key={index}
              ref={(el) => (fenceGroupsRef.current[index] = el)}
            >
              <HighFence
                position={fenceGroup.pos}
                scale={[0.3, 0.15, 0.2]}
                rotation={[0, 0, 0]}
              />
            </group>
          );
        }

        return (
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
        );
      })}
    </>
  );
}

function Scene({
  isRacing,
  raceSpeed,
  shouldReset,
  onResetComplete,
  isScaleUp,
  isScaleDown,
  shouldResetScale,
}) {
  console.log("--[RE-RENDER][Scene]");
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Trục tọa độ Oxyz */}
      <AxesHelper size={1000} />

      {/* Cow với button controls - KHÔNG di chuyển */}
      <CowWithControls
        position={[0, 4, 0]}
        scaleUp={isScaleUp}
        scaleDown={isScaleDown}
        shouldResetScale={shouldResetScale}
      />

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
        // Target - điểm mà camera nhìn vào:
        // Nhìn vào gốc tọa độ (mặc định)
        target={[0, 0, 0]}
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
  const [isScaleUp, setIsScaleUp] = useState(false);
  const [isScaleDown, setIsScaleDown] = useState(false);
  const [shouldResetScale, setShouldResetScale] = useState(false);

  // Hàm startRace
  const startRace = (speed = 20) => {
    setRaceSpeed(speed);
    setIsRacing(true);
  };

  // Hàm resetRace
  const resetRace = () => {
    setIsRacing(false);
    setShouldReset(true);
    setShouldResetScale(true);
  };

  // Callback khi reset hoàn thành
  const handleResetComplete = () => {
    setShouldReset(false);
    setShouldResetScale(false);
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
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Controls */}
        <div style={{ display: "flex", gap: "10px" }}>
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

        {/* Scale Controls */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Nút Up */}
          <button
            onMouseDown={() => setIsScaleUp(true)}
            onMouseUp={() => setIsScaleUp(false)}
            onMouseLeave={() => setIsScaleUp(false)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Up ↑
          </button>

          {/* Nút Down */}
          <button
            onMouseDown={() => setIsScaleDown(true)}
            onMouseUp={() => setIsScaleDown(false)}
            onMouseLeave={() => setIsScaleDown(false)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Down ↓
          </button>
        </div>

        {/* Hướng dẫn button controls */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            maxWidth: "200px",
          }}
        >
          <div>
            <strong>Button Controls:</strong>
          </div>
          <div>↑ Up Button: Cow cao lên (realistic growth)</div>
          <div>↓ Down Button: Cow thấp xuống</div>
          <div style={{ marginTop: "5px", fontSize: "11px", color: "#ccc" }}>
            Nhấn và giữ button để thay đổi liên tục
          </div>
        </div>
      </div>

      <Canvas
        camera={{
          // Tọa độ đặt camera
          position: [-30, 20, -30],
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
          isScaleUp={isScaleUp}
          isScaleDown={isScaleDown}
          shouldResetScale={shouldResetScale}
          onResetComplete={handleResetComplete}
        />
      </Canvas>
    </div>
  );
}

export default App;

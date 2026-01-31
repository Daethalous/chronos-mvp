import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { MOCK_NODES } from '../data/mockData';
import { EventNode } from '../types';

// Helper to calculate 3D positions based on year and timeline
const getPosition = (node: EventNode): [number, number, number] => {
  const y = (node.year - 1980) * 2; // Vertical timeline
  
  let x = 0;
  // Simple timeline mapping
  if (node.timeline_id === 'alpha') x = 0;
  else if (node.timeline_id === 'beta') x = -6;
  else if (node.timeline_id === 'gamma') x = 6;
  else x = (node.node_id.length % 4) * 2 - 4; // Randomish fallback

  // Add some jitter based on node id hash for visual interest if needed, 
  // but keep it aligned for now.
  
  return [x, y, 0];
};

const TreeNode = ({ 
  node, 
  position,
  isCurrent,
  isVisited
}: { 
  node: EventNode; 
  position: [number, number, number];
  isCurrent: boolean;
  isVisited: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const navigate = useNavigate();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      if (isCurrent) {
        meshRef.current.rotation.x += delta;
      }
    }
  });

  const color = useMemo(() => {
    if (isCurrent) return '#3b82f6'; // Blue
    if (isVisited) return '#ffd700'; // Gold
    return '#475569'; // Slate
  }, [isCurrent, isVisited]);

  const size = isCurrent ? 0.8 : (isVisited ? 0.6 : 0.4);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setHover(false);
        }}
        onClick={() => {
            // Optional: navigate or show details
            console.log('Clicked node:', node.node_id);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered || isCurrent ? 0.6 : 0.1}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {(hovered || isCurrent) && (
        <Html distanceFactor={10}>
          <div className={`
            pointer-events-none select-none px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap
            bg-black/80 text-white border border-white/20 backdrop-blur-sm
            transform -translate-y-8
          `}>
            <div className="text-yellow-400">{node.year}</div>
            <div>{node.node_id}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

const Connections = () => {
  const lines = useMemo(() => {
    const connections: JSX.Element[] = [];
    
    Object.values(MOCK_NODES).forEach(node => {
      if (node.parent_id && MOCK_NODES[node.parent_id]) {
        const parent = MOCK_NODES[node.parent_id];
        const start = getPosition(parent);
        const end = getPosition(node);
        
        connections.push(
          <Line
            key={`${parent.node_id}-${node.node_id}`}
            points={[start, end]}
            color="#475569"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        );
      }
    });
    
    return connections;
  }, []);

  return <group>{lines}</group>;
};

export const WorldLine3D = () => {
  const { gameState } = useGame();
  
  // Calculate center based on current node to auto-focus camera
  const currentNode = MOCK_NODES[gameState.currentNodeId];
  const centerPos = currentNode ? getPosition(currentNode) : [0, 0, 0];

  return (
    <div className="w-full h-full bg-slate-950">
      <Canvas camera={{ position: [0, centerPos[1], 15], fov: 60 }}>
        <color attach="background" args={['#0f172a']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <group>
          {Object.values(MOCK_NODES).map(node => (
            <TreeNode
              key={node.node_id}
              node={node}
              position={getPosition(node)}
              isCurrent={gameState.currentNodeId === node.node_id}
              isVisited={gameState.history.includes(node.node_id)}
            />
          ))}
          <Connections />
        </group>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, centerPos[1], 0]} // Focus on current height
        />
      </Canvas>
    </div>
  );
};

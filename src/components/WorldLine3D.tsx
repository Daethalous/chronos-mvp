import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { MOCK_NODES } from '../data/mockData';
import { EventNode } from '../types';
import { X } from 'lucide-react';

// Helper to calculate 3D positions based on year and timeline
const getPosition = (node: EventNode): [number, number, number] => {
  const y = (node.year - 1980) * 2; // Vertical timeline
  
  let x = 0;
  // Simple timeline mapping
  if (node.timeline_id === 'alpha') x = 0;
  else if (node.timeline_id === 'beta') x = -6;
  else if (node.timeline_id === 'gamma') x = 6;
  else x = (node.node_id.length % 4) * 2 - 4; // Randomish fallback

  return [x, y, 0];
};

const NodeModal = ({ node, onClose }: { node: EventNode; onClose: () => void }) => {
  const { timeTravel } = useGame();
  const navigate = useNavigate();

  const handleTimeTravel = () => {
    timeTravel(node.node_id);
    navigate('/game');
    onClose();
  };

  return (
    <Html position={[0, 0, 0]} center>
      <div className="bg-slate-900/90 border border-yellow-500/50 p-6 rounded-xl w-80 text-white backdrop-blur-md shadow-2xl relative">
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="absolute top-2 right-2 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="text-yellow-500 text-sm font-mono mb-1">{node.year}</div>
        <h3 className="text-xl font-bold mb-3">{node.node_id}</h3>
        <p className="text-sm text-slate-300 mb-4 line-clamp-3">
          {node.description}
        </p>
        
        <div className="flex gap-2">
           <button
             onClick={(e) => { e.stopPropagation(); handleTimeTravel(); }}
             className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg font-bold transition-colors text-sm"
           >
             进入此时间线观测
           </button>
        </div>
      </div>
    </Html>
  );
};

const TreeNode = ({ 
  node, 
  position,
  isCurrent,
  isVisited,
  onClick,
  isSelected
}: { 
  node: EventNode; 
  position: [number, number, number];
  isCurrent: boolean;
  isVisited: boolean;
  onClick: (node: EventNode) => void;
  isSelected: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      if (isCurrent || isSelected) {
        meshRef.current.rotation.x += delta;
      }
    }
  });

  const color = useMemo(() => {
    if (isCurrent) return '#3b82f6'; // Blue
    if (node.timeline_id === 'alpha') return '#f97316'; // Orange-500 (Main Trunk)
    if (isVisited) return '#ffd700'; // Gold
    return '#475569'; // Slate
  }, [isCurrent, isVisited, node.timeline_id]);

  const size = isCurrent || isSelected ? 0.8 : (node.timeline_id === 'alpha' ? 0.6 : 0.4);

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
        onClick={(e) => {
            e.stopPropagation();
            onClick(node);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered || isCurrent || isSelected ? 0.6 : 0.1}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {(hovered || isCurrent) && !isSelected && (
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

      {isSelected && (
        <NodeModal node={node} onClose={() => onClick(null as any)} />
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
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
        
        <group onClick={() => setSelectedNodeId(null)}>
          {Object.values(MOCK_NODES).map(node => (
            <TreeNode
              key={node.node_id}
              node={node}
              position={getPosition(node)}
              isCurrent={gameState.currentNodeId === node.node_id}
              isVisited={gameState.history.includes(node.node_id)}
              onClick={(n) => {
                  if (n) setSelectedNodeId(n.node_id);
                  else setSelectedNodeId(null);
              }}
              isSelected={selectedNodeId === node.node_id}
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

import { useEffect, useRef } from 'react';
import cytoscape, { ElementDefinition } from 'cytoscape';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const MapPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameState, nodes, jumpToNode } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;

    // Transform Mock Data to Cytoscape Elements
    const elements: ElementDefinition[] = [];
    
    // Use nodes from context (includes dynamically generated ones)
    Object.values(nodes).forEach(node => {
        // Node
        const isVisited = gameState.history.includes(node.node_id);
        const isCurrent = gameState.currentNodeId === node.node_id;
        
        elements.push({
            data: { 
                id: node.node_id, 
                label: `${node.year}`, // Just show year to keep it clean
                color: node.timeline_id === 'alpha' ? '#eab308' : '#94a3b8', // Yellow for alpha, Slate for others
                shape: isCurrent ? 'star' : 'ellipse',
                visited: isVisited ? 'yes' : 'no'
            }
        });

        // Edges (Parent -> Node)
        if (node.parent_id) {
            elements.push({
                data: {
                    source: node.parent_id,
                    target: node.node_id
                }
            });
        }
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'width': 40,
            'height': 40,
            'border-width': 2,
            'border-color': '#fff'
          }
        },
        {
            selector: 'node[visited="yes"]',
            style: {
                'border-color': '#3b82f6', // Blue border for visited
                'border-width': 4
            }
        },
        {
            selector: 'node[shape="star"]', // Current node
            style: {
                'shape': 'star',
                'width': 60,
                'height': 60,
                'background-color': '#3b82f6'
            }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 50,
        spacingFactor: 1.5
      }
    });

    // Interaction
    cy.on('tap', 'node', (evt) => {
        const nodeId = evt.target.id();
        const node = nodes[nodeId];
        
        if (node) {
            jumpToNode(nodeId);
            navigate('/game');
        }
    });

    // Cleanup
    return () => {
      cy.destroy();
    };
  }, [gameState, nodes, jumpToNode, navigate]);

  return (
    <div className="h-screen w-full bg-slate-900 relative">
      <button 
        onClick={() => navigate('/game')} 
        className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur p-2 rounded-full text-white hover:bg-black/70 transition-colors border border-slate-700"
      >
        <ArrowLeft size={24} />
      </button>

      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur p-2 rounded-full text-white hover:bg-black/70 transition-colors border border-slate-700"
      >
        <Home size={24} />
      </button>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
          <h2 className="text-white/50 font-mono text-sm tracking-widest uppercase">Worldline Visualizer</h2>
      </div>

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

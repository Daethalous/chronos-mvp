import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { GameState, EventNode } from '../types';
import { INITIAL_STATS, MOCK_NODES } from '../data/mockData';
import { generateNextNode } from '../services/llm';

interface GameContextType {
  gameState: GameState;
  currentNode: EventNode;
  nodes: Record<string, EventNode>;
  makeChoice: (direction: 'left' | 'right') => Promise<void>;
  resetGame: (startNodeId?: string) => void;
  jumpToNode: (nodeId: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isGenerating: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState('');
  const [nodes, setNodes] = useState<Record<string, EventNode>>(MOCK_NODES);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Cache for pre-fetched nodes: Key = "currentNodeId-direction"
  const prefetchCache = useRef<Record<string, Promise<EventNode>>>({});
  
  const [gameState, setGameState] = useState<GameState>({
    currentNodeId: 'root',
    history: ['root'],
    stats: INITIAL_STATS,
  });

  const currentNode = nodes[gameState.currentNodeId];

  // Prefetching Effect
  useEffect(() => {
    if (apiKey && currentNode && !currentNode.node_id.startsWith('generating')) {
        ['left', 'right'].forEach(direction => {
            const cacheKey = `${currentNode.node_id}-${direction}`;
            if (!prefetchCache.current[cacheKey]) {
                console.log(`Prefetching ${cacheKey}...`);
                prefetchCache.current[cacheKey] = generateNextNode(apiKey, currentNode, direction as 'left' | 'right')
                    .catch(err => {
                        console.error(`Prefetch failed for ${cacheKey}`, err);
                        // Remove failed promise so retry is possible or error is handled later
                        delete prefetchCache.current[cacheKey];
                        throw err;
                    });
            }
        });
    }
  }, [currentNode, apiKey]);

  const makeChoice = async (direction: 'left' | 'right') => {
    const choice = currentNode.choices[direction];
    
    // Case 1: Dynamic Generation (AIGC)
    if (apiKey) {
        setIsGenerating(true);
        try {
            // 1. Create a temporary placeholder node (Visual Transition)
            const placeholderId = `generating-${Date.now()}`;
            const placeholderNode: EventNode = {
                node_id: placeholderId,
                parent_id: currentNode.node_id,
                timeline_id: currentNode.timeline_id,
                year: currentNode.year + 1, // Estimate
                age: currentNode.age + 1,
                description: "Computing Worldline Divergence...", 
                is_historical_fact: false,
                choices: {
                    left: { text: "...", consequence_type: 'divergence', next_node_id: null },
                    right: { text: "...", consequence_type: 'divergence', next_node_id: null }
                },
                image_prompt: "Loading..."
            };

            // 2. Register placeholder and transition immediately
            setNodes(prev => ({ ...prev, [placeholderId]: placeholderNode }));
            updateGameState(placeholderNode);

            // 3. Get Real Node (from cache or generate)
            const cacheKey = `${currentNode.node_id}-${direction}`;
            let nextNodePromise = prefetchCache.current[cacheKey];
            
            if (!nextNodePromise) {
                console.log("Cache miss, generating now...");
                nextNodePromise = generateNextNode(apiKey, currentNode, direction);
                prefetchCache.current[cacheKey] = nextNodePromise;
            } else {
                console.log("Cache hit!");
            }

            const nextNode = await nextNodePromise;
            
            // 4. Replace placeholder with actual node
            setNodes(prev => {
                const newNodes = { ...prev };
                delete newNodes[placeholderId]; // Remove placeholder
                newNodes[nextNode.node_id] = nextNode; // Add real node
                return newNodes;
            });

            // 5. Update game state to point to real node ID
            setGameState(prev => ({
                ...prev,
                currentNodeId: nextNode.node_id,
                history: [...prev.history.slice(0, -1), nextNode.node_id] // Replace last history entry
            }));

        } catch (error) {
            console.error(error);
            alert("Failed to generate story. Please check API Key.");
            // Revert state if needed, or show error node
        } finally {
            setIsGenerating(false);
        }
        return;
    }

    // Case 2: Static Mock Data
    if (!choice.next_node_id) {
      return;
    }

    const nextNode = nodes[choice.next_node_id];
    if (nextNode) {
        updateGameState(nextNode);
    }
  };

  const updateGameState = (nextNode: EventNode) => {
    setGameState(prev => {
        const newStats = { ...prev.stats };
        if (nextNode.status_effect) {
          newStats.wealth += nextNode.status_effect.wealth || 0;
          newStats.popularity += nextNode.status_effect.popularity || 0;
          newStats.health += nextNode.status_effect.health || 0;
          newStats.sanity += nextNode.status_effect.sanity || 0;
        }
  
        return {
          currentNodeId: nextNode.node_id,
          history: [...prev.history, nextNode.node_id],
          stats: newStats,
        };
      });
  }

  const resetGame = (startNodeId: string = 'root') => {
    setGameState({
      currentNodeId: startNodeId,
      history: [startNodeId],
      stats: INITIAL_STATS,
    });
    // Optional: Reset nodes to MOCK_NODES if we want to clear generated history
    // setNodes(MOCK_NODES); 
  };

  const jumpToNode = (nodeId: string) => {
    if (!nodes[nodeId]) {
        console.error(`Node ${nodeId} not found`);
        return;
    }

    // Reconstruct history up to this node
    // This is a simplified approach: we assume linear history in gameState.history is enough to truncate
    // But if we jump to a node NOT in current history (e.g. side branch), we might need pathfinding.
    // For MVP, we only allow jumping to nodes already in history OR we just set it as current.
    
    // Let's try to find if it's in current history
    const historyIndex = gameState.history.indexOf(nodeId);
    let newHistory = gameState.history;
    
    if (historyIndex !== -1) {
        // Truncate history
        newHistory = gameState.history.slice(0, historyIndex + 1);
    } else {
        // Jumping to a node not in direct history (maybe from map visualization of all nodes)
        // We just append it or reset history to it? 
        // Better: Try to trace back parents until we find a common ancestor or root
        // For MVP: Just set it as current and keep history (or reset history to [root...node])
        // Let's simply set it as current and trust the user knows they are time traveling.
        // To be safe, let's keep current history but append this jump if it's not there,
        // OR better: Rebuild history from root -> node (if parent links exist)
        
        const path: string[] = [nodeId];
        let curr = nodes[nodeId];
        while(curr.parent_id && nodes[curr.parent_id]) {
            curr = nodes[curr.parent_id];
            path.unshift(curr.node_id);
        }
        newHistory = path;
    }

    // Recalculate stats? 
    // For MVP, we might reset stats to initial or just keep them.
    // Ideally we should replay events to calculate stats.
    // Let's reset to INITIAL for now as a simplification, or just keep current.
    // Replaying is safer for consistency.
    
    const newStats = { ...INITIAL_STATS };
    newHistory.forEach(id => {
        const n = nodes[id];
        if (n && n.status_effect) {
            newStats.wealth += n.status_effect.wealth || 0;
            newStats.popularity += n.status_effect.popularity || 0;
            newStats.health += n.status_effect.health || 0;
            newStats.sanity += n.status_effect.sanity || 0;
        }
    });

    setGameState({
        currentNodeId: nodeId,
        history: newHistory,
        stats: newStats
    });
  };

  return (
    <GameContext.Provider value={{ 
        gameState, 
        currentNode,
        nodes,
        makeChoice, 
        resetGame,
        jumpToNode,
        apiKey,
        setApiKey,
        isGenerating
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

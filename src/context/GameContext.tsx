import { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, EventNode } from '../types';
import { INITIAL_STATS, MOCK_NODES } from '../data/mockData';

interface GameContextType {
  gameState: GameState;
  currentNode: EventNode;
  makeChoice: (direction: 'left' | 'right') => void;
  resetGame: (startNodeId?: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentNodeId: 'root',
    history: ['root'],
    stats: INITIAL_STATS,
  });

  const currentNode = MOCK_NODES[gameState.currentNodeId];

  const makeChoice = (direction: 'left' | 'right') => {
    const choice = currentNode.choices[direction];
    
    if (!choice.next_node_id) {
      // Game Over or End of Demo
      return;
    }

    const nextNode = MOCK_NODES[choice.next_node_id];
    
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
  };

  const resetGame = (startNodeId: string = 'root') => {
    setGameState({
      currentNodeId: startNodeId,
      history: [startNodeId],
      stats: INITIAL_STATS,
    });
  };

  return (
    <GameContext.Provider value={{ gameState, currentNode, makeChoice, resetGame }}>
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

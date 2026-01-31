import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { StatusHud } from '../components/StatusHud';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map, RefreshCw } from 'lucide-react';

export const GamePage = () => {
  const { gameState, currentNode, makeChoice, resetGame } = useGame();
  const navigate = useNavigate();
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  const [swipeFeedback, setSwipeFeedback] = useState<'none' | 'left' | 'right'>('none');

  // Reset card position when node changes
  useEffect(() => {
    x.set(0);
    setSwipeFeedback('none');
  }, [currentNode, x]);

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      // Swipe Right
      await controls.start({ x: 500, opacity: 0 });
      makeChoice('right');
      controls.set({ x: 0, opacity: 1 });
    } else if (info.offset.x < -threshold) {
      // Swipe Left
      await controls.start({ x: -500, opacity: 0 });
      makeChoice('left');
      controls.set({ x: 0, opacity: 1 });
    } else {
      controls.start({ x: 0 });
    }
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > 50) setSwipeFeedback('right');
      else if (info.offset.x < -50) setSwipeFeedback('left');
      else setSwipeFeedback('none');
  }

  // Check for End Game
  if (!currentNode) {
      return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
              <h1 className="text-2xl mb-4">Simulation Ended</h1>
              <button onClick={() => resetGame()} className="bg-blue-600 px-6 py-2 rounded-full flex items-center gap-2">
                  <RefreshCw size={16} /> Restart
              </button>
          </div>
      )
  }

  const isEnding = currentNode.choices.left.next_node_id === null;

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col overflow-hidden relative">
      {/* Top Bar */}
      <div className="h-16 flex justify-between items-center px-6 bg-black/40 backdrop-blur z-20">
        <div className="font-mono text-xl text-blue-400 font-bold">{currentNode.year}</div>
        <button onClick={() => navigate('/map')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
            <Map size={20} className="text-white" />
        </button>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex items-center justify-center relative p-4">
        {/* Choice Indicators (Background) */}
        <div className="absolute inset-0 flex pointer-events-none">
            <div className={`w-1/2 h-full flex items-center justify-center transition-opacity duration-300 ${swipeFeedback === 'left' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-4xl font-bold text-red-500 border-4 border-red-500 p-4 rounded -rotate-12 bg-black/50 backdrop-blur">
                    {currentNode.choices.left.text}
                </div>
            </div>
            <div className={`w-1/2 h-full flex items-center justify-center transition-opacity duration-300 ${swipeFeedback === 'right' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-4xl font-bold text-green-500 border-4 border-green-500 p-4 rounded rotate-12 bg-black/50 backdrop-blur">
                    {currentNode.choices.right.text}
                </div>
            </div>
        </div>

        {/* The Card */}
        <motion.div
            drag={isEnding ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate }}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            animate={controls}
            className="w-full max-w-sm aspect-[3/4] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative flex flex-col cursor-grab active:cursor-grabbing"
        >
            {/* Image Placeholder */}
            <div className="h-2/3 bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <span className="text-slate-600 text-center px-8 z-0">
                    [Image: {currentNode.image_prompt || currentNode.description}]
                </span>
                
                {/* Historical Tag */}
                {currentNode.is_historical_fact && (
                    <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-3 py-1 rounded-full text-xs font-bold tracking-wider z-20">
                        HISTORICAL
                    </div>
                )}
            </div>

            {/* Text Content */}
            <div className="h-1/3 p-6 flex flex-col justify-between relative z-20">
                <p className="text-lg text-slate-200 leading-relaxed font-serif">
                    {currentNode.description}
                </p>
                
                {isEnding && (
                    <div className="flex gap-2">
                        <button onClick={() => resetGame()} className="w-full bg-blue-600 py-3 rounded-lg text-white font-bold">
                            从头开始
                        </button>
                    </div>
                )}

                {!isEnding && (
                     <div className="text-xs text-slate-500 text-center">
                        Swipe Left or Right to Choose
                    </div>
                )}
            </div>
        </motion.div>
      </div>

      {/* Bottom HUD */}
      <StatusHud stats={gameState.stats} />
    </div>
  );
};

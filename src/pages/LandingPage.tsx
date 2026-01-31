import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Key, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { setApiKey } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().toLowerCase().includes('trump') || searchTerm.trim() === '') {
      setShowApiKeyModal(true);
    } else {
        alert('MVP version only supports "Donald Trump"');
    }
  };

  const handleStartGame = (withKey: boolean) => {
      if (withKey && tempKey) {
          setApiKey(tempKey);
      }
      navigate('/loading');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80" />
      
      <div className="z-10 w-full max-w-md space-y-8 text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            Reading Steiner
            </h1>
            <p className="mt-2 text-slate-400 text-sm tracking-widest uppercase">
            Fate Detection System v0.1
            </p>
        </motion.div>

        <motion.form 
            onSubmit={handleSearch}
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Subject (e.g., Donald Trump)"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-3 px-12 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
          >
            OBSERVE
          </button>
        </motion.form>

        <div className="flex justify-center gap-4 text-xs text-slate-600">
            <span>Powered by Chronos Engine</span>
            <span>•</span>
            <span>Worldline Alpha</span>
        </div>
      </div>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Key className="w-4 h-4 text-blue-400" />
                            Configuration
                        </h3>
                        <button onClick={() => setShowApiKeyModal(false)} className="text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-4">
                        Enable AIGC features to dynamically generate new worldlines. 
                        Leave empty to use pre-defined scenarios.
                    </p>

                    <input 
                        type="password" 
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 focus:outline-none mb-4 font-mono"
                    />

                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleStartGame(false)}
                            className="flex-1 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Skip
                        </button>
                        <button 
                            onClick={() => handleStartGame(true)}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

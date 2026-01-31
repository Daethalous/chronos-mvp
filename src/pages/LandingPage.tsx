import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().toLowerCase().includes('trump') || searchTerm.trim() === '') {
      navigate('/loading');
    } else {
        alert('目前MVP版本仅支持“Donald Trump”');
    }
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
            命运探知系统 v0.1
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
    </div>
  );
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/game');
    }, 3000); // 3 seconds fake loading

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
      <div className="space-y-4 w-64">
        <motion.div 
            className="h-1 bg-slate-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
            />
        </motion.div>
        
        <div className="text-xs text-blue-400 space-y-1">
            <TypingText text="> Accessing Akasha Records..." delay={0} />
            <TypingText text="> Analyzing causal convergence points..." delay={1} />
            <TypingText text="> Worldline divergence: 0.000000%" delay={2} />
        </div>
      </div>
    </div>
  );
};

const TypingText = ({ text, delay }: { text: string; delay: number }) => {
    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay }}
        >
            {text}
        </motion.p>
    )
}

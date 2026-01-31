import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WorldLine3D } from '../components/WorldLine3D';

export const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white overflow-hidden">
      {/* 3D Visualization Layer */}
      <div className="absolute inset-0 z-0">
        <WorldLine3D />
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回观测</span>
        </button>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center pointer-events-none">
        <p className="text-slate-500 text-sm">
          按住左键旋转 • 滚轮缩放 • 右键平移
        </p>
      </div>
    </div>
  );
};

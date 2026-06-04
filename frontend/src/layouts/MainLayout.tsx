import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Player } from '../components/Player';

export const MainLayout = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background relative">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-full h-full md:w-1/2 md:h-1/2 bg-primary/30 rounded-full blur-[120px] animate-spin-slow" />
        <div className="absolute -bottom-1/4 -right-1/4 w-full h-full md:w-1/2 md:h-1/2 bg-pink-600/20 rounded-full blur-[120px] animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden z-10 pb-20 md:pb-24">
        {/* On mobile, Sidebar might render at the bottom or we handle it inside Sidebar */}
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto no-scrollbar relative pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      
      <Player />
    </div>
  );
};

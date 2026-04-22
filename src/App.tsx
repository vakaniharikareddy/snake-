import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="static-noise"></div>
      <div className="crt-line"></div>
      
      <div className="screen-tear relative z-10 text-center mb-10 mt-8">
        <h1 className="font-pixel text-4xl md:text-5xl lg:text-7xl uppercase tracking-tighter mb-4 text-[#00FFFF] glitch-text" data-text="SYMBIOTE.OS_">
          SYMBIOTE.OS_
        </h1>
        <p className="font-mono text-2xl text-[#FF00FF] bg-black border border-[#00FFFF] px-4 py-1 inline-block uppercase shadow-[4px_4px_0_#FF00FF]">
          [SYSTEM_READY: // EXECUTING PROTOCOLS]
        </p>
      </div>

      <div className="z-10 flex flex-col xl:flex-row gap-16 items-center lg:items-start max-w-6xl w-full justify-center">
        {/* Game Container */}
        <div className="flex flex-col items-center xl:items-start w-full max-w-[420px]">
          <div className="flex justify-between items-end w-full mb-4 bg-[#00FFFF] text-black px-3 py-2 font-pixel text-[10px] md:text-xs shadow-[4px_4px_0_#FF00FF] border-2 border-black relative">
            <span>ROOT@SNAKE:~</span>
            <span className="flex gap-4">
              <span>PTS:</span>
              <span>{score.toString().padStart(4, '0')}</span>
            </span>
            <div className="absolute top-0 right-0 w-2 h-full bg-[#FF00FF] mix-blend-multiply opacity-50 animate-pulse" />
          </div>
          
          <div className="w-full relative shadow-[8px_8px_0_#FF00FF] border-4 border-[#00FFFF]">
            <SnakeGame onScoreChange={setScore} />
          </div>
          
          <p className="mt-8 font-mono text-[#00FFFF] text-lg uppercase tracking-widest text-center bg-black border-2 border-[#FF00FF] px-6 py-2 shadow-[4px_4px_0_#00FFFF] w-full">
            INPUT : WASD / ARROWS
          </p>
        </div>

        {/* Player Container */}
        <div className="flex flex-col items-center xl:items-start w-full max-w-[420px] mt-8 xl:mt-0">
           <MusicPlayer />
        </div>
      </div>
    </div>
  );
}

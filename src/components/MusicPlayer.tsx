import { useState, useRef, useEffect, useMemo } from 'react';

const TRACKS = [
  { id: 1, title: 'SYNTH_CRUISER_AI.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'NEON_NIGHTS_AI.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'CYBER_DREAMS_AI.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const visualizerBars = useMemo(() => {
    return [...Array(24)].map((_, i) => ({
      id: i,
      delay: Math.random() * -1,
      duration: Math.random() * 0.2 + 0.1 // Erratic
    }));
  }, []);

  useEffect(() => {
    setAudioError(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        setAudioError(true);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipForward = () => setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  const skipBackward = () => setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  const handleEnded = () => skipForward();
  const handleError = () => {
    setAudioError(true);
    setIsPlaying(false);
  };

  return (
    <div className="bg-black border-4 border-[#00FFFF] p-4 text-[#00FFFF] font-mono shadow-[-8px_8px_0_#FF00FF] w-full relative">
      <div className="uppercase font-pixel text-[#FF00FF] text-[10px] sm:text-xs md:text-sm mb-4 border-b-2 border-dashed border-[#00FFFF] pb-2 text-center glitch-text" data-text="<AUDIO_STREAM>">
        &lt;AUDIO_STREAM&gt;
      </div>
      
      <audio 
        autoPlay={isPlaying}
        ref={audioRef} 
        src={TRACKS[currentTrack].url} 
        onEnded={handleEnded}
        onError={handleError}
        crossOrigin="anonymous"
      />
      
      <div className="mb-4 bg-[#111] p-3 border border-[#00FFFF] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-full bg-[#00FFFF] mix-blend-multiply opacity-20" />
        <h3 className="font-pixel text-[10px] text-gray-500 uppercase mb-2">
          FILE: {audioError && <span className="text-[#FF00FF] animate-pulse bg-black px-1">CORRUPTED</span>}
        </h3>
        <p className="font-mono text-xl md:text-2xl text-white uppercase whitespace-nowrap overflow-hidden text-ellipsis m-0 leading-none">
          &gt; {TRACKS[currentTrack].title}
        </p>
      </div>

      <div className="flex items-end justify-between space-x-[2px] h-20 mb-6 w-full bg-[#111] border border-[#333] p-1 relative overflow-hidden">
        <div className="absolute top-1/2 w-full h-[1px] bg-[#FF00FF]/30 z-0 pointer-events-none" />
        {visualizerBars.map((bar, i) => (
          <div 
            key={bar.id} 
            className={`relative z-10 w-full max-w-[8px] ${i % 2 === 0 ? 'bg-[#FF00FF]' : 'bg-[#00FFFF]'} ${isPlaying ? 'animate-glitch-bar' : ''}`} 
            style={{ 
              height: '100%',
              animationDuration: `${bar.duration}s`,
              animationDelay: `${bar.delay}s`,
              transform: isPlaying ? 'scaleY(0.8)' : 'scaleY(0.1)',
              transformOrigin: 'bottom'
            }} 
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t-2 border-[#00FFFF]">
        <button 
          onClick={skipBackward} 
          className="font-pixel text-[8px] sm:text-[10px] md:text-xs text-[#00FFFF] bg-black border-2 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black p-2 md:p-3 transition-colors uppercase whitespace-nowrap"
        >
          &lt;&lt; PRV
        </button>
        
        <button 
          onClick={togglePlay} 
          className={`font-pixel text-[8px] sm:text-[10px] md:text-xs p-2 md:p-3 border-2 uppercase transition-colors whitespace-nowrap ${isPlaying ? 'bg-[#FF00FF] text-black border-[#FF00FF] hover:bg-black hover:text-[#FF00FF]' : 'bg-[#00FFFF] text-black border-[#00FFFF] hover:bg-black hover:text-[#00FFFF]'}`}
        >
          {isPlaying ? '|| PAUSE' : '>> PLAY'}
        </button>
        
        <button 
          onClick={skipForward} 
          className="font-pixel text-[8px] sm:text-[10px] md:text-xs text-[#FF00FF] bg-black border-2 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black p-2 md:p-3 transition-colors uppercase whitespace-nowrap"
        >
          NXT &gt;&gt;
        </button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const CANVAS_SIZE = 400; // 20x20 grid
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  
  const snakeRef = useRef<Point[]>(INITIAL_SNAKE);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Point>(INITIAL_DIRECTION);
  const foodRef = useRef<Point>({ x: 15, y: 5 });
  const scoreRef = useRef(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let interval: number;

    const gameLoop = () => {
      if (gameOver) return;

      directionRef.current = nextDirectionRef.current;
      const snake = [...snakeRef.current];
      const head = { ...snake[0] };
      const dir = directionRef.current;
      
      head.x += dir.x;
      head.y += dir.y;

      const maxCol = Math.floor(canvas.width / GRID_SIZE);
      const maxRow = Math.floor(canvas.height / GRID_SIZE);

      if (head.x < 0 || head.x >= maxCol || head.y < 0 || head.y >= maxRow) {
        setGameOver(true);
        return;
      }

      for (const segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          setGameOver(true);
          return;
        }
      }

      snake.unshift(head);
      
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 10;
        onScoreChange(scoreRef.current);
        
        let newX = 0;
        let newY = 0;
        let valid = false;
        while (!valid) {
          newX = Math.floor(Math.random() * maxCol);
          newY = Math.floor(Math.random() * maxRow);
          // Check if food is on snake
          valid = !snake.some(segment => segment.x === newX && segment.y === newY);
        }
        foodRef.current = { x: newX, y: newY };
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      draw(ctx, canvas);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw brutalist grid
      ctx.fillStyle = '#111';
      for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.fillRect(x, 0, 1, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // Draw food (Magenta)
      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(
        foodRef.current.x * GRID_SIZE, 
        foodRef.current.y * GRID_SIZE, 
        GRID_SIZE, 
        GRID_SIZE
      );

      // Draw snake (Cyan / White)
      snakeRef.current.forEach((segment, index) => {
        if (index === 0) {
          ctx.fillStyle = '#FFFFFF';
        } else {
          ctx.fillStyle = index % 2 === 0 ? '#00FFFF' : '#00b3b3';
        }
        
        ctx.fillRect(
          segment.x * GRID_SIZE, 
          segment.y * GRID_SIZE, 
          GRID_SIZE, 
          GRID_SIZE
        );
      });
    };

    interval = window.setInterval(gameLoop, 80); // Faster for a glitchy erratic feel
    return () => clearInterval(interval);
  }, [gameOver, onScoreChange]);

  const restart = () => {
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    scoreRef.current = 0;
    foodRef.current = { x: 15, y: 5 };
    onScoreChange(0);
    setGameOver(false);
  };

  return (
    <div className="relative w-full aspect-square bg-black overflow-hidden cursor-crosshair group focus:outline-none" tabIndex={0}>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_SIZE} 
        height={CANVAS_SIZE} 
        className="block w-full h-full object-contain"
        style={{ filter: gameOver ? 'invert(1) hue-rotate(180deg) grayscale(80%)' : 'none' }}
      />
      
      {gameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50">
          <div className="bg-black border-4 border-[#FF00FF] p-6 shadow-[8px_8px_0_#00FFFF] flex flex-col items-center text-center">
            <h2 
              className="font-pixel text-2xl md:text-3xl mb-6 text-[#FF00FF] glitch-text" 
              data-text="FATAL_ERR"
            >
              FATAL_ERR
            </h2>
            <button 
              onClick={restart}
              className="px-6 py-3 bg-black border-2 border-[#00FFFF] text-[#00FFFF] font-mono text-xl md:text-2xl uppercase hover:bg-[#00FFFF] hover:text-black transition-none focus:outline-none w-full shadow-[4px_4px_0_#FF00FF] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-4px_4px_0_#FF00FF] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              [ REBOOT ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

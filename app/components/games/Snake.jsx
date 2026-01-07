"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const Snake = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Game constants
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const CELL_SIZE = 20;
  const GRID_WIDTH = CANVAS_WIDTH / CELL_SIZE;
  const GRID_HEIGHT = CANVAS_HEIGHT / CELL_SIZE;

  // Game state
  const gameRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 0, y: 0 },
    food: { x: 15, y: 15 },
    gameRunning: false
  });

  // Generate random food position
  const generateFood = useCallback(() => {
    const game = gameRef.current;
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
    } while (game.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    gameRef.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 0, y: 0 },
      food: generateFood(),
      gameRunning: true
    };
    setScore(0);
    setGameState('playing');
  }, [generateFood]);

  // Draw game on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    // Clear canvas
    ctx.fillStyle = '#0a0d37';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid (subtle)
    ctx.strokeStyle = '#1a1443';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw snake
    game.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#16f2b3' : '#14d19f'; // Head slightly different color
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      
      // Add shine effect to head
      if (index === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(
          segment.x * CELL_SIZE + 2,
          segment.y * CELL_SIZE + 2,
          CELL_SIZE / 2,
          CELL_SIZE / 2
        );
      }
    });

    // Draw food with pulsing effect
    const time = Date.now() * 0.005;
    const pulse = 0.8 + 0.2 * Math.sin(time);
    const foodSize = CELL_SIZE * pulse;
    const offset = (CELL_SIZE - foodSize) / 2;
    
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(
      game.food.x * CELL_SIZE + offset,
      game.food.y * CELL_SIZE + offset,
      foodSize,
      foodSize
    );
    
    // Food highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(
      game.food.x * CELL_SIZE + offset + 2,
      game.food.y * CELL_SIZE + offset + 2,
      foodSize / 3,
      foodSize / 3
    );
  }, []);

  // Game loop
  const updateGame = useCallback(() => {
    const game = gameRef.current;
    if (!game.gameRunning) return;

    // Don't move if no direction set
    if (game.direction.x === 0 && game.direction.y === 0) return;

    const head = { ...game.snake[0] };
    head.x += game.direction.x;
    head.y += game.direction.y;

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      game.gameRunning = false;
      setGameState('gameOver');
      const currentScore = score;
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('snakeHighScore', currentScore.toString());
      }
      return;
    }

    // Check self collision
    if (game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      game.gameRunning = false;
      setGameState('gameOver');
      const currentScore = score;
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('snakeHighScore', currentScore.toString());
      }
      return;
    }

    game.snake.unshift(head);

    // Check food collision
    if (head.x === game.food.x && head.y === game.food.y) {
      setScore(prev => prev + 10);
      game.food = generateFood();
    } else {
      game.snake.pop();
    }

    draw();
  }, [score, highScore, generateFood, draw]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (gameState !== 'playing') return;
    
    const game = gameRef.current;
    const { direction } = game;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction.y === 0) game.direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction.y === 0) game.direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction.x === 0) game.direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction.x === 0) game.direction = { x: 1, y: 0 };
        break;
    }
    e.preventDefault();
  }, [gameState]);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || gameState !== 'playing') return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        const game = gameRef.current;
        if (game.direction.x === 0) {
          game.direction = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        }
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        const game = gameRef.current;
        if (game.direction.y === 0) {
          game.direction = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        }
      }
    }
    setTouchStart(null);
  };

  // Effects
  useEffect(() => {
    // Load high score
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(updateGame, 150); // Game speed
      return () => clearInterval(interval);
    }
  }, [gameState, updateGame]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1224] p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🐍 Snake Game</h1>
        <p className="text-gray-300">Built with C++ logic, recreated in JavaScript</p>
      </div>

      {/* Game Stats */}
      <div className="flex gap-8 mb-6">
        <div className="text-center">
          <div className="text-[#16f2b3] text-2xl font-bold">{score}</div>
          <div className="text-gray-400 text-sm">Score</div>
        </div>
        <div className="text-center">
          <div className="text-amber-300 text-2xl font-bold">{highScore}</div>
          <div className="text-gray-400 text-sm">High Score</div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-gray-700 rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        
        {/* Game overlays */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
            <h2 className="text-white text-2xl mb-4">Ready to Play?</h2>
            <button
              onClick={initGame}
              className="bg-[#16f2b3] hover:bg-[#14d19f] text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
            <h2 className="text-white text-2xl mb-2">Game Over!</h2>
            <p className="text-gray-300 mb-4">Score: {score}</p>
            <button
              onClick={initGame}
              className="bg-[#16f2b3] hover:bg-[#14d19f] text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm mb-2">Controls</p>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Desktop: Arrow Keys or WASD</span>
          <span>Mobile: Swipe to move</span>
        </div>
      </div>
    </div>
  );
};

export default Snake;
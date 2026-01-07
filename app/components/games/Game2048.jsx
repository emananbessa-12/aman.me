"use client";

import { useState, useEffect, useCallback } from 'react';

const Game2048 = () => {
  const [grid, setGrid] = useState(Array(4).fill().map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'won', 'lost'
  const [animatingTiles, setAnimatingTiles] = useState([]);

  // Beautiful tile colors with gradients
  const getTileStyle = (value) => {
    const styles = {
      0: { bg: 'rgba(238, 228, 218, 0.35)', color: '#776e65', fontSize: '0px' },
      2: { bg: 'linear-gradient(145deg, #eee4da, #ede0c8)', color: '#776e65', fontSize: '2rem' },
      4: { bg: 'linear-gradient(145deg, #ede0c8, #f2b179)', color: '#776e65', fontSize: '2rem' },
      8: { bg: 'linear-gradient(145deg, #f2b179, #f59563)', color: '#f9f6f2', fontSize: '2rem' },
      16: { bg: 'linear-gradient(145deg, #f59563, #f67c5f)', color: '#f9f6f2', fontSize: '1.8rem' },
      32: { bg: 'linear-gradient(145deg, #f67c5f, #f65e3b)', color: '#f9f6f2', fontSize: '1.8rem' },
      64: { bg: 'linear-gradient(145deg, #f65e3b, #edcf72)', color: '#f9f6f2', fontSize: '1.8rem' },
      128: { bg: 'linear-gradient(145deg, #edcf72, #edcc61)', color: '#f9f6f2', fontSize: '1.6rem' },
      256: { bg: 'linear-gradient(145deg, #edcc61, #edc850)', color: '#f9f6f2', fontSize: '1.6rem' },
      512: { bg: 'linear-gradient(145deg, #edc850, #edc53f)', color: '#f9f6f2', fontSize: '1.6rem' },
      1024: { bg: 'linear-gradient(145deg, #edc53f, #edc22e)', color: '#f9f6f2', fontSize: '1.4rem' },
      2048: { bg: 'linear-gradient(145deg, #3c3a32, #f7d794)', color: '#f9f6f2', fontSize: '1.4rem' },
    };
    return styles[value] || { bg: 'linear-gradient(145deg, #3c3a32, #f7d794)', color: '#f9f6f2', fontSize: '1.2rem' };
  };

  // Load best score
  useEffect(() => {
    const saved = localStorage.getItem('2048-best-score');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    const newGrid = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameState('playing');
    setAnimatingTiles([]);
  }, []);

  // Add random tile (2 or 4)
  const addRandomTile = (grid) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) emptyCells.push({ row: i, col: j });
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Slide and merge logic
  const slideArray = (arr) => {
    const filtered = arr.filter(val => val !== 0);
    const merged = [];
    let scoreGain = 0;
    
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        scoreGain += filtered[i] * 2;
        i++; // Skip next element
      } else {
        merged.push(filtered[i]);
      }
    }
    
    while (merged.length < 4) merged.push(0);
    return { array: merged, score: scoreGain };
  };

  // Move functions
  const move = useCallback((direction) => {
    if (gameState !== 'playing') return;
    
    let newGrid = grid.map(row => [...row]);
    let totalScore = 0;
    let moved = false;

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const result = slideArray(newGrid[i]);
        if (JSON.stringify(result.array) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = result.array;
        totalScore += result.score;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const reversed = [...newGrid[i]].reverse();
        const result = slideArray(reversed);
        const final = result.array.reverse();
        if (JSON.stringify(final) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = final;
        totalScore += result.score;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const column = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]];
        const result = slideArray(column);
        if (JSON.stringify(result.array) !== JSON.stringify(column)) moved = true;
        for (let i = 0; i < 4; i++) newGrid[i][j] = result.array[i];
        totalScore += result.score;
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const column = [newGrid[3][j], newGrid[2][j], newGrid[1][j], newGrid[0][j]];
        const result = slideArray(column);
        if (JSON.stringify(result.array) !== JSON.stringify([newGrid[3][j], newGrid[2][j], newGrid[1][j], newGrid[0][j]])) moved = true;
        for (let i = 0; i < 4; i++) newGrid[3-i][j] = result.array[i];
        totalScore += result.score;
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(prev => {
        const newScore = prev + totalScore;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('2048-best-score', newScore.toString());
        }
        return newScore;
      });

      // Check for 2048 win
      if (newGrid.flat().includes(2048) && gameState !== 'won') {
        setGameState('won');
      }

      // Check for game over
      if (!canMove(newGrid)) {
        setGameState('lost');
      }
    }
  }, [grid, gameState, bestScore]);

  // Check if moves are possible
  const canMove = (grid) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return true;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = grid[i][j];
        if ((i < 3 && current === grid[i + 1][j]) || (j < 3 && current === grid[i][j + 1])) {
          return true;
        }
      }
    }
    return false;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a': case 'A': move('left'); break;
        case 'ArrowRight':
        case 'd': case 'D': move('right'); break;
        case 'ArrowUp':
        case 'w': case 'W': move('up'); break;
        case 'ArrowDown':
        case 's': case 'S': move('down'); break;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, gameState]);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        move(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        move(deltaY > 0 ? 'down' : 'up');
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-amber-900 mb-2">2048</h1>
        <p className="text-amber-700">Join the tiles, get to 2048!</p>
      </div>

      {/* Score Display */}
      <div className="flex gap-4 mb-6">
        <div className="bg-amber-800 text-white rounded-lg px-4 py-2 text-center shadow-lg">
          <div className="text-xs uppercase tracking-wide">Score</div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
        <div className="bg-amber-900 text-white rounded-lg px-4 py-2 text-center shadow-lg">
          <div className="text-xs uppercase tracking-wide">Best</div>
          <div className="text-2xl font-bold">{bestScore}</div>
        </div>
      </div>

      {gameState === 'menu' ? (
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-amber-200 max-w-md">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Ready to Play?</h2>
            <p className="text-amber-700 mb-6 leading-relaxed">
              Swipe or use arrow keys to move tiles. When two tiles with the same number touch, they merge into one!
            </p>
            <button
              onClick={initGame}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Game Grid */}
          <div 
            className="grid grid-cols-4 gap-3 bg-amber-800 p-4 rounded-2xl shadow-2xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {grid.map((row, i) =>
              row.map((value, j) => {
                const style = getTileStyle(value);
                return (
                  <div
                    key={`${i}-${j}`}
                    className="w-20 h-20 rounded-lg flex items-center justify-center font-bold shadow-lg transform transition-all duration-200"
                    style={{
                      background: style.bg,
                      color: style.color,
                      fontSize: style.fontSize,
                      boxShadow: value !== 0 ? '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {value !== 0 && (
                      <span style={{ 
                        textShadow: value >= 8 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                        fontWeight: '900'
                      }}>
                        {value}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Game Over Overlays */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center rounded-2xl">
              <h2 className="text-4xl font-bold text-amber-900 mb-2">🏆 You Win!</h2>
              <p className="text-amber-700 mb-4">You reached 2048!</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setGameState('playing')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Keep Playing
                </button>
                <button
                  onClick={initGame}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  New Game
                </button>
              </div>
            </div>
          )}

          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center rounded-2xl">
              <h2 className="text-4xl font-bold text-red-800 mb-2">Game Over</h2>
              <p className="text-red-600 mb-4">No more moves possible!</p>
              <button
                onClick={initGame}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Controls Instructions */}
      <div className="mt-6 text-center text-amber-700">
        <p className="text-sm">Desktop: Arrow Keys or WASD • Mobile: Swipe to move</p>
      </div>
    </div>
  );
};

export default Game2048;
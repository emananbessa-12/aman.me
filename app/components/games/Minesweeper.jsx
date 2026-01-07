"use client";

import { useState, useEffect, useCallback } from 'react';

const Minesweeper = () => {
  const ROWS = 16;
  const COLS = 16;
  const MINES = 40;

  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'won', 'lost'
  const [showInstructions, setShowInstructions] = useState(false);
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [mineCount, setMineCount] = useState(MINES);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Number colors with cyber theme
  const numberColors = {
    1: '#00f5ff', // Cyan - safe
    2: '#40e0d0', // Turquoise - low danger  
    3: '#ffeb3b', // Yellow - medium danger
    4: '#ff9800', // Orange - high danger
    5: '#f44336', // Red - very high danger
    6: '#e91e63', // Pink - extreme danger
    7: '#9c27b0', // Purple - maximum danger
    8: '#000000'  // Black - apocalyptic
  };

  const initGame = useCallback(() => {
    const newBoard = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    const newRevealed = Array(ROWS).fill().map(() => Array(COLS).fill(false));
    const newFlagged = Array(ROWS).fill().map(() => Array(COLS).fill(false));
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      
      if (newBoard[row][col] !== -1) {
        newBoard[row][col] = -1;
        minesPlaced++;
      }
    }
    
    // Calculate numbers
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (newBoard[i][j] !== -1) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < ROWS && nj >= 0 && nj < COLS && newBoard[ni][nj] === -1) {
                count++;
              }
            }
          }
          newBoard[i][j] = count;
        }
      }
    }
    
    setBoard(newBoard);
    setRevealed(newRevealed);
    setFlagged(newFlagged);
    setMineCount(MINES);
    setTimer(0);
    setGameStarted(false);
    setGameState('playing');
    setShowInstructions(true); // Show instructions when starting
  }, []);

  const floodFill = useCallback((board, revealed, row, col) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS || revealed[row][col]) {
      return;
    }
    
    if (board[row][col] === -1) return;
    
    revealed[row][col] = true;
    
    if (board[row][col] === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          floodFill(board, revealed, row + di, col + dj);
        }
      }
    }
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (gameState !== 'playing' || showInstructions) return;
    if (revealed[row][col] || flagged[row][col]) return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    const newRevealed = revealed.map(row => [...row]);
    
    if (board[row][col] === -1) {
      newRevealed[row][col] = true;
      setRevealed(newRevealed);
      setGameState('lost');
      return;
    }
    
    floodFill(board, newRevealed, row, col);
    setRevealed(newRevealed);
    
    let revealedCount = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (newRevealed[i][j]) revealedCount++;
      }
    }
    
    if (revealedCount === ROWS * COLS - MINES) {
      setGameState('won');
    }
  }, [gameState, showInstructions, revealed, flagged, gameStarted, board, floodFill]);

  const handleRightClick = useCallback((e, row, col) => {
    e.preventDefault();
    if (gameState !== 'playing' || showInstructions) return;
    if (revealed[row][col]) return;
    
    const newFlagged = flagged.map(row => [...row]);
    newFlagged[row][col] = !newFlagged[row][col];
    setFlagged(newFlagged);
    
    const flagChange = newFlagged[row][col] ? -1 : 1;
    setMineCount(prev => prev + flagChange);
  }, [gameState, showInstructions, revealed, flagged]);

  // Timer effect
  useEffect(() => {
    if (gameStarted && gameState === 'playing' && !showInstructions) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameState, showInstructions]);

  // Render cell with cyber font
  const renderCell = (row, col) => {
    const isRevealed = revealed[row][col];
    const isFlagged = flagged[row][col];
    const cellValue = board[row][col];
    const isMine = cellValue === -1;
    
    if (isFlagged) {
      return <span className="text-red-400 font-bold text-lg">🚩</span>;
    }
    
    if (!isRevealed) {
      return null;
    }
    
    if (isMine) {
      return <span className="text-red-500 text-xl">💣</span>;
    }
    
    if (cellValue > 0) {
      return (
        <span 
          className="font-mono font-black text-sm tracking-wider"
          style={{ 
            color: numberColors[cellValue],
            fontFamily: '"Courier New", "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
            textShadow: `0 0 8px ${numberColors[cellValue]}40`,
            fontWeight: '900'
          }}
        >
          {cellValue}
        </span>
      );
    }
    
    return null;
  };

  const getCellStyle = (row, col) => {
    const isRevealed = revealed[row][col];
    const isMine = board[row][col] === -1;
    
    let baseStyle = "w-6 h-6 border border-cyan-800 flex items-center justify-center text-xs cursor-pointer transition-all duration-150 hover:brightness-110 ";
    
    if (isRevealed) {
      if (isMine) {
        baseStyle += "bg-red-600 border-red-700 ";
      } else {
        baseStyle += "bg-gray-800 border-gray-700 ";
      }
    } else {
      baseStyle += "bg-cyan-900 border-cyan-700 hover:bg-cyan-800 active:bg-cyan-700 ";
    }
    
    return baseStyle;
  };

  // Instructions Modal Component
  const InstructionsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-cyan-400 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">🎯 How to Play</h3>
          <div className="w-16 h-0.5 bg-cyan-400 mx-auto"></div>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <div className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold">🖱️</span>
            <div>
              <strong className="text-white">Left Click:</strong> Reveal a cell
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold">🚩</span>
            <div>
              <strong className="text-white">Right Click:</strong> Flag suspected mines
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 font-bold">🔢</span>
            <div>
              <strong className="text-white">Numbers:</strong> Show nearby mine count
              <div className="text-sm text-gray-400 mt-1">Colors indicate danger level</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-green-400 font-bold">🏆</span>
            <div>
              <strong className="text-white">Goal:</strong> Reveal all safe cells without hitting mines
            </div>
          </div>

          <div className="bg-black rounded p-3 mt-4">
            <div className="text-cyan-400 text-sm font-bold mb-2">Danger Levels:</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[1,2,3,4].map(num => (
                <span key={num} style={{ color: numberColors[num] }} className="font-mono font-black">
                  {num} {num === 1 ? 'Safe' : num === 2 ? 'Low' : num === 3 ? 'Med' : 'High'}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs mt-1">
              {[5,6,7,8].map(num => (
                <span key={num} style={{ color: numberColors[num] }} className="font-mono font-black">
                  {num} {num === 5 ? 'Very' : num === 6 ? 'Ext' : num === 7 ? 'Max' : 'Doom'}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowInstructions(false)}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Got It! Let's Play 🚀
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      {showInstructions && <InstructionsModal />}
      
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">💣 Minesweeper</h1>
        <p className="text-gray-300">C++ algorithms with cyber aesthetics</p>
      </div>

      {/* Game Stats */}
      <div className="flex gap-8 mb-6">
        <div className="text-center">
          <div className="text-cyan-400 text-2xl font-bold font-mono">{mineCount}</div>
          <div className="text-gray-400 text-sm">Mines</div>
        </div>
        <div className="text-center">
          <div className="text-cyan-400 text-2xl font-bold font-mono">{timer}</div>
          <div className="text-gray-400 text-sm">Time</div>
        </div>
      </div>

      {gameState === 'menu' ? (
        <div className="text-center">
          <div className="bg-gray-900 border border-cyan-800 rounded-lg p-8 mb-6">
            <h2 className="text-cyan-400 text-2xl mb-4">Ready to Play?</h2>
            <p className="text-gray-300 mb-6">
              16×16 grid with 40 mines<br/>
              Instructions will appear after you start
            </p>
            <button
              onClick={initGame}
              className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Game Board */}
          <div 
            className="grid gap-0 border-2 border-cyan-600 bg-black p-2 rounded-lg"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {board.map((row, i) =>
              row.map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className={getCellStyle(i, j)}
                  onClick={() => handleCellClick(i, j)}
                  onContextMenu={(e) => handleRightClick(e, i, j)}
                >
                  {renderCell(i, j)}
                </div>
              ))
            )}
          </div>

          {/* Game Over Overlays */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-cyan-400 text-3xl mb-2">🏆 Victory!</h2>
              <p className="text-gray-300 mb-4 font-mono">Time: {timer} seconds</p>
              <button
                onClick={initGame}
                className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Play Again
              </button>
            </div>
          )}

          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-red-400 text-3xl mb-2">💥 Boom!</h2>
              <p className="text-gray-300 mb-4">You hit a mine!</p>
              <button
                onClick={initGame}
                className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Help Button */}
      {gameState === 'playing' && (
        <button
          onClick={() => setShowInstructions(true)}
          className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm underline"
        >
          Show Instructions
        </button>
      )}
    </div>
  );
};

export default Minesweeper;
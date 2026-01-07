"use client";

import { useState, useCallback, useEffect } from 'react';

const Chess = () => {
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameMode, setGameMode] = useState('menu');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'check', 'checkmate', 'stalemate'
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [winner, setWinner] = useState(null);

  const pieceSymbols = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };

  const getPieceColor = (piece) => {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
  };

  const isCurrentPlayerPiece = useCallback((piece) => {
    if (!piece) return false;
    return currentPlayer === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase();
  }, [currentPlayer]);

  // Check if a move would put own king in check
  const wouldBeInCheck = useCallback((board, fromRow, fromCol, toRow, toCol, playerColor) => {
    // Simulate the move
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Find king position
    let kingRow = -1, kingCol = -1;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const p = newBoard[i][j];
        if (p && p.toLowerCase() === 'k' && getPieceColor(p) === playerColor) {
          kingRow = i;
          kingCol = j;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    
    if (kingRow === -1) return false; // King not found (shouldn't happen)
    
    // Check if any opponent piece can attack the king
    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const p = newBoard[i][j];
        if (p && getPieceColor(p) === opponentColor) {
          if (isValidMoveBasic(i, j, kingRow, kingCol, p, newBoard)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }, []);

  // Basic move validation without check considerations
  const isValidMoveBasic = useCallback((fromRow, fromCol, toRow, toCol, piece, gameBoard = board) => {
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    if (fromRow === toRow && fromCol === toCol) return false;
    
    const targetPiece = gameBoard[toRow][toCol];
    if (targetPiece && getPieceColor(targetPiece) === getPieceColor(piece)) return false;

    const pieceType = piece.toLowerCase();
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (pieceType) {
      case 'p':
        const direction = piece === piece.toUpperCase() ? -1 : 1;
        const startRow = piece === piece.toUpperCase() ? 6 : 1;
        
        if (toCol === fromCol && !targetPiece) {
          if (toRow === fromRow + direction) return true;
          if (fromRow === startRow && toRow === fromRow + 2 * direction) return true;
        } else if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && targetPiece) {
          return true;
        }
        return false;

      case 'r':
        if (fromRow === toRow || fromCol === toCol) {
          return isPathClear(gameBoard, fromRow, fromCol, toRow, toCol);
        }
        return false;

      case 'n':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case 'b':
        if (rowDiff === colDiff) {
          return isPathClear(gameBoard, fromRow, fromCol, toRow, toCol);
        }
        return false;

      case 'q':
        if (fromRow === toRow || fromCol === toCol || rowDiff === colDiff) {
          return isPathClear(gameBoard, fromRow, fromCol, toRow, toCol);
        }
        return false;

      case 'k':
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  }, [board]);

  // Full move validation including check rules
  const isValidMove = useCallback((fromRow, fromCol, toRow, toCol, piece, gameBoard = board) => {
    // Basic validation first
    if (!isValidMoveBasic(fromRow, fromCol, toRow, toCol, piece, gameBoard)) {
      return false;
    }
    
    // Check if move would leave own king in check
    const playerColor = getPieceColor(piece);
    if (wouldBeInCheck(gameBoard, fromRow, fromCol, toRow, toCol, playerColor)) {
      return false;
    }
    
    return true;
  }, [isValidMoveBasic, wouldBeInCheck]);

  const isPathClear = (gameBoard, fromRow, fromCol, toRow, toCol) => {
    const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
    let checkRow = fromRow + rowStep;
    let checkCol = fromCol + colStep;
    
    while (checkRow !== toRow || checkCol !== toCol) {
      if (gameBoard[checkRow][checkCol]) return false;
      checkRow += rowStep;
      checkCol += colStep;
    }
    return true;
  };

  const getPossibleMovesForPiece = useCallback((board, row, col) => {
    const piece = board[row][col];
    if (!piece) return [];

    const moves = [];
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(row, col, toRow, toCol, piece, board)) {
          moves.push([toRow, toCol]);
        }
      }
    }
    return moves;
  }, [isValidMove]);

  // Check for checkmate or stalemate
  const checkGameEnd = useCallback((board, playerColor) => {
    let hasLegalMoves = false;
    
    // Check if player has any legal moves
    for (let row = 0; row < 8 && !hasLegalMoves; row++) {
      for (let col = 0; col < 8 && !hasLegalMoves; col++) {
        const piece = board[row][col];
        if (piece && getPieceColor(piece) === playerColor) {
          const moves = getPossibleMovesForPiece(board, row, col);
          if (moves.length > 0) {
            hasLegalMoves = true;
          }
        }
      }
    }
    
    if (!hasLegalMoves) {
      // Check if in check
      const isInCheck = wouldBeInCheck(board, 0, 0, 0, 0, playerColor); // This is a hack, need to check properly
      
      // Better check detection
      let kingRow = -1, kingCol = -1;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const p = board[i][j];
          if (p && p.toLowerCase() === 'k' && getPieceColor(p) === playerColor) {
            kingRow = i;
            kingCol = j;
            break;
          }
        }
        if (kingRow !== -1) break;
      }
      
      let inCheck = false;
      if (kingRow !== -1) {
        const opponentColor = playerColor === 'white' ? 'black' : 'white';
        for (let i = 0; i < 8 && !inCheck; i++) {
          for (let j = 0; j < 8 && !inCheck; j++) {
            const p = board[i][j];
            if (p && getPieceColor(p) === opponentColor) {
              if (isValidMoveBasic(i, j, kingRow, kingCol, p, board)) {
                inCheck = true;
              }
            }
          }
        }
      }
      
      return inCheck ? 'checkmate' : 'stalemate';
    }
    
    return 'playing';
  }, [getPossibleMovesForPiece, wouldBeInCheck, isValidMoveBasic]);

  // AI logic (keeping existing implementation)
  const getAIMove = useCallback((board, difficulty) => {
    const allMoves = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece === piece.toLowerCase()) {
          const moves = getPossibleMovesForPiece(board, row, col);
          moves.forEach(move => {
            allMoves.push({
              from: [row, col],
              to: move,
              piece: piece,
              score: Math.random() // Simplified scoring
            });
          });
        }
      }
    }

    if (allMoves.length === 0) return null;
    return allMoves[Math.floor(Math.random() * allMoves.length)];
  }, [getPossibleMovesForPiece]);

  // AI move execution
  useEffect(() => {
    if (gameMode === 'vs-ai' && currentPlayer === 'black' && gameState === 'playing') {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board, aiDifficulty);
        if (aiMove) {
          makeMove(aiMove.from[0], aiMove.from[1], aiMove.to[0], aiMove.to[1]);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, board, aiDifficulty, gameState, getAIMove]);

  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];
    
    const newBoard = board.map(r => [...r]);
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    if (capturedPiece) {
      const capturedColor = getPieceColor(capturedPiece);
      setCapturedPieces(prev => ({
        ...prev,
        [capturedColor]: [...prev[capturedColor], capturedPiece]
      }));
    }
    
    setBoard(newBoard);
    setMoveHistory(prev => [...prev, { from: [fromRow, fromCol], to: [toRow, toCol], piece, captured: capturedPiece }]);
    
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
    setCurrentPlayer(nextPlayer);
    
    // Check for game end
    const endState = checkGameEnd(newBoard, nextPlayer);
    if (endState !== 'playing') {
      setGameState(endState);
      if (endState === 'checkmate') {
        setWinner(currentPlayer);
      }
    }
  };

  const handleSquareClick = useCallback((row, col) => {
    if (gameState !== 'playing') return;
    if (gameMode === 'vs-ai' && currentPlayer === 'black') return;
    
    const piece = board[row][col];
    
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      const selectedPiece = board[fromRow][fromCol];
      
      if (isValidMove(fromRow, fromCol, row, col, selectedPiece)) {
        makeMove(fromRow, fromCol, row, col);
      }
      
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else if (piece && isCurrentPlayerPiece(piece)) {
      setSelectedSquare([row, col]);
      setPossibleMoves(getPossibleMovesForPiece(board, row, col));
    }
  }, [board, selectedSquare, currentPlayer, isCurrentPlayerPiece, isValidMove, gameMode, gameState, getPossibleMovesForPiece]);

  const resetGame = (mode = 'menu') => {
    setBoard(initialBoard);
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameState('playing');
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    setWinner(null);
    setGameMode(mode);
  };

  // Menu Screen (keeping existing)
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-amber-900 mb-4">♔ Chess ♛</h1>
          <p className="text-amber-700 text-lg mb-8">Choose your game mode</p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={() => resetGame('vs-human')}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              👥 Play vs Human
            </button>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-amber-900 font-bold mb-4">🤖 Play vs AI</h3>
              <div className="space-y-2 mb-4">
                {[
                  { key: 'easy', label: '😊 Easy', desc: 'Learning mode' },
                  { key: 'medium', label: '🧠 Medium', desc: 'Balanced play' },
                  { key: 'hard', label: '🔥 Hard', desc: 'Challenge mode' }
                ].map(diff => (
                  <button
                    key={diff.key}
                    onClick={() => setAiDifficulty(diff.key)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      aiDifficulty === diff.key 
                        ? 'bg-amber-200 border-2 border-amber-600' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-amber-900">{diff.label}</div>
                    <div className="text-sm text-gray-600">{diff.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => resetGame('vs-ai')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                Start AI Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">♔ Chess ♛</h1>
          <div className="flex items-center justify-center gap-4 text-amber-700">
            <span>Mode: {gameMode === 'vs-ai' ? `AI (${aiDifficulty})` : 'Human vs Human'}</span>
            <span>•</span>
            <span className="font-bold">Current: {currentPlayer === 'white' ? '♔ White' : '♚ Black'}</span>
            {gameState === 'checkmate' && winner && (
              <>
                <span>•</span>
                <span className="font-bold text-red-600">
                  {winner === 'white' ? '♔ White Wins!' : '♚ Black Wins!'}
                </span>
              </>
            )}
            {gameState === 'stalemate' && (
              <>
                <span>•</span>
                <span className="font-bold text-yellow-600">Stalemate - Draw!</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Captured Pieces - Black */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-amber-900 mb-3">Captured ♚</h3>
            <div className="bg-white rounded-lg p-4 shadow-lg min-h-24 border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {capturedPieces.black.map((piece, index) => (
                  <span key={index} className="text-2xl">{pieceSymbols[piece]}</span>
                ))}
                {capturedPieces.black.length === 0 && (
                  <span className="text-gray-400 text-sm">None captured</span>
                )}
              </div>
            </div>
          </div>

          {/* Chess Board */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="bg-amber-900 p-6 rounded-xl shadow-2xl">
              <div className="grid grid-cols-8 gap-0 border-4 border-amber-800 rounded-lg overflow-hidden">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0;
                    const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
                    const isPossibleMove = possibleMoves.some(([r, c]) => r === rowIndex && c === colIndex);
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-16 h-16 flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 relative
                          ${isLight ? 'bg-amber-100 hover:bg-amber-200' : 'bg-amber-700 hover:bg-amber-600'}
                          ${isSelected ? 'ring-4 ring-blue-400 ring-inset z-10' : ''}
                          ${isPossibleMove ? 'ring-2 ring-green-400 ring-inset' : ''}
                          ${gameState !== 'playing' ? 'cursor-not-allowed' : ''}
                        `}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {piece && (
                          <div 
                            className={`
                              transition-transform duration-200 hover:scale-110 select-none
                              ${getPieceColor(piece) === 'white' ? 'text-white drop-shadow-lg' : 'text-gray-900'}
                            `}
                            style={{ 
                              filter: getPieceColor(piece) === 'white' 
                                ? 'drop-shadow(1px 1px 3px rgba(0,0,0,0.8))' 
                                : 'drop-shadow(1px 1px 2px rgba(255,255,255,0.5))',
                              fontSize: '2.5rem',
                              lineHeight: '1'
                            }}
                          >
                            {pieceSymbols[piece]}
                          </div>
                        )}
                        {isPossibleMove && !piece && (
                          <div className="w-4 h-4 bg-green-400 rounded-full opacity-80"></div>
                        )}
                        {isPossibleMove && piece && (
                          <div className="absolute inset-0 border-4 border-green-400 opacity-50"></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Game Controls */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => resetGame('menu')}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                ← Menu
              </button>
              <button
                onClick={() => resetGame(gameMode)}
                className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                New Game
              </button>
            </div>
          </div>

          {/* Captured Pieces - White & Move History */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-amber-900 mb-3">Captured ♔</h3>
            <div className="bg-white rounded-lg p-4 shadow-lg min-h-24 mb-6 border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {capturedPieces.white.map((piece, index) => (
                  <span key={index} className="text-2xl">{pieceSymbols[piece]}</span>
                ))}
                {capturedPieces.white.length === 0 && (
                  <span className="text-gray-400 text-sm">None captured</span>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-amber-900 mb-3">Move History</h3>
            <div className="bg-white rounded-lg p-4 shadow-lg max-h-64 overflow-y-auto border border-gray-200">
              {moveHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No moves yet</p>
              ) : (
                <div className="space-y-1 text-sm">
                  {moveHistory.map((move, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="font-mono text-xs text-amber-900">{index + 1}.</span>
                      <span className="text-lg">{pieceSymbols[move.piece]}</span>
                      <span className="text-gray-400">→</span>
                      {move.captured && <span className="text-red-600 text-lg">{pieceSymbols[move.captured]}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 text-sm text-amber-700">
          <p>Click a piece to select it, then click a highlighted square to move</p>
          {gameMode === 'vs-ai' && currentPlayer === 'black' && gameState === 'playing' && (
            <p className="text-blue-600 font-medium mt-2">🤖 AI is thinking...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chess;
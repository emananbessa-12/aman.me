"use client";

import { useState, useCallback, useEffect } from 'react';

const Blackjack = () => {
  const [gameState, setGameState] = useState('menu');
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [playerMoney, setPlayerMoney] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [betAmount, setBetAmount] = useState(25);
  const [gameMessage, setGameMessage] = useState('');

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = useCallback(() => {
    const newDeck = [];
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({ suit, value, hidden: false });
      });
    });
    
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
  }, []);

  const getHandValue = useCallback((hand) => {
    let value = 0;
    let aces = 0;
    
    hand.filter(card => !card.hidden).forEach(card => {
      if (card.value === 'A') {
        aces += 1;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    });
    
    for (let i = 0; i < aces; i++) {
      if (value + 11 <= 21) {
        value += 11;
      } else {
        value += 1;
      }
    }
    
    return value;
  }, []);

  const dealCards = useCallback(() => {
    const newDeck = createDeck();
    const newPlayerHand = [newDeck.pop(), newDeck.pop()];
    const newDealerHand = [newDeck.pop(), { ...newDeck.pop(), hidden: true }];
    
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState('playing');
    
    if (getHandValue(newPlayerHand) === 21) {
      setGameMessage('Blackjack! Checking dealer...');
      setTimeout(() => dealerPlay(newDeck, newPlayerHand, newDealerHand), 1000);
    }
  }, [createDeck, getHandValue]);

  const hit = useCallback(() => {
    const newCard = deck.pop();
    const newPlayerHand = [...playerHand, newCard];
    const newDeck = [...deck];
    
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    
    if (getHandValue(newPlayerHand) > 21) {
      setGameMessage('Bust! You lose.');
      setPlayerMoney(prev => prev - currentBet);
      setGameState('gameOver');
    }
  }, [deck, playerHand, getHandValue, currentBet]);

  const stand = useCallback(() => {
    setGameState('dealer');
    setGameMessage('Dealer playing...');
    setTimeout(() => dealerPlay(deck, playerHand, dealerHand), 1000);
  }, [deck, playerHand, dealerHand]);

  const dealerPlay = useCallback((currentDeck, currentPlayerHand, currentDealerHand) => {
    let newDealerHand = currentDealerHand.map(card => ({ ...card, hidden: false }));
    let newDeck = [...currentDeck];
    
    setDealerHand(newDealerHand);
    
    const playDealer = () => {
      const dealerValue = getHandValue(newDealerHand);
      const playerValue = getHandValue(currentPlayerHand);
      
      if (dealerValue < 17) {
        setTimeout(() => {
          const newCard = newDeck.pop();
          newDealerHand = [...newDealerHand, newCard];
          setDealerHand(newDealerHand);
          setDeck(newDeck);
          playDealer();
        }, 1000);
        return;
      }
      
      const finalDealerValue = getHandValue(newDealerHand);
      const finalPlayerValue = getHandValue(currentPlayerHand);
      
      let message = '';
      let moneyChange = 0;
      
      if (finalPlayerValue > 21) {
        message = 'You bust! Dealer wins.';
        moneyChange = -currentBet;
      } else if (finalDealerValue > 21) {
        message = 'Dealer busts! You win!';
        moneyChange = currentBet;
      } else if (finalPlayerValue === 21 && currentPlayerHand.length === 2 && finalDealerValue !== 21) {
        message = 'Blackjack! You win 3:2!';
        moneyChange = Math.floor(currentBet * 1.5);
      } else if (finalPlayerValue > finalDealerValue) {
        message = 'You win!';
        moneyChange = currentBet;
      } else if (finalDealerValue > finalPlayerValue) {
        message = 'Dealer wins.';
        moneyChange = -currentBet;
      } else {
        message = 'Push! It\'s a tie.';
        moneyChange = 0;
      }
      
      setGameMessage(message);
      setPlayerMoney(prev => prev + moneyChange);
      setGameState('gameOver');
    };
    
    playDealer();
  }, [getHandValue, currentBet]);

  const placeBet = useCallback(() => {
    if (betAmount > playerMoney) {
      setGameMessage('Not enough money!');
      return;
    }
    setCurrentBet(betAmount);
    setGameMessage('');
    dealCards();
  }, [betAmount, playerMoney, dealCards]);

  // Enhanced Card component with proper positioning
  const Card = ({ card, className = "" }) => {
    const isRed = ['♥', '♦'].includes(card.suit);
    
    if (card.hidden) {
      return (
        <div className={`w-20 h-28 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 border-2 border-blue-700 rounded-xl flex items-center justify-center shadow-lg relative ${className}`}>
          {/* Card back pattern */}
          <div className="absolute inset-2 border border-blue-400 rounded-lg opacity-30"></div>
          <div className="absolute inset-3 border border-blue-300 rounded-md opacity-20"></div>
          <div className="text-blue-300 text-2xl">🂠</div>
        </div>
      );
    }
    
    return (
      <div className={`w-20 h-28 bg-white border-2 border-gray-300 rounded-xl shadow-lg relative overflow-hidden ${className}`}>
        {/* Top-left corner */}
        <div className={`absolute top-1 left-1 ${isRed ? 'text-red-600' : 'text-black'} leading-none`}>
          <div className="text-sm font-bold">{card.value}</div>
          <div className="text-lg">{card.suit}</div>
        </div>
        
        {/* Center symbol */}
        <div className={`absolute inset-0 flex items-center justify-center ${isRed ? 'text-red-600' : 'text-black'}`}>
          <span className="text-4xl">{card.suit}</span>
        </div>
        
        {/* Bottom-right corner (rotated) */}
        <div className={`absolute bottom-1 right-1 transform rotate-180 ${isRed ? 'text-red-600' : 'text-black'} leading-none`}>
          <div className="text-sm font-bold">{card.value}</div>
          <div className="text-lg">{card.suit}</div>
        </div>
        
        {/* Card value display for face cards */}
        {['J', 'Q', 'K'].includes(card.value) && (
          <div className={`absolute inset-0 flex items-center justify-center ${isRed ? 'text-red-600' : 'text-black'}`}>
            <span className="text-3xl font-bold">{card.value}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-green-800 to-emerald-900 p-4 flex flex-col items-center justify-center">
      
      {/* Casino Header */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2 drop-shadow-lg">🃏 Blackjack</h1>
        <p className="text-green-100 text-lg">Premium Casino Experience</p>
      </div>

      {/* Money Display */}
      <div className="bg-black bg-opacity-60 border-2 border-yellow-400 rounded-xl px-8 py-4 mb-6 shadow-xl">
        <div className="text-yellow-400 text-3xl font-bold tracking-wider">${playerMoney.toLocaleString()}</div>
      </div>

      {gameState === 'menu' ? (
        <div className="text-center max-w-lg">
          <div className="bg-black bg-opacity-70 border-2 border-yellow-400 rounded-xl p-8 shadow-2xl">
            <h2 className="text-yellow-400 text-3xl mb-6 font-bold">Welcome to Blackjack!</h2>
            <p className="text-green-100 mb-8 leading-relaxed text-lg">
              Get as close to 21 as possible without going over.<br/>
              Face cards = 10, Aces = 1 or 11
            </p>
            
            {/* Bet Selection */}
            <div className="mb-8">
              <label className="text-green-100 block mb-4 text-lg font-semibold">Choose your bet:</label>
              <div className="grid grid-cols-2 gap-3">
                {[25, 50, 100, 250].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={amount > playerMoney}
                    className={`px-6 py-3 rounded-lg font-bold transition-all text-lg ${
                      betAmount === amount 
                        ? 'bg-yellow-400 text-black shadow-lg transform scale-105' 
                        : amount <= playerMoney
                        ? 'bg-green-700 text-green-100 hover:bg-green-600 hover:transform hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={placeBet}
              disabled={betAmount > playerMoney}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-700 text-black disabled:text-gray-400 px-12 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl disabled:cursor-not-allowed"
            >
              Deal Cards (${betAmount})
            </button>
            
            {gameMessage && (
              <p className="text-red-400 mt-6 text-lg font-medium">{gameMessage}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          {/* Dealer Section */}
          <div className="text-center mb-12">
            <h3 className="text-green-100 text-2xl mb-6 font-semibold">
              🎩 Dealer {!dealerHand.some(c => c.hidden) && `(${getHandValue(dealerHand)})`}
            </h3>
            <div className="flex gap-4 justify-center flex-wrap">
              {dealerHand.map((card, index) => (
                <Card key={index} card={card} className="animate-pulse hover:transform hover:scale-105 transition-all" />
              ))}
            </div>
          </div>

          {/* Game Message */}
          {gameMessage && (
            <div className="text-center mb-8">
              <div className="bg-black bg-opacity-80 border-2 border-yellow-400 rounded-xl px-8 py-4 inline-block shadow-xl">
                <p className="text-yellow-400 text-2xl font-bold">{gameMessage}</p>
              </div>
            </div>
          )}

          {/* Player Section */}
          <div className="text-center mb-12">
            <h3 className="text-green-100 text-2xl mb-6 font-semibold">
              🎯 Your Hand ({getHandValue(playerHand)})
            </h3>
            <div className="flex gap-4 justify-center flex-wrap">
              {playerHand.map((card, index) => (
                <Card key={index} card={card} className="hover:transform hover:scale-105 transition-all" />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            {gameState === 'playing' && (
              <div className="flex gap-6 justify-center mb-6">
                <button
                  onClick={hit}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl"
                >
                  🎯 Hit
                </button>
                <button
                  onClick={stand}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl"
                >
                  ✋ Stand
                </button>
              </div>
            )}
            
            {gameState === 'gameOver' && (
              <div className="flex gap-6 justify-center mb-6">
                <button
                  onClick={() => {
                    setGameState('menu');
                    setPlayerHand([]);
                    setDealerHand([]);
                    setCurrentBet(0);
                    setGameMessage('');
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl"
                >
                  🏠 New Game
                </button>
                {playerMoney >= betAmount && (
                  <button
                    onClick={placeBet}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl"
                  >
                    🔄 Deal Again (${betAmount})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bet Info */}
          <div className="text-center">
            <div className="bg-black bg-opacity-40 rounded-lg px-6 py-3 inline-block">
              <p className="text-green-200 text-lg">Current Bet: <span className="font-bold text-yellow-400">${currentBet}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {playerMoney <= 0 && gameState === 'gameOver' && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-red-900 border-4 border-red-600 rounded-xl p-12 text-center shadow-2xl max-w-md">
            <h2 className="text-red-300 text-4xl mb-6 font-bold">💸 Game Over!</h2>
            <p className="text-red-100 mb-8 text-xl">You're out of money!</p>
            <button
              onClick={() => {
                setPlayerMoney(1000);
                setGameState('menu');
                setPlayerHand([]);
                setDealerHand([]);
                setCurrentBet(0);
                setGameMessage('');
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              🔄 Restart ($1,000)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blackjack;
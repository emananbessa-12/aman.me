// Create: components/homepage/games/index.jsx
"use client";

import Link from "next/link";
import { FaGamepad, FaMusic, FaRocket, FaSpotify, FaApple } from "react-icons/fa";
import { useState } from "react";

function GamesSection() {
  const [musicConnected, setMusicConnected] = useState(false);

  const handleMusicConnect = (service) => {
    // This will eventually connect to Spotify/Apple Music APIs
    console.log(`Connecting to ${service}...`);
    setMusicConnected(true);
  };

  return (
    <div id="games" className="my-12 lg:my-16 relative">
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8 z-30">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md shadow-lg">
          GAMES
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      
      <div className="text-center mb-12">
        <p className="font-medium text-[#16f2b3] text-xl uppercase mb-4">
          Interactive Projects
        </p>
        <p className="text-gray-200 text-sm lg:text-lg max-w-2xl mx-auto">
          C++ games and interactive experiences showcasing algorithms, data structures, and creative problem-solving.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Games Section - Takes up 2/3 of the width */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-[#0d1224] to-[#0a0d37] border border-[#1b2c68a0] rounded-lg p-8 hover:border-[#16f2b3] transition-all duration-300">
            <div className="text-center mb-8">
              <FaGamepad 
                className="mx-auto mb-6 text-[#16f2b3]" 
                size={60} 
              />
              <h3 className="text-2xl font-bold text-white mb-4">
                C++ Game Collection
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                9 interactive games built from scratch in C++ showcasing different programming concepts and algorithms.
              </p>
            </div>
            
            {/* Game preview grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { name: 'Chess', status: 'coming' },
                { name: 'Snake', status: 'coming' },
                { name: 'Tetris', status: 'coming' },
                { name: 'Blackjack', status: 'coming' },
                { name: 'Minesweeper', status: 'coming' },
                { name: '2048', status: 'coming' },
                { name: 'Solitaire', status: 'coming' },
                { name: 'Connect4', status: 'coming' },
                { name: 'Sudoku', status: 'coming' }
              ].map((game) => (
                <div 
                  key={game.name}
                  className="bg-[#1a1443] p-4 rounded-lg text-center border border-gray-700 hover:border-[#16f2b3] transition-all duration-300 cursor-pointer"
                >
                  <div className="text-white font-medium mb-2">{game.name}</div>
                  <div className="flex items-center justify-center gap-1 text-amber-300 text-xs">
                    <FaRocket size={10} />
                    <span>Coming Soon</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-amber-300 mb-4">
                <FaRocket size={16} />
                <span className="text-sm font-medium">9 Games in Development</span>
              </div>
              <p className="text-gray-400 text-sm">
                Each game will demonstrate different algorithms, data structures, and programming techniques
              </p>
            </div>
          </div>
        </div>

        {/* Music Player Section - Takes up 1/3 of the width */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-[#0d1224] to-[#0a0d37] border border-[#1b2c68a0] rounded-lg p-6 hover:border-[#16f2b3] transition-all duration-300 h-full">
            <div className="text-center">
              <FaMusic 
                className="mx-auto mb-4 text-[#16f2b3]" 
                size={40} 
              />
              <h3 className="text-xl font-bold text-white mb-3">
                Music Player
              </h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Custom music interface with playlist management and audio controls.
              </p>
              
              {/* Music player mockup */}
              <div className="bg-[#1a1443] rounded-lg p-3 mb-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-600 rounded"></div>
                  <div className="text-left flex-1">
                    <div className="w-16 h-2 bg-gray-600 rounded mb-1"></div>
                    <div className="w-12 h-1 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded mb-2">
                  <div className="w-1/3 h-1 bg-[#16f2b3] rounded"></div>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                  <div className="w-5 h-5 bg-[#16f2b3] rounded-full"></div>
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>

              {/* Connection buttons */}
              {!musicConnected ? (
                <div className="space-y-2">
                  <p className="text-gray-400 text-xs mb-3">Connect your music:</p>
                  <button 
                    onClick={() => handleMusicConnect('Spotify')}
                    className="w-full flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white p-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <FaSpotify size={16} />
                    Connect Spotify
                  </button>
                  <button 
                    onClick={() => handleMusicConnect('Apple Music')}
                    className="w-full flex items-center justify-center gap-2 bg-[#fc3c44] hover:bg-[#ff5157] text-white p-2 rounded-lg text-sm transition-colors duration-300"
                  >
                    <FaApple size={16} />
                    Connect Apple Music
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#16f2b3] text-sm">
                    <FaMusic size={14} />
                    <span>Music Connected!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesSection;
"use client";

import Link from "next/link";
import { FaGamepad, FaMusic, FaRocket, FaSpotify, FaApple, FaPlay, FaGithub, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo, FaHeart, FaPlus } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

// Import all game components
import Snake from '../../games/Snake';
import Minesweeper from '../../games/Minesweeper';
import Game2048 from '../../games/Game2048';
import Blackjack from '../../games/Blackjack';
import Chess from '../../games/Chess';
import Wordle from '../../games/Wordle';

function GamesSection() {
  // Music player state
  const [musicConnected, setMusicConnected] = useState(false);
  const [connectedService, setConnectedService] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [userTracks, setUserTracks] = useState([]);
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [showEmbeddedGame, setShowEmbeddedGame] = useState(null);
  const audioRef = useRef(null);

  const handlePlayGame = (componentName) => {
    setShowEmbeddedGame(componentName);
  };

  const closeEmbeddedGame = () => {
    setShowEmbeddedGame(null);
  };

  // Enhanced playlist with coding-focused music
  const defaultPlaylist = [
    {
      id: 1,
      title: "Chill Coding",
      artist: "Lo-Fi Hip Hop",
      src: "/audio/chill-coding.mp3",
      cover: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      duration: "3:24",
      genre: "Lo-Fi"
    },
    {
      id: 2,
      title: "Focus Flow",
      artist: "Study Beats",
      src: "/audio/focus-flow.mp3", 
      cover: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      duration: "4:12",
      genre: "Ambient"
    },
    {
      id: 3,
      title: "Dev Vibes",
      artist: "Code Rhythms", 
      src: "/audio/dev-vibes.mp3",
      cover: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      duration: "2:58",
      genre: "Electronic"
    },
    {
      id: 4,
      title: "Ambient Work",
      artist: "Productivity Sounds",
      src: "/audio/ambient-work.mp3",
      cover: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      duration: "5:17",
      genre: "Ambient"
    },
    {
      id: 5,
      title: "Lo-Fi Beats",
      artist: "Calm Creator",
      src: "/audio/lo-fi-beats.mp3",
      cover: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      duration: "3:45",
      genre: "Lo-Fi"
    }
  ];

  const [playlist, setPlaylist] = useState(defaultPlaylist);

  const completedGames = [
    { 
      name: 'Snake', 
      description: 'Classic arcade game with collision detection',
      component: 'Snake',
      sourceUrl: 'https://github.com/emananbessa-12/cpp-snake',
      algorithms: 'Game loops, collision detection',
      status: 'completed'
    },
    { 
      name: 'Minesweeper', 
      description: 'Grid puzzle with recursive flood fill',
      component: 'Minesweeper',
      sourceUrl: 'https://github.com/emananbessa-12/cpp-minesweeper',
      algorithms: 'Recursion, 2D arrays',
      status: 'completed'
    },
    { 
      name: '2048', 
      description: 'Sliding puzzle with merge algorithms',
      component: 'Game2048',
      sourceUrl: 'https://github.com/emananbessa-12/cpp-2048',
      algorithms: 'Array manipulation, sliding logic',
      status: 'completed'
    },
    { 
      name: 'Blackjack', 
      description: 'Card game with dealer AI and betting',
      component: 'Blackjack',
      sourceUrl: 'https://github.com/emananbessa-12/cpp-blackjack',
      algorithms: 'Card logic, probability, AI',
      status: 'completed'
    },
    { 
      name: 'Chess', 
      description: 'Complete chess engine with AI opponent',
      component: 'Chess',
      sourceUrl: 'https://github.com/emananbessa-12/cpp-chess',
      algorithms: 'Advanced algorithms, checkmate detection',
      status: 'completed'
    },
    { 
      name: 'Wordle', 
      description: 'Word puzzle with dictionary validation',
      component: 'Wordle',
      sourceUrl: null, // Wordle was web-only
      algorithms: 'String processing, game logic',
      status: 'completed'
    }
  ];

  const upcomingGames = [
    { name: 'Tetris', status: 'planned' },
    { name: 'Solitaire', status: 'planned' },
    { name: 'Connect4', status: 'planned' }
  ];

  // YouTube Music Integration (Free Alternative)
  const connectYouTubeMusic = async () => {
    setIsLoading(true);
    try {
      // Simulate loading popular coding/focus tracks
      const youtubeTracks = [
        {
          id: 'yt_1',
          title: "Deep Focus Music",
          artist: "Ambient Study",
          src: "/audio/deep-focus.mp3", // You'd use actual audio files
          cover: "linear-gradient(135deg, #FF0000 0%, #FF4444 100%)",
          duration: "60:00",
          genre: "Ambient",
          isYouTube: true
        },
        {
          id: 'yt_2', 
          title: "Coding Beats",
          artist: "Lo-Fi Hip Hop",
          src: "/audio/coding-beats.mp3",
          cover: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)",
          duration: "45:30",
          genre: "Lo-Fi",
          isYouTube: true
        }
      ];
      
      setUserTracks(youtubeTracks);
      setPlaylist([...defaultPlaylist, ...youtubeTracks]);
      setConnectedService('YouTube Music');
      setMusicConnected(true);
    } catch (error) {
      console.error('YouTube Music connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apple Music API Integration
  const connectAppleMusic = async () => {
    setIsLoading(true);
    try {
      // In production, you'd implement Apple Music API
      const appleTracks = [
        {
          id: 'apple_1',
          title: "Deep Focus",
          artist: "Brain.fm",
          src: "https://music.apple.com/track/example1",
          cover: "linear-gradient(135deg, #FC3C44 0%, #FF5157 100%)",
          duration: "6:30",
          genre: "Focus",
          isAppleMusic: true
        }
      ];
      
      setUserTracks(appleTracks);
      setPlaylist([...defaultPlaylist, ...appleTracks]);
      setConnectedService('Apple Music');
      setMusicConnected(true);
    } catch (error) {
      console.error('Apple Music connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced music player functions
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
        
        // Track music play
        if (playlist[currentTrack]) {
          fetch('/api/track-interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'music_played',
              item: playlist[currentTrack].title,
              additional: playlist[currentTrack].artist
            })
          }).catch(console.error);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    let next;
    if (shuffle) {
      next = Math.floor(Math.random() * playlist.length);
    } else {
      next = (currentTrack + 1) % playlist.length;
    }
    setCurrentTrack(next);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      // If more than 3 seconds in, restart current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      const prev = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
      setCurrentTrack(prev);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current && duration) {
      const newTime = (e.target.value / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTrackEnd = () => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  const toggleFavorite = (trackId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
    } else {
      newFavorites.add(trackId);
    }
    setFavorites(newFavorites);
  };

  const playTrack = (index) => {
    setCurrentTrack(index);
    setCurrentTime(0);
    setShowPlaylist(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleTrackEnd);
      audio.volume = volume;
      
      // Auto-play when track changes
      if (isPlaying) {
        audio.play().catch(console.error);
      }
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [currentTrack, volume, isPlaying, repeat]);

  const handleMusicConnect = (service) => {
    if (service === 'Spotify' || service === 'Apple Music') {
      setSelectedService(service);
      setShowApiModal(true);
    } else {
      // Demo mode
      setConnectedService('Demo');
      setMusicConnected(true);
    }
  };

  const closeApiModal = () => {
    setShowApiModal(false);
    setSelectedService('');
  };

  // API Cost Modal Component
  const ApiCostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1443] border-2 border-[#16f2b3] rounded-xl p-6 max-w-md mx-auto relative">
        <button
          onClick={closeApiModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
        
        <div className="text-center mb-4">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold text-[#16f2b3] mb-2">Feature Temporarily Disabled</h3>
          <div className="w-16 h-0.5 bg-[#16f2b3] mx-auto"></div>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <div className="bg-[#0d1224] border border-gray-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">{selectedService} Integration</h4>
            <p className="text-sm leading-relaxed">
              {selectedService === 'Spotify' ? 
                'Spotify Web API integration requires costly commercial licensing and quota management for production use.' :
                'Apple Music API requires a $99/year Apple Developer membership plus additional streaming licenses for commercial applications.'
              }
            </p>
          </div>
          
          <div className="text-sm text-gray-400">
            <p className="mb-2"><strong className="text-white">Why it's disabled:</strong></p>
            <ul className="space-y-1 text-xs">
              <li>• API costs can be $500-2000+ monthly for commercial use</li>
              <li>• Complex licensing requirements for streaming</li>
              <li>• Rate limiting affects user experience</li>
              <li>• Better to demonstrate functionality with demo mode</li>
            </ul>
          </div>
          
          <div className="bg-[#16f2b3] bg-opacity-10 border border-[#16f2b3] rounded-lg p-3">
            <p className="text-[#16f2b3] text-sm font-medium">
              💡 Try the Demo Player instead! It showcases all the same functionality without API restrictions.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              closeApiModal();
              handleMusicConnect('Demo');
            }}
            className="flex-1 bg-[#16f2b3] hover:bg-[#14d19f] text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Demo Player
          </button>
          <button
            onClick={closeApiModal}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div id="games" className="my-12 lg:my-16 relative">
      {/* API Cost Modal */}
      {showApiModal && <ApiCostModal />}
      
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8 z-10">
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
          Games built from scratch in C++, recreated in JavaScript for web play with full source code available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Games Section */}
        <div className="lg:col-span-2">
          {showEmbeddedGame ? (
            /* Embedded Game View */
            <div className="bg-gradient-to-r from-[#0d1224] to-[#0a0d37] border border-[#1b2c68a0] rounded-lg p-4 hover:border-[#16f2b3] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  🎮 Playing {completedGames.find(g => g.component === showEmbeddedGame)?.name || 'Game'}
                </h3>
                <button
                  onClick={closeEmbeddedGame}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  ← Back to Games
                </button>
              </div>
              
              {/* Direct Component Rendering */}
              <div className="w-full">
                {showEmbeddedGame === 'Snake' && <Snake />}
                {showEmbeddedGame === 'Minesweeper' && <Minesweeper />}
                {showEmbeddedGame === 'Game2048' && <Game2048 />}
                {showEmbeddedGame === 'Blackjack' && <Blackjack />}
                {showEmbeddedGame === 'Chess' && <Chess />}
                {showEmbeddedGame === 'Wordle' && <Wordle />}
              </div>
              
              <div className="text-center mt-4 text-gray-400 text-sm">
                Full game experience embedded in your portfolio!
              </div>
            </div>
          ) : (
            /* Games Grid View */
          <div className="bg-gradient-to-r from-[#0d1224] to-[#0a0d37] border border-[#1b2c68a0] rounded-lg p-8 hover:border-[#16f2b3] transition-all duration-300">
            <div className="text-center mb-8">
              <FaGamepad 
                className="mx-auto mb-6 text-[#16f2b3]" 
                size={60} 
              />
              <h3 className="text-2xl font-bold text-white mb-4">
                Game Programming Portfolio
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Complete games showcasing algorithms, data structures, and full-stack development skills.
              </p>
            </div>
            
            {/* Completed Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {completedGames.map((game) => (
                <div 
                  key={game.name}
                  className="bg-[#1a1443] p-4 rounded-lg border border-gray-700 hover:border-[#16f2b3] transition-all duration-300"
                >
                  <div className="text-white font-medium mb-2 text-lg">{game.name}</div>
                  <p className="text-gray-400 text-sm mb-3">{game.description}</p>
                  <p className="text-xs text-amber-300 mb-4">{game.algorithms}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlayGame(game.component)}
                      className="flex items-center gap-2 bg-[#16f2b3] hover:bg-[#14d19f] text-black px-3 py-2 rounded text-sm font-medium transition-colors duration-300 flex-1 justify-center"
                    >
                      <FaPlay size={12} />
                      Play Online
                    </button>
                    {game.sourceUrl ? (
                      <Link 
                        href={game.sourceUrl}
                        target="_blank"
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors duration-300"
                      >
                        <FaGithub size={12} />
                        C++
                      </Link>
                    ) : (
                      <div className="flex items-center gap-1 bg-blue-700 text-white px-3 py-2 rounded text-sm">
                        <span className="text-xs">Web Only</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Games */}
            {upcomingGames.length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <div className="text-center mb-4">
                  <span className="text-gray-400 text-sm">Future Projects:</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {upcomingGames.map((game) => (
                    <div 
                      key={game.name}
                      className="bg-[#0a0d37] p-3 rounded text-center border border-gray-800"
                    >
                      <div className="text-gray-400 text-sm mb-1">{game.name}</div>
                      <div className="flex items-center justify-center gap-1 text-amber-300 text-xs">
                        <FaRocket size={8} />
                        <span>Planned</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Enhanced Music Player Section */}
        <div className="lg:col-span-1 relative z-20">
          <div className="bg-gradient-to-r from-[#0d1224] to-[#0a0d37] border border-[#1b2c68a0] rounded-lg p-6 hover:border-[#16f2b3] transition-all duration-300 h-full relative z-20">
            <div className="text-center">
              <FaMusic 
                className="mx-auto mb-4 text-[#16f2b3]" 
                size={40} 
              />
              <h3 className="text-xl font-bold text-white mb-3">
                Music Player
              </h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Advanced music player with streaming service integration and smart features.
              </p>
              
              {musicConnected ? (
                /* Advanced Music Player Interface */
                <div className="bg-[#1a1443] rounded-lg p-4 border border-gray-700">
                  {/* Service Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {connectedService === 'Demo' && <FaMusic className="text-[#16f2b3]" />}
                      <span>Connected to {connectedService}</span>
                    </div>
                    <button
                      onClick={() => setShowPlaylist(!showPlaylist)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FaPlus size={12} className={showPlaylist ? 'rotate-45' : ''} style={{ transition: 'transform 0.2s' }} />
                    </button>
                  </div>

                  {/* Playlist View */}
                  {showPlaylist ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      <h4 className="text-white text-sm font-medium mb-2">Playlist ({playlist.length} tracks)</h4>
                      {playlist.map((track, index) => (
                        <div
                          key={track.id}
                          onClick={() => playTrack(index)}
                          className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                            index === currentTrack ? 'bg-[#16f2b3] bg-opacity-20 border border-[#16f2b3]' : 'hover:bg-gray-700'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded flex items-center justify-center text-xs"
                            style={{ background: track.cover }}
                          >
                            {index === currentTrack && isPlaying ? '🎵' : '♪'}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-white text-xs font-medium truncate">{track.title}</div>
                            <div className="text-gray-400 text-xs truncate">{track.artist}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(track.id);
                            }}
                            className={`${favorites.has(track.id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-400 transition-colors`}
                          >
                            <FaHeart size={10} />
                          </button>
                          <span className="text-gray-500 text-xs">{track.duration}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Now Playing View */
                    <>
                      {/* Current Track Display */}
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg relative overflow-hidden"
                          style={{ background: playlist[currentTrack]?.cover }}
                        >
                          {isPlaying && <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">♪</div>}
                          🎵
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">
                            {playlist[currentTrack]?.title}
                          </div>
                          <div className="text-gray-400 text-xs truncate">
                            {playlist[currentTrack]?.artist}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {playlist[currentTrack]?.genre}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(playlist[currentTrack]?.id)}
                          className={`${favorites.has(playlist[currentTrack]?.id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-400 transition-colors`}
                        >
                          <FaHeart size={14} />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={duration ? (currentTime / duration) * 100 : 0}
                          onChange={handleSeek}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #16f2b3 0%, #16f2b3 ${duration ? (currentTime / duration) * 100 : 0}%, #374151 ${duration ? (currentTime / duration) * 100 : 0}%, #374151 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Enhanced Controls */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => setShuffle(!shuffle)}
                          className={`${shuffle ? 'text-[#16f2b3]' : 'text-gray-400'} hover:text-white transition-colors`}
                        >
                          <FaRandom size={12} />
                        </button>
                        
                        <div className="flex items-center gap-4">
                          <button
                            onClick={prevTrack}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <FaStepBackward size={16} />
                          </button>
                          <button
                            onClick={togglePlay}
                            disabled={isLoading}
                            className="bg-[#16f2b3] hover:bg-[#14d19f] text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            {isLoading ? '⏳' : isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                          </button>
                          <button
                            onClick={nextTrack}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <FaStepForward size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => setRepeat(!repeat)}
                          className={`${repeat ? 'text-[#16f2b3]' : 'text-gray-400'} hover:text-white transition-colors`}
                        >
                          <FaRedo size={12} />
                        </button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-2">
                        <FaVolumeUp size={12} className="text-gray-400" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume * 100}
                          onChange={handleVolumeChange}
                          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #16f2b3 0%, #16f2b3 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                          }}
                        />
                        <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}</span>
                      </div>
                    </>
                  )}

                  {/* Hidden Audio Element */}
                  <audio
                    ref={audioRef}
                    src={playlist[currentTrack]?.src}
                    preload="metadata"
                  />
                </div>
              ) : (
                /* Connection Interface */
                <>
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
                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs mb-3">Connect your music or try demo:</p>
                    <button 
                      onClick={() => handleMusicConnect('Demo')}
                      className="w-full flex items-center justify-center gap-2 bg-[#16f2b3] hover:bg-[#14d19f] text-black p-2 rounded-lg text-sm transition-colors duration-300 font-medium"
                    >
                      <FaMusic size={16} />
                      Try Demo Player
                    </button>
                    <button 
                      onClick={() => handleMusicConnect('Spotify')}
                      className="w-full flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white p-2 rounded-lg text-sm transition-colors duration-300 relative group"
                    >
                      <FaSpotify size={16} />
                      Connect Spotify
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleMusicConnect('Apple Music')}
                      className="w-full flex items-center justify-center gap-2 bg-[#fc3c44] hover:bg-[#ff5157] text-white p-2 rounded-lg text-sm transition-colors duration-300 relative group"
                    >
                      <FaApple size={16} />
                      Connect Apple Music
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesSection;
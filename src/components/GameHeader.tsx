import React from 'react';

interface GameHeaderProps {
  minesLeft: number;
  time: number;
  gameStatus: 'playing' | 'won' | 'lost';
  onReset: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ minesLeft, time, gameStatus, onReset }) => {
  const getStatusEmoji = () => {
    switch (gameStatus) {
      case 'won': return '😎';
      case 'lost': return '😵';
      default: return '😊';
    }
  };

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(3, '0');
  };

  const formatMines = (mines: number) => {
    return mines.toString().padStart(3, '0');
  };

  return (
    <div className="flex items-center justify-between bg-gray-200 border-2 border-gray-400 p-4 mb-4">
      <div className="bg-black text-red-500 px-3 py-1 font-mono text-xl border border-gray-500">
        {formatMines(minesLeft)}
      </div>
      
      <button
        onClick={onReset}
        className="text-3xl hover:scale-110 transition-transform duration-200 border-2 border-gray-400 bg-gray-300 hover:bg-gray-200 px-2 py-1"
      >
        {getStatusEmoji()}
      </button>
      
      <div className="bg-black text-red-500 px-3 py-1 font-mono text-xl border border-gray-500">
        {formatTime(time)}
      </div>
    </div>
  );
};

export default GameHeader;
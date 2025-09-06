import React from 'react';
import { Cell as CellType } from '../types/game';

interface CellProps {
  cell: CellType;
  onLeftClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

const Cell: React.FC<CellProps> = ({ cell, onLeftClick, onRightClick, gameStatus }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;
    onLeftClick(cell.x, cell.y);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;
    onRightClick(cell.x, cell.y);
  };

  const getCellContent = () => {
    if (cell.isFlagged && !cell.isRevealed) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines === 0) return '0';
    return cell.adjacentMines.toString();
  };

  const getCellClass = () => {
    let baseClass = 'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer select-none transition-all duration-100';
    
    if (!cell.isRevealed) {
      baseClass += ' bg-gray-300 hover:bg-gray-200 shadow-sm';
      if (cell.isFlagged) {
        baseClass += ' bg-yellow-200';
      }
    } else {
      baseClass += ' bg-gray-100';
      if (cell.isMine) {
        baseClass += ' bg-red-500 text-white';
      } else {
        // Color coding for numbers
        const numberColors = {
          0: 'text-gray-400',
          1: 'text-blue-600',
          2: 'text-green-600',
          3: 'text-red-600',
          4: 'text-purple-600',
          5: 'text-yellow-600',
          6: 'text-pink-600',
          7: 'text-black',
          8: 'text-gray-600'
        };
        if (cell.adjacentMines >= 0) {
          baseClass += ` ${numberColors[cell.adjacentMines as keyof typeof numberColors]}`;
        }
      }
    }
    
    return baseClass;
  };

  return (
    <div
      className={getCellClass()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {getCellContent()}
    </div>
  );
};

export default Cell;
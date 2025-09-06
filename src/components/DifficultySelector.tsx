import React from 'react';
import { Difficulty } from '../types/game';

interface DifficultySelectorProps {
  difficulties: Difficulty[];
  selectedDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulties,
  selectedDifficulty,
  onSelect
}) => {
  return (
    <div className="mb-4">
      <div className="flex gap-2 justify-center">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.name}
            onClick={() => onSelect(difficulty)}
            className={`px-4 py-2 border-2 font-semibold transition-all duration-200 ${
              selectedDifficulty.name === difficulty.name
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300'
            }`}
          >
            {difficulty.name}
            <div className="text-xs opacity-80">
              {difficulty.rows}×{difficulty.cols} ({difficulty.mines} mines)
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
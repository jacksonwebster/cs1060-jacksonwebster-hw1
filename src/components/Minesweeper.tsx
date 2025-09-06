import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty } from '../types/game';
import {
  createBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkWinCondition,
  revealAllMines,
  DIFFICULTIES
} from '../utils/gameLogic';
import Cell from './Cell';
import GameHeader from './GameHeader';
import DifficultySelector from './DifficultySelector';

const Minesweeper: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createBoard(difficulty.rows, difficulty.cols),
    gameStatus: 'playing',
    minesCount: difficulty.mines,
    flagsCount: 0,
    startTime: null,
    endTime: null
  }));
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.gameStatus === 'playing' && gameState.startTime) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - gameState.startTime!) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.gameStatus, gameState.startTime]);

  const resetGame = useCallback(() => {
    setGameState({
      board: createBoard(difficulty.rows, difficulty.cols),
      gameStatus: 'playing',
      minesCount: difficulty.mines,
      flagsCount: 0,
      startTime: null,
      endTime: null
    });
    setTime(0);
    setFirstClick(true);
  }, [difficulty]);

  // Reset game when difficulty changes
  useEffect(() => {
    resetGame();
  }, [difficulty, resetGame]);

  const handleLeftClick = (x: number, y: number) => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.board[y][x].isFlagged || gameState.board[y][x].isRevealed) return;

    let newBoard = gameState.board;
    let newStartTime = gameState.startTime;

    // First click - place mines and start timer
    if (firstClick) {
      newBoard = placeMines(gameState.board, difficulty.mines, x, y);
      newStartTime = Date.now();
      setFirstClick(false);
    }

    // Reveal the cell
    newBoard = revealCell(newBoard, x, y);

    // Check if clicked on a mine
    if (newBoard[y][x].isMine) {
      setGameState(prev => ({
        ...prev,
        board: revealAllMines(newBoard),
        gameStatus: 'lost',
        endTime: Date.now()
      }));
      return;
    }

    // Check win condition
    const hasWon = checkWinCondition(newBoard);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      gameStatus: hasWon ? 'won' : 'playing',
      startTime: newStartTime,
      endTime: hasWon ? Date.now() : null
    }));
  };

  const handleRightClick = (x: number, y: number) => {
    if (gameState.gameStatus !== 'playing') return;

    const newBoard = toggleFlag(gameState.board, x, y);
    const flagDelta = newBoard[y][x].isFlagged ? 1 : -1;

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      flagsCount: prev.flagsCount + flagDelta
    }));
  };

  const minesLeft = difficulty.mines - gameState.flagsCount;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 shadow-lg border-2 border-gray-400">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          💣 Minesweeper
        </h1>
        
        <DifficultySelector
          difficulties={DIFFICULTIES}
          selectedDifficulty={difficulty}
          onSelect={setDifficulty}
        />

        <GameHeader
          minesLeft={minesLeft}
          time={time}
          gameStatus={gameState.gameStatus}
          onReset={resetGame}
        />

        <div 
          className="inline-block border-2 border-gray-400 bg-gray-300 p-2"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${difficulty.cols}, 1fr)`,
            gap: '1px'
          }}
        >
          {gameState.board.map((row, y) =>
            row.map((cell, x) => (
              <Cell
                key={`${x}-${y}`}
                cell={cell}
                onLeftClick={handleLeftClick}
                onRightClick={handleRightClick}
                gameStatus={gameState.gameStatus}
              />
            ))
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Left click to reveal • Right click to flag</p>
          {gameState.gameStatus === 'won' && (
            <p className="text-green-600 font-bold mt-2">
              🎉 Congratulations! You won in {time} seconds!
            </p>
          )}
          {gameState.gameStatus === 'lost' && (
            <p className="text-red-600 font-bold mt-2">
              💥 Game Over! Click the face to try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;
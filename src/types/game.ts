export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  x: number;
  y: number;
}

export interface GameState {
  board: Cell[][];
  gameStatus: 'playing' | 'won' | 'lost';
  minesCount: number;
  flagsCount: number;
  startTime: number | null;
  endTime: number | null;
}

export interface Difficulty {
  rows: number;
  cols: number;
  mines: number;
  name: string;
}
import { Cell, Difficulty } from '../types/game';

export const DIFFICULTIES: Difficulty[] = [
  { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
  { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  { name: 'Expert', rows: 16, cols: 30, mines: 99 }
];

export function createBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];
  
  for (let y = 0; y < rows; y++) {
    board[y] = [];
    for (let x = 0; x < cols; x++) {
      board[y][x] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
        x,
        y
      };
    }
  }
  
  return board;
}

export function placeMines(board: Cell[][], minesCount: number, firstClickX: number, firstClickY: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
  let placedMines = 0;
  
  while (placedMines < minesCount) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    
    // Don't place mine on first click or if already has mine
    if (!newBoard[y][x].isMine && !(x === firstClickX && y === firstClickY)) {
      newBoard[y][x].isMine = true;
      placedMines++;
    }
  }
  
  // Calculate adjacent mines for each cell
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!newBoard[y][x].isMine) {
        newBoard[y][x].adjacentMines = countAdjacentMines(newBoard, x, y);
      }
    }
  }
  
  return newBoard;
}

function countAdjacentMines(board: Cell[][], x: number, y: number): number {
  let count = 0;
  const rows = board.length;
  const cols = board[0].length;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        if (board[newY][newX].isMine) count++;
      }
    }
  }
  
  return count;
}

export function revealCell(board: Cell[][], x: number, y: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
  
  // Only reveal the single clicked cell
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (!newBoard[y][x].isRevealed && !newBoard[y][x].isFlagged) {
      newBoard[y][x].isRevealed = true;
    }
  }
  
  return newBoard;
}

export function toggleFlag(board: Cell[][], x: number, y: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  if (!newBoard[y][x].isRevealed) {
    newBoard[y][x].isFlagged = !newBoard[y][x].isFlagged;
  }
  
  return newBoard;
}

export function checkWinCondition(board: Cell[][]): boolean {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      const cell = board[y][x];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map(row => 
    row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed
    }))
  );
}
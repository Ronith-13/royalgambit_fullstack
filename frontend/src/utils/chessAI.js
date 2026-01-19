// Chess AI implementation with 3 difficulty levels
import { getLegalMoves, makeMove, isCheck, isCheckmate, isStalemate } from './chessLogic.js';

// Piece values for evaluation
const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// Piece-square tables for positional evaluation
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];

const QUEEN_TABLE = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0,  0],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

const KING_TABLE_MIDDLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

// Evaluate board position
function evaluateBoard(board, color) {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      const pieceValue = PIECE_VALUES[piece.type];
      let positionalValue = 0;
      
      // Add positional value based on piece-square tables
      if (piece.type === 'pawn') {
        positionalValue = piece.color === 'white' 
          ? PAWN_TABLE[7 - row][col] 
          : PAWN_TABLE[row][col];
      } else if (piece.type === 'knight') {
        positionalValue = piece.color === 'white'
          ? KNIGHT_TABLE[7 - row][col]
          : KNIGHT_TABLE[row][col];
      } else if (piece.type === 'bishop') {
        positionalValue = piece.color === 'white'
          ? BISHOP_TABLE[7 - row][col]
          : BISHOP_TABLE[row][col];
      } else if (piece.type === 'rook') {
        positionalValue = piece.color === 'white'
          ? ROOK_TABLE[7 - row][col]
          : ROOK_TABLE[row][col];
      } else if (piece.type === 'queen') {
        positionalValue = piece.color === 'white'
          ? QUEEN_TABLE[7 - row][col]
          : QUEEN_TABLE[row][col];
      } else if (piece.type === 'king') {
        positionalValue = piece.color === 'white'
          ? KING_TABLE_MIDDLE[7 - row][col]
          : KING_TABLE_MIDDLE[row][col];
      }
      
      if (piece.color === color) {
        score += pieceValue + positionalValue;
      } else {
        score -= pieceValue + positionalValue;
      }
    }
  }
  
  // Check bonus/penalty
  if (isCheck(board, color === 'white' ? 'black' : 'white')) {
    score += 50;
  }
  if (isCheck(board, color)) {
    score -= 50;
  }
  
  return score;
}

// Get all possible moves for a color
function getAllMoves(board, color) {
  const moves = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const legalMoves = getLegalMoves(board, { row, col }, color);
        for (const move of legalMoves) {
          moves.push({
            from: { row, col },
            to: move
          });
        }
      }
    }
  }
  
  return moves;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, alpha, beta, maximizingPlayer, color) {
  const opponentColor = color === 'white' ? 'black' : 'white';
  
  // Terminal conditions
  if (depth === 0) {
    return { score: evaluateBoard(board, color), move: null };
  }
  
  if (isCheckmate(board, opponentColor)) {
    return { score: 100000 - depth, move: null };
  }
  
  if (isCheckmate(board, color)) {
    return { score: -100000 + depth, move: null };
  }
  
  if (isStalemate(board, opponentColor) || isStalemate(board, color)) {
    return { score: 0, move: null };
  }
  
  const currentColor = maximizingPlayer ? color : opponentColor;
  const moves = getAllMoves(board, currentColor);
  
  if (moves.length === 0) {
    return { score: evaluateBoard(board, color), move: null };
  }
  
  let bestMove = moves[0];
  let bestScore = maximizingPlayer ? -Infinity : Infinity;
  
  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const result = minimax(newBoard, depth - 1, alpha, beta, !maximizingPlayer, color);
    const score = result.score;
    
    if (maximizingPlayer) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
    }
    
    if (beta <= alpha) {
      break; // Alpha-beta pruning
    }
  }
  
  return { score: bestScore, move: bestMove };
}

// Easy AI: Random move
export function getEasyMove(board, color) {
  const moves = getAllMoves(board, color);
  if (moves.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

// Medium AI: Minimax with depth 2-3
export function getMediumMove(board, color) {
  const depth = Math.random() > 0.5 ? 2 : 3;
  const result = minimax(board, depth, -Infinity, Infinity, true, color);
  return result.move;
}

// Hard AI: Minimax with depth 4-5
export function getHardMove(board, color) {
  const depth = Math.random() > 0.3 ? 4 : 5;
  const result = minimax(board, depth, -Infinity, Infinity, true, color);
  return result.move;
}

// Main AI function
export function getAIMove(board, color, difficulty) {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, color);
    case 'medium':
      return getMediumMove(board, color);
    case 'hard':
      return getHardMove(board, color);
    default:
      return getEasyMove(board, color);
  }
}

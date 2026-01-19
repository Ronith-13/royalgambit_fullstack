// Chess logic utilities

// Create initial board state
export function createInitialBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));

  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Place other pieces
  const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieceOrder[col], color: 'black' };
    board[7][col] = { type: pieceOrder[col], color: 'white' };
  }

  return board;
}

// Check if a position is within board bounds
function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Get all squares between two positions (for sliding pieces)
function getSquaresBetween(from, to) {
  const squares = [];
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;
  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
  
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;
  
  while (currentRow !== to.row || currentCol !== to.col) {
    squares.push({ row: currentRow, col: currentCol });
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return squares;
}

// Check if path is clear (for sliding pieces)
function isPathClear(board, from, to) {
  const squares = getSquaresBetween(from, to);
  return squares.every(sq => board[sq.row][sq.col] === null);
}

// Get piece moves based on type
function getPieceMoves(board, row, col, piece) {
  const moves = [];
  const { type, color } = piece;

  switch (type) {
    case 'pawn':
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;
      
      // Move forward one square
      if (isValidPosition(row + direction, col) && board[row + direction][col] === null) {
        moves.push({ row: row + direction, col });
        
        // Move forward two squares from starting position
        if (row === startRow && board[row + 2 * direction][col] === null) {
          moves.push({ row: row + 2 * direction, col });
        }
      }
      
      // Capture diagonally
      for (const colOffset of [-1, 1]) {
        const newRow = row + direction;
        const newCol = col + colOffset;
        if (isValidPosition(newRow, newCol)) {
          const target = board[newRow][newCol];
          if (target && target.color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
      break;

    case 'rook':
      const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [rowDir, colDir] of rookDirections) {
        for (let i = 1; i < 8; i++) {
          const newRow = row + rowDir * i;
          const newCol = col + colDir * i;
          if (!isValidPosition(newRow, newCol)) break;
          if (board[newRow][newCol] === null) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (board[newRow][newCol].color !== color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        }
      }
      break;

    case 'bishop':
      const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [rowDir, colDir] of bishopDirections) {
        for (let i = 1; i < 8; i++) {
          const newRow = row + rowDir * i;
          const newCol = col + colDir * i;
          if (!isValidPosition(newRow, newCol)) break;
          if (board[newRow][newCol] === null) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (board[newRow][newCol].color !== color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        }
      }
      break;

    case 'queen':
      const queenDirections = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [rowDir, colDir] of queenDirections) {
        for (let i = 1; i < 8; i++) {
          const newRow = row + rowDir * i;
          const newCol = col + colDir * i;
          if (!isValidPosition(newRow, newCol)) break;
          if (board[newRow][newCol] === null) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (board[newRow][newCol].color !== color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        }
      }
      break;

    case 'king':
      const kingDirections = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [rowDir, colDir] of kingDirections) {
        const newRow = row + rowDir;
        const newCol = col + colDir;
        if (isValidPosition(newRow, newCol)) {
          if (board[newRow][newCol] === null || board[newRow][newCol].color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
      break;

    case 'knight':
      const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [rowOffset, colOffset] of knightMoves) {
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        if (isValidPosition(newRow, newCol)) {
          if (board[newRow][newCol] === null || board[newRow][newCol].color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
      break;
  }

  return moves;
}

// Check if a move would put own king in check
function wouldPutKingInCheck(board, from, to, color) {
  const testBoard = JSON.parse(JSON.stringify(board));
  testBoard[to.row][to.col] = testBoard[from.row][from.col];
  testBoard[from.row][from.col] = null;
  
  return isCheck(testBoard, color);
}

// Get legal moves for a piece (excluding moves that put own king in check)
export function getLegalMoves(board, from, currentPlayer) {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== currentPlayer) {
    return [];
  }

  const possibleMoves = getPieceMoves(board, from.row, from.col, piece);
  
  // Filter out moves that would put own king in check
  return possibleMoves.filter(move => {
    return !wouldPutKingInCheck(board, from, move, currentPlayer);
  });
}

// Check if a move is valid
export function isValidMove(board, from, to, currentPlayer) {
  const legalMoves = getLegalMoves(board, from, currentPlayer);
  return legalMoves.some(move => move.row === to.row && move.col === to.col);
}

// Make a move on the board
export function makeMove(board, from, to) {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  
  // Pawn promotion (simplified - always promotes to queen)
  if (newBoard[to.row][to.col]?.type === 'pawn') {
    if (to.row === 0 && newBoard[to.row][to.col].color === 'white') {
      newBoard[to.row][to.col] = { type: 'queen', color: 'white' };
    } else if (to.row === 7 && newBoard[to.row][to.col].color === 'black') {
      newBoard[to.row][to.col] = { type: 'queen', color: 'black' };
    }
  }
  
  return newBoard;
}

// Find king position
function findKing(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

// Check if a color is in check
export function isCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const opponentColor = color === 'white' ? 'black' : 'white';
  
  // Check if any opponent piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const moves = getPieceMoves(board, row, col, piece);
        if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Check if a color is in checkmate
export function isCheckmate(board, color) {
  if (!isCheck(board, color)) {
    return false;
  }

  // Check if there are any legal moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const legalMoves = getLegalMoves(board, { row, col }, color);
        if (legalMoves.length > 0) {
          return false;
        }
      }
    }
  }

  return true;
}

// Check if a color is in stalemate
export function isStalemate(board, color) {
  if (isCheck(board, color)) {
    return false;
  }

  // Check if there are any legal moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const legalMoves = getLegalMoves(board, { row, col }, color);
        if (legalMoves.length > 0) {
          return false;
        }
      }
    }
  }

  return true;
}

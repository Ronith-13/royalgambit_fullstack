import React, { useState, useEffect } from 'react'
import './ChessBoard.css'

const pieceSymbols = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
}

function ChessBoard({ board, onSquareClick, selectedSquare, legalMoves, currentPlayer, lastMove }) {
  const [animatingPieces, setAnimatingPieces] = useState(new Map())
  const [capturedPieces, setCapturedPieces] = useState(new Set())

  // Track piece movements for animation
  useEffect(() => {
    if (lastMove) {
      // Add animation class to moved piece
      const pieceKey = `${lastMove.to.row}-${lastMove.to.col}`
      setAnimatingPieces(prev => new Map(prev.set(pieceKey, 'moving')))
      
      // Remove animation after it completes
      const timer = setTimeout(() => {
        setAnimatingPieces(prev => {
          const newMap = new Map(prev)
          newMap.delete(pieceKey)
          return newMap
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [lastMove])

  const isSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col
  }

  const isLegalMove = (row, col) => {
    return legalMoves.some(move => move.row === row && move.col === col)
  }

  const isLastMoveSquare = (row, col) => {
    if (!lastMove) return false
    return (lastMove.from.row === row && lastMove.from.col === col) ||
           (lastMove.to.row === row && lastMove.to.col === col)
  }

  const renderSquare = (row, col) => {
    const isLight = (row + col) % 2 === 0
    const squareClass = `square ${isLight ? 'light' : 'dark'} ${
      isSelected(row, col) ? 'selected' : ''
    } ${isLegalMove(row, col) ? 'legal-move' : ''} ${
      isLastMoveSquare(row, col) ? 'last-move' : ''
    }`
    
    const piece = board[row][col]
    const pieceSymbol = piece ? pieceSymbols[piece.color][piece.type] : ''
    const pieceKey = `${row}-${col}`
    const animationClass = animatingPieces.get(pieceKey) || ''

    return (
      <div
        key={`${row}-${col}`}
        className={squareClass}
        onClick={() => onSquareClick(row, col)}
      >
        {pieceSymbol && (
          <span 
            key={`${pieceKey}-${piece?.type}-${piece?.color}`}
            className={`piece ${piece.color} ${piece.type} ${animationClass}`}
          >
            {pieceSymbol}
          </span>
        )}
        {isLegalMove(row, col) && !piece && (
          <div className="legal-move-indicator" />
        )}
        {isLegalMove(row, col) && piece && piece.color !== currentPlayer && (
          <div className="capture-indicator" />
        )}
      </div>
    )
  }

  const renderRow = (row) => {
    return (
      <div key={row} className="board-row">
        <div className="row-label">{8 - row}</div>
        {Array.from({ length: 8 }, (_, col) => renderSquare(row, col))}
      </div>
    )
  }

  return (
    <div className="chess-board-container">
      <div className="board-wrapper">
        <div className="column-labels">
          <div></div>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className="column-label">{letter}</div>
          ))}
        </div>
        <div className="chess-board">
          {Array.from({ length: 8 }, (_, row) => renderRow(row))}
        </div>
      </div>
    </div>
  )
}

export default ChessBoard

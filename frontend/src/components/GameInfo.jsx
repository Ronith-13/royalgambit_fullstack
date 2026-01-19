import React from 'react'
import './GameInfo.css'

function GameInfo({ currentPlayer, gameStatus, inCheck, moveHistory, onReset }) {
  const getStatusMessage = () => {
    if (gameStatus === 'playing') {
      if (inCheck[currentPlayer]) {
        return `⚠️ ${currentPlayer === 'white' ? 'White' : 'Black'} is in CHECK!`
      }
      return `${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`
    } else if (gameStatus.startsWith('checkmate-')) {
      const winner = gameStatus.split('-')[1]
      return `🏆 Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins!`
    } else if (gameStatus === 'stalemate') {
      return '🤝 Stalemate! The game is a draw.'
    }
    return ''
  }

  return (
    <div className="game-info">
      <div className="status-card">
        <h3>Game Status</h3>
        <div className={`status-message ${gameStatus !== 'playing' ? 'game-over' : ''}`}>
          {getStatusMessage()}
        </div>
      </div>

      <div className="moves-card">
        <h3>Move History</h3>
        <div className="moves-list">
          {moveHistory.length === 0 ? (
            <p className="no-moves">No moves yet</p>
          ) : (
            moveHistory.map((move, index) => {
              const fromSquare = String.fromCharCode(97 + move.from.col) + (8 - move.from.row)
              const toSquare = String.fromCharCode(97 + move.to.col) + (8 - move.to.row)
              return (
                <div key={index} className="move-item">
                  <span className="move-number">{index + 1}.</span>
                  <span className="move-text">
                    {move.piece.type.charAt(0).toUpperCase() + move.piece.type.slice(1)} 
                    {' '}from {fromSquare} to {toSquare}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      <button className="reset-button" onClick={onReset}>
        🔄 New Game
      </button>
    </div>
  )
}

export default GameInfo
